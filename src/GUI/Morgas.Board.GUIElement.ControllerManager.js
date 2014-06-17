(function(µ,SMOD,GMOD){

	var GUI=GMOD("GUIElement");
	
	var SC=GMOD("shortcut")({
		rs:"rescope",
		mapping:"ControllerMapping",
		ctrl:"Controller"
	});
	
	var template=
	'<select class="devices"></select><button data-action="addDevice">add Device</button>'+
	'<table class="controllers"></table>';
	var MANAGER=GUI.ControllerManager=µ.Class(GUI,{
		init:function(param)
		{
			this.superInit(GUI,"ControllerManager");
			SC.rs.all(["onClick"],this);
			this.domElement.addEventListener("click",this.onClick);
			
			param=param||{};
			param.styleClass=param.styleClass||"overlay";
			this.addStyleClass(param.styleClass);
			
			this.domElement.innerHTML=template;
			
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
					html+='<option>'+gamepads[i].id+'<option>';
				}
				this.domElement.querySelector(".devices").innerHTML=html;
			}

			if(this.layer&&this.layer.board&&(part===undefined||part==="controllers"))
			{
				var ctrls=this.layer.board.controllers;
				var html="";
				for(var i=0;i<ctrls.length;i++)
				{
					var controller=ctrls[i].controller;
					html+=
					'<tr>'+
						'<td class="controller-index">'+
							i+
						'</td><td class="controller-device">';
							if (controller instanceof SC.ctrl.Keyboard)
							{
								html+="Keyboard";
							}
							else
							{
								html+=controller.gamepad.id;
							}
							html+=
						'</td><td class="controller-mapping">'+
							(controller.mapping&&controller.mapping.getValueOf("name")||"")
						'</td>'+
						'</td><td class="controller-player">'+
							ctrls[i].player||""
						'</td>'+
					'</tr>';
				}
				this.domElement.querySelector(".controllers").innerHTML=html;
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
	SMOD("ControllerManager",MANAGER);
	
})(Morgas,Morgas.setModule,Morgas.getModule)