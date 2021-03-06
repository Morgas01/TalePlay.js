(function(µ,SMOD,GMOD,HMOD,SC){
	
	SC=SC({
		rs:"rescope",
		mapping:"Controller.Mapping"
	});
	
	var controllerTypes={
		Keyboard:1,
		Gamepad:2
	};
	
	var GUI=GMOD("GUIElement");
	
	var getTitle=function(code)
	{
		var title="";
		switch(code)
		{
			case 32:
			case " ":
				title="space";
				break;
			case 16:
				title="shift";
				break;
			case 19:
				title="pause";
				break;
			case 13:
				title="enter";
				break;
			case 37:
				title="left";
				break;
			case 38:
				title="up";
				break;
			case 39:
				title="right";
				break;
			case 40:
				title="down";
				break;
			case 96:
				title="num 0";
				break;
			case 97:
				title="num 1";
				break;
			case 98:
				title="num 2";
				break;
			case 99:
				title="num 3";
				break;
			case 100:
				title="num 4";
				break;
			case 101:
				title="num 5";
				break;
			case 102:
				title="num 6";
				break;
			case 103:
				title="num 7";
				break;
			case 104:
				title="num 8";
				break;
			case 105:
				title="num 9";
				break;
			default:
				if(typeof code==="string")
				{
					title=code;
				}
				else
				{
					title=String.fromCharCode(code);
				}
		}
		
		return title;
	};
	var getHTML=function(buttons,analogSticks,name)
	{
		var html='';
		if(name)
		{
			html+='<input type="text" data-field="name"';
			if(typeof name==="string")
			{
				html+=' value="'+name+'"';
			}
			html+='>';
		}
		html+='<div class="buttons">';
		for(var i=0;i<buttons;i++)
		{
			html+=
			'<span class="button">'+
				'<span>'+i+'</span>'+
				'<input type="text" size="3" data-button="'+i+'">'+
			'</span>';
		}
		html+='</div><div class="analogSticks">';
		for(var i=0;i<analogSticks*2;i+=2)
		{
			html+=
			'<span class="analogStick">'+
				'<span>'+(i/2)+'</span>'+
				'<label class="axisButton" for="axisButton'+(i/2)+'"> buttons </label><input class="axisButton" type="checkbox" id="axisButton'+(i/2)+'">'+
				'<span>'+
					'<input type="text" size="3" class="axis-y pos" data-axis="'+(i+1)+'">'+
					'<input type="text" size="3" class="axis-x pos" data-axis="'+i+'">'+
					'<input type="text" size="3" class="axis-y neg" data-axis="-'+(i+1)+'">'+
					'<input type="text" size="3" class="axis-x neg" data-axis="-'+i+'">'+
				'</span>'+
			'</span>';
		}
		html+='</div><button data-value="ok">OK</button><button data-value="cancel">Cancel</button>';
		return html;
	};
	
	
	var CONF=GUI.ControllerConfig=µ.Class(GUI,
	{
		init:function(param)
		{
			param=param||{};
			this.mega(param);
			SC.rs.all(this,["onInputChange","onClick"]);
			this.createListener("submit");
			
			this.addStyleClass("ControllerConfig");
			this.domElement.addEventListener("keydown",this.onInputChange,true);
			this.domElement.addEventListener("click",this.onClick,true);
			
			this.domElement.innerHTML=getHTML(param.buttons,param.analogSticks,param.name);
			
			this.controllerType=0;
			this.controller=null;
			this.setController(param.controller)
		},
		setController:function(controller)
		{
			if(this.controller!==controller)
			{
				if(this.controller)
				{
					this.controller.setMapping(this.oldMapping);
					this.controller.removeListener("analogStickChanged buttonChanged",this,this.controllerChanged);
					
					this.controllerType=0;
					this.domElement.classList.remove("Keyboard");
					this.domElement.classList.remove("Gamepad");
					
					this.controller=null;
				}
				this.controller=controller||null;
			}
			if(this.controller)
			{
				if(HMOD("Controller.Keyboard")&&this.controller instanceof GMOD("Controller.Keyboard"))
				{
					this.controllerType=controllerTypes.Keyboard;
					this.domElement.classList.add("Keyboard");
				}
				else
				{
					this.controllerType=controllerTypes.Gamepad;
					this.domElement.classList.add("Gamepad");
					this.controller.addListener("analogStickChanged buttonChanged",this,"controllerChanged");
				}
				this.oldMapping=this.controller.getMapping();
				this.controller.setMapping(null);
				
				if(this.oldMapping)
				{
					var reverseMap=this.oldMapping.getReverseMapping();
	
					var buttons=this.getButtons();
					for(var i=0;i<buttons.length;i++)
					{
						var btn=buttons[i];
						btn.value=reverseMap.buttons[btn.dataset.button];
						if(controller===controllerTypes.Keyboard)
						{
							btn.title=getTitle(reverseMap.buttons[btn.dataset.button]);
						}
					}
	
					var axes=this.getAxes();
					for(var i=0;i<axes.length;i++)
					{
						var axis=axes[i];
						axis.value=reverseMap.axes[axis.dataset.axis];
						if(controller===controllerTypes.Keyboard)
						{
							axis.title=getTitle(reverseMap.axes[axis.dataset.axis]);
						}
					}
	
					var axisButtons=this.getAxisButtons();
					for(var i=0;i<axisButtons.length;i++)
					{
						var btnAxis=axisButtons[i];
						btnAxis.value=reverseMap.buttonAxis[btnAxis.dataset.axis];
						if(controller===controllerTypes.Keyboard)
						{
							btnAxis.title=getTitle(reverseMap.buttonAxis[btnAxis.dataset.axis]);
						}
					}
				}
			}
		},
		getButtons:function()
		{
			return this.domElement.querySelectorAll("input[data-button]");
		},
		getAxisButtons:function()
		{
			if(this.controllerType===controllerTypes.Keyboard)
			{
				return this.domElement.querySelectorAll(".analogStick [data-axis]");
			}
			else
			{
				return this.domElement.querySelectorAll(".axisButton:checked+* > input");
			}
		},
		getAxes:function()
		{
			if(this.controllerType!==controllerTypes.Keyboard)
			{
				return this.domElement.querySelectorAll(".axisButton:not(:checked)+* > .pos");
			}
			else
			{
				return [];
			}
		},
		onInputChange:function(event)
		{
			if(event.target.tagName==="INPUT"&&event.target.dataset.field!=="name"&&event.key!=="Backspace"&&this.controllerType===controllerTypes.Keyboard)
			{
				event.preventDefault();
				event.stopPropagation();
				
				var input=event.target;
				input.value=event.code;
				input.title=getTitle(event.code);
			}
		},
		onClick:function(event)
		{
			if(event.target.tagName==="BUTTON")
			{
				this.fire("submit",{value:event.target.dataset.value})
			}
		},
		controllerChanged:function(event)
		{
			if(event.type==="buttonChanged"&&							//button changed
			  (document.activeElement.dataset.button!==undefined||		//& button input
			   document.activeElement.dataset.axis!==undefined&&		// || buttonAxis input
			  (document.activeElement.parentNode.previousSibling.checked===true||this.controllerType===controllerTypes.Keyboard)))
			{
				document.activeElement.value=event.index;
			}
			else if(event.type==="analogStickChanged"&&						//axis changed
					document.activeElement.dataset.axis!==undefined&&		//&& axis input
					document.activeElement.parentNode.previousSibling.checked===false)
			{
				var x=Math.abs(event.analogStick.x),
				y=Math.abs(event.analogStick.y);
				if(x>0.5||y>0.5)
				{
					if(x>y)
					{
						var sign="";
						if(event.analogStick.x<0)
						{
							sign="-";
						}
						document.activeElement.value=sign+(event.index*2);
					}
					else
					{
						var sign="";
						if(event.analogStick.y<0)
						{
							sign="-";
						}
						document.activeElement.value=sign+(event.index*2+1);
					}
				}
			}
		},
		getData:function()
		{
			var data={
					buttons:{},
					buttonAxis:{},
					axes:{}
			};
			var btns=this.getButtons();
			for(var i=0;i<btns.length;i++)
			{
				var btn=btns[i];
				data.buttons[btn.value]=btn.dataset.button;
			}
			var buttonAxis=this.getAxisButtons();
			for(var i=0;i<buttonAxis.length;i++)
			{
				data.buttonAxis[buttonAxis[i].value]=buttonAxis[i].dataset.axis;
			}
			var axes=this.getAxes();
			for(var i=0;i<axes.length;i++)
			{
				var axis=axes[i];
				var from=axis.value;
				var to=axis.dataset.axis;
				if(1/from<0)
				{
					from=-from;
					to="-"+to;
				}
				data.axes[from]=to;
			}
			return data;
		},
		getMapping:function()
		{
			var type="";
			switch (this.controllerType)
			{
				case controllerTypes.Keyboard:
					type="KEYBOARD";
					break;
				case controllerTypes.Gamepad:
					type="GAMEPAD";
					break;
			}
			var name=this.domElement.querySelector('[data-field="name"]');
			if(name)
			{
				name=name.value;
			}
			return new SC.mapping({data:this.getData(),type:type,name:name});
		},
		destroy:function()
		{
			this.setController(null);
			this.mega();
		}
	});
	SMOD("GUI.ControllerConfig",CONF);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);