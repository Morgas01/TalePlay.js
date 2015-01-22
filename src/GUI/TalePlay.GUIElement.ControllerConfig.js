(function(µ,SMOD,GMOD,HMOD){
	
	let SC=GMOD("shortcut")({
		rs:"rescope",
		mapping:"Controller.Mapping"
	});
	
	let controllerTypes={
		Keyboard:1,
		Gamepad:2
	};
	
	let GUI=GMOD("GUIElement");
	
	let getTitle=function(code)
	{
		let title="";
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
	let getHTML=function(buttons,analogSticks,name)
	{
		let html='';
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
		for(let i=0;i<buttons;i++)
		{
			html+=
			'<span class="button">'+
				'<span>'+i+'</span>'+
				'<input type="text" size="3" data-button="'+i+'">'+
			'</span>';
		}
		html+='</div><div class="analogSticks">';
		for(let i=0;i<analogSticks*2;i+=2)
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
	
	
	let CONF=GUI.ControllerConfig=µ.Class(GUI,
	{
		init:function(param)
		{
			param=param||{};
			this.superInit(GUI,param);
			SC.rs.all(["onInputChange","onClick"],this);
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
					let reverseMap=this.oldMapping.getReverseMapping();
	
					let buttons=this.getButtons();
					for(let i=0;i<buttons.length;i++)
					{
						let btn=buttons[i];
						btn.value=reverseMap.buttons[btn.dataset.button];
						if(controller===controllerTypes.Keyboard)
						{
							btn.title=getTitle(reverseMap.buttons[btn.dataset.button]);
						}
					}
	
					let axes=this.getAxes();
					for(let i=0;i<axes.length;i++)
					{
						let axis=axes[i];
						axis.value=reverseMap.axes[axis.dataset.axis];
						if(controller===controllerTypes.Keyboard)
						{
							axis.title=getTitle(reverseMap.axes[axis.dataset.axis]);
						}
					}
	
					let axisButtons=this.getAxisButtons();
					for(let i=0;i<axisButtons.length;i++)
					{
						let btnAxis=axisButtons[i];
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
				
<<<<<<< HEAD
				var input=event.target;
				input.value=event.code||event.key||event.keyCode;
				input.title=getTitle(event.code||event.key||event.keyCode);
=======
				let input=event.target;
				input.value=event.code||event.key;
				input.title=getTitle(event.code||event.key);
>>>>>>> master
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
				let x=Math.abs(event.analogStick.x),
				y=Math.abs(event.analogStick.y);
				if(x>0.5||y>0.5)
				{
					if(x>y)
					{
						let sign="";
						if(event.analogStick.x<0)
						{
							sign="-";
						}
						document.activeElement.value=sign+(event.index*2);
					}
					else
					{
						let sign="";
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
			let data={
					buttons:{},
					buttonAxis:{},
					axes:{}
			};
			let btns=this.getButtons();
			for(let i=0;i<btns.length;i++)
			{
				let btn=btns[i];
				data.buttons[btn.value]=btn.dataset.button;
			}
			let buttonAxis=this.getAxisButtons();
			for(let i=0;i<buttonAxis.length;i++)
			{
				data.buttonAxis[buttonAxis[i].value]=buttonAxis[i].dataset.axis;
			}
			let axes=this.getAxes();
			for(let i=0;i<axes.length;i++)
			{
				let axis=axes[i];
				let from=axis.value;
				let to=axis.dataset.axis;
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
			let type="";
			switch (this.controllerType)
			{
				case controllerTypes.Keyboard:
					type="KEYBOARD";
					break;
				case controllerTypes.Gamepad:
					type="GAMEPAD";
					break;
			}
			let name=this.domElement.querySelector('[data-field="name"]');
			if(name)
			{
				name=name.value;
			}
			return new SC.mapping({data:this.getData(),type:type,name:name});
		},
		destroy:function()
		{
			this.setController(null);
			GUI.prototype.destroy.call(this);
		}
	});
	SMOD("GUI.ControllerConfig",CONF);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);
