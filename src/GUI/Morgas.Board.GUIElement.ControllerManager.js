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
	'<select class="devices"></select><button data-action="addDevice">add Device</button>';
	var MANAGER=GUI.ControllerManager=µ.Class(GUI,{
		init:function(param)
		{
			this.superInit(GUI,"ControllerManager");
			SC.rs.all(["onClick"],this);
			this.domElement.addEventListener("click",this.onClick);
			
			param=param||{};
			param.styleClass=param.styleClass||"overlay";
			this.addStyleClass(param.styleClass);
			
			this.controllers=new SC.GMenu({
				type:SC.GMenu.Types.TABLE,
				selectionType:SC.Menu.SelectionTypes.single,
				converter:MANAGER.controllerConverter,
			});
			
			this.domElement.innerHTML=template;
			
			this.domElement.appendChild(this.controllers.domElement);
			
			this.mappings=new ORG();
			
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
		addController:function(controller)
		{
			this.layer.board.addController(controller);
			this.update();
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
	SMOD("GUI.ControllerManager",MANAGER);
	
})(Morgas,Morgas.setModule,Morgas.getModule)