(function(µ,SMOD,GMOD){
	
	//TODO change to Layer
	
	var GUI=GMOD("GUIElement");
	
	var SC=GMOD("shortcut")({
		rs:"rescope",
		bind:"bind",
		mapping:"Controller.Mapping",
		ctrlK:"Controller.Keyboard",
		ctrlG:"Controller.Gamepad",
		GMenu:"GUI.Menu",
		config:"GUI.ControllerConfig"
	});
	
	var template=
	'<table>'+
		'<tr>'+
			'<td class="DeviceActions">'+
				'<select class="devices"></select>'+
				'<button data-action="addDevice">add Device</button>'+
				'<button data-action="removeController">remove Controller</button>'+
			'</td>'+
			'<td class="MappingActions">'+
				'<button data-action="newMapping">New</button>'+
				'<button data-action="setMapping">Set</button>'+
				'<button data-action="editMapping">Edit</button>'+
				'<button data-action="deleteMapping">Delete</button>'+
			'</td>'+
		'</tr>'+
		'<tr>'+
			'<td class="controllers"></td>'+
			'<td class="mappings"></td>'+
		'</tr>'+
	'</table>'+
	'<button data-action="close">OK</button>';
	var MANAGER=GUI.ControllerManager=µ.Class(GUI,{
		init:function(param)
		{
			param=param||{};
			param.styleClass=param.styleClass||"overlay";
			
			this.mega(param);
			this.addStyleClass("ControllerManager");
			SC.rs.all(["_Click","_playerChanged","_mappingsLoaded"],this);
			this.domElement.addEventListener("click",this._Click);

			this.buttons=param.buttons!==undefined ? param.buttons : 10;
			this.analogSticks=param.analogSticks!==undefined ? param.analogSticks : 2;

			this.controllers=new SC.GMenu({
				type:SC.GMenu.Types.TABLE,
				header:["No.","Device","Mapping","Player"],
				selectionType:SC.GMenu.SelectionTypes.SINGLE,
				converter:MANAGER.controllerConverter
			});
			this.controllers.addListener("select",this,"_MenuSelect");

			param.mappings=param.mappings||[];
			param.mappings.unshift(null);
			this.mappings=new SC.GMenu({
				type:SC.GMenu.Types.TABLE,
				header:["Name","Type"],
				selectionType:SC.GMenu.SelectionTypes.SINGLE,
				converter:MANAGER.mappingConverter,
				items:param.mappings
			});
			this.mappings.addListener("select",this,"_MenuSelect");
			
			this.dbConn=param.dbConn||null;
			if(this.dbConn)
			{
				this.dbConn.load(SC.mapping,{}).complete(this._mappingsLoaded);
			}

            this.config=null;
			
			this.domElement.innerHTML=template;

			this.domElement.querySelector(".controllers").addEventListener("change",this._playerChanged);
			this.domElement.querySelector(".controllers").appendChild(this.controllers.domElement);
			this.domElement.querySelector(".mappings").appendChild(this.mappings.domElement);
			
			this.update();
			
			this._gamepadListener=SC.bind(this.update,this,"devices");
			window.addEventListener("gamepadconnected",this._gamepadListener);
		},
		update:function(part)
		{
			if(part===undefined||part==="devices")
			{
				var html='<option>Keyboard</option>';
				var gamepads=navigator.getGamepads();
				for(var i=0;i<gamepads.length;i++)
				{
					if(gamepads[i])
					{
						html+='<option>'+gamepads[i].id+'</option>';
					}
				}
				this.domElement.querySelector(".devices").innerHTML=html;
			}

			if(this.layer&&this.layer.board&&(part===undefined||part==="controllers"))
			{
				this.controllers.clear().addAll(this.layer.board.controllers)
			}

			if(part===undefined||part==="actions")
			{
				var controller=this.controllers.getSelectedItems()[0],
				mapping=this.mappings.getSelectedItems()[0];

				this.domElement.querySelector('[data-action="removeController"]').disabled=
					this.domElement.querySelector('[data-action="newMapping"]').disabled=!controller;
				this.domElement.querySelector('[data-action="setMapping"]').disabled=!controller||!mapping;
				this.domElement.querySelector('[data-action="editMapping"]').disabled=!controller||!controller.value.controller.getMapping();
				this.domElement.querySelector('[data-action="deleteMapping"]').disabled=!mapping;
			}
		},
		_mappingsLoaded:function(mappings)
		{
			this.mappings.addAll(mappings);
		},
		_Click:function(event)
		{
			var action=event.target.dataset.action;
			if(action!==undefined)
			{
				event.stopPropagation();
				this[action]();
			}
		},
		addDevice:function()
		{
			var index=this.domElement.querySelector(".devices").selectedIndex;
			if(index===0)
			{
				this.addController(new SC.ctrlK());
			}
			else
			{
				var gamepad=navigator.getGamepads()[--index];
				this.addController(new SC.ctrlG(gamepad));
			}
		},
		removeController:function()
		{
			var controller=this.controllers.getSelectedItems()[0];
			if(controller)
			{
				this.layer.board.removeController(controller.value.controller);
				this.update("controllers");
			}
		},
		newMapping:function()
		{
			this._openControllerConfig(true);
		},
		setMapping:function()
		{
			var controller=this.controllers.getSelectedItems()[0],
			mapping=this.mappings.getSelectedItems()[0];
			if(controller&&mapping)
			{
				controller.value.controller.setMapping(mapping.value);
				this.update("controllers");
			}
		},
		editMapping:function()
		{
			this._openControllerConfig(false);
		},
		deleteMapping:function()
		{
			var mapping=this.mappings.getSelectedItems()[0];
			if(mapping&&mapping.value!==null)
			{
				this.mappings.removeItem(mapping.value);
				if(this.dbConn&&mapping.value.getID()!==undefined)
				{
					this.dbConn["delete"](SC.mapping,mapping.value);
				}
			}
		},
		addController:function(controller)
		{
			this.layer.board.addController(controller);
			this.update("controllers");
		},
		_MenuSelect:function()
		{
			this.update("actions");
		},
		_openControllerConfig:function(isNew)
		{
			var controller=this.controllers.getSelectedItems()[0];
			if(controller&&!this.config)
			{
				controller=controller.value.controller;
				var mapping=controller.getMapping();
                this.config=new SC.config({
					buttons:this.buttons,
					analogSticks:this.analogSticks,
					controller:controller,
					name:!!isNew
				});
				if(isNew)
				{
					controller.setMapping(null);
				}
				else if (!mapping)
				{
					return false;
				}
				this.config.addStyleClass("panel","overlay");
				this.layer.add(this.config);
				this.config.addListener("submit:once",this,function(event)
				{
					switch(true)
					{
						case event.value==="ok":
							if(isNew)//make new mapping
							{
								mapping=event.source.getMapping();
								this.mappings.addItem(mapping);
							}
							else//update mapping
							{
								mapping.setValueOf("data",event.source.getData());
							}
							if(this.dbConn&&(isNew||mapping.getID()!==undefined))
							{
								this.dbConn.save(mapping);
							}
						case !!isNew://reset old mapping or set new
							controller.setMapping(mapping);
					}
					event.source.destroy();
                    this.config=null;
					this.update("controllers");
				});
				return true;
			}
			return false;
		},
		close:function()
		{
			if(this.layer&&this.layer.board)this.layer.board.focus();
			this.destroy();
		},
		_playerChanged:function(event)
		{
			if(event.target.dataset.controllerindex!==undefined)
			{
				this.layer.board.controllers[event.target.dataset.controllerindex].player=1*event.target.value||1;
			}
		},
		destroy:function()
		{
			this.mega();
			window.removeEventListener("gamepadconnected",this._gamepadListener);
		}
	});
	MANAGER.controllerConverter=function(item,index,selected)
	{
		return [
			index,
			(item.controller instanceof SC.ctrlK)?"Keyboard":item.controller.gamepad.id,
			((item.controller.mapping&&item.controller.mapping.getValueOf("name"))||"None"),
			'<input type="number" min="1" value="'+item.player+'" data-controllerindex="'+index+'" >'
	    ];
	};
	MANAGER.mappingConverter=function(item,index,selected)
	{
		if(!item)
		{
			return ["none",""];
		}
		else
		{
			return [item.getValueOf("name"),item.getValueOf("type")];
		}
	};
	SMOD("GUI.ControllerManager",MANAGER);
	
})(Morgas,Morgas.setModule,Morgas.getModule);