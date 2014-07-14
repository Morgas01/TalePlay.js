(function(µ,SMOD,GMOD){

	var GUI=GMOD("GUIElement"),
	ORG=GMOD("Organizer");
	
	var SC=GMOD("shortcut")({
		rs:"rescope",
		mapping:"ControllerMapping",
		ctrl:"Controller",
		GMenu:"GUI.Menu",
		Menu:"Menu"
	});
	
	var template=
	'<table>'+
		'<tr>'+
			'<td>'+
				'<select class="devices"></select>'+
				'<button data-action="addDevice">add Device</button>'+
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
	'</table>';
	var MANAGER=GUI.ControllerManager=µ.Class(GUI,{
		init:function(param)
		{
			this.superInit(GUI,"ControllerManager");
			SC.rs.all(["onClick","onMenuSelect"],this);
			this.domElement.addEventListener("click",this.onClick);
			
			param=param||{};
			param.styleClass=param.styleClass||"overlay";
			this.addStyleClass(param.styleClass);

			this.controllers=new SC.GMenu({
				type:SC.GMenu.Types.TABLE,
				selectionType:SC.Menu.SelectionTypes.single,
				converter:MANAGER.controllerConverter,
			});
			this.controllers.addListener("select",this.onMenuSelect);

			param.mappings=param.mappings||[];
			param.mappings.unshift(null);
			this.mappings=new SC.GMenu({
				type:SC.GMenu.Types.TABLE,
				selectionType:SC.Menu.SelectionTypes.single,
				converter:MANAGER.mappingConverter,
				items:param.mappings
			});
			this.mappings.addListener("select",this.onMenuSelect);
			
			this.domElement.innerHTML=template;

			this.domElement.querySelector(".controllers").appendChild(this.controllers.domElement);
			this.domElement.querySelector(".mappings").appendChild(this.mappings.domElement);
			
			this.update();

			var _self=this;
			window.addEventListener("gamepadconnected",function()
			{
				_self.update("devices");
			});
		},
		update:function(part)
		{
			if(part===undefined||part==="devices")
			{
				var html='<option>Keyboard</option>';
				var gamepads=navigator.getGamepads();
				for(var i=0;i<gamepads.length;i++)
				{
					html+='<option>'+gamepads[i].id+'</option>';
				}
				this.domElement.querySelector(".devices").innerHTML=html;
			}

			if(this.layer&&this.layer.board&&(part===undefined||part==="controllers"))
			{
				this.controllers.clear().addAll(this.layer.board.controllers)
			}

			if(part===undefined||part==="MappingActions")
			{
				var controller=this.controllers.getSelectedItems()[0],
				mapping=this.mappings.getSelectedItems()[0];

				this.domElement.querySelector('.MappingActions [data-action="setMapping"]').disabled=!controller||!mapping;
				this.domElement.querySelector('.MappingActions [data-action="editMapping"]').disabled=
					this.domElement.querySelector('.MappingActions [data-action="deleteMapping"]').disabled=!mapping;
			}
		},
		onClick:function(event)
		{
			var action=event.target.dataset.action;
			if(action!==undefined)
			{
				this[action]();
			}
		},
		addDevice:function()
		{
			var index=this.domElement.querySelector(".devices").selectedIndex;
			if(index===0)
			{
				this.addController(new SC.ctrl.Keyboard());
			}
			else
			{
				var gamepad=navigator.getGamepads()[--index];
				this.addController(new SC.ctrl.Gamepad(gamepad));
			}
		},
		newMapping:function()
		{
			//TODO
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
			//TODO
		},
		deleteMapping:function()
		{
			var mapping=this.mappings.getSelectedItems()[0];
			if(mapping&&mapping.value!==null)
			{
				this.mappings.removeItem(mapping.value);
			}
		},
		addController:function(controller)
		{
			this.layer.board.addController(controller);
			this.update();
		},
		onMenuSelect:function()
		{
			this.update("MappingActions");
		}
	});
	MANAGER.controllerConverter=function(item,index,selected)
	{
		return [
			index,
			(item.controller instanceof SC.ctrl.Keyboard)?"Keyboard":item.controller.gamepad.id,
			(item.controller.mapping&&item.controller.mapping.getValueOf("name")||"None"),
			'<input type="number" min="1" value="'+item.player+'" >'
	    ];
	}
	MANAGER.mappingConverter=function(item,index,selected)
	{
		if(!item)
		{
			return ["none",""];
		}
		else
		{
			return [
			        item.getValueOf("name"),
			        item.getValueOf("type")
		    ];
		}
	}
	SMOD("GUI.ControllerManager",MANAGER);
	
})(Morgas,Morgas.setModule,Morgas.getModule)