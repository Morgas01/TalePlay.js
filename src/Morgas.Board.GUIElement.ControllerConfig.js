(function(µ,SMOD,GMOD){
	
	var SC=GMOD("shortcut")({
		rs:"rescope",
		mapping:"ControllerMapping",
		ctrl:"Controller"
	});
	
	var GUI=GMOD("GUIElement");
	var getTitle=function(code)
	{
		code=~~code;
		var title="";
		switch(code)
		{
			case 32:
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
				title=String.fromCharCode(code);
		}
		
		return title;
	};
	var getHTML=function(buttons,analogSticks,controller)
	{
		var reverseMap=null;
		if(controller.mapping)
		{
			reverseMap=controller.mapping.getReverseMapping();
		}
		var html='<div class="buttons">';
		for(var i=0;i<buttons;i++)
		{
			var value=i;
			if(reverseMap&&reverseMap.buttons[i]!==undefined)
			{
				value=reverseMap.buttons[i];
			}
			var title=getTitle(value);
			html+='<span class="button">'+
				'<span>'+i+'</span>'+
				'<input type="text" size="3" data-button="'+i+'" value="'+value+'" title="'+title+'">'+
			'</span>';
		}
		html+='</div><div class="analogSticks">';
		for(var i=0;i<analogSticks*2;i+=2)
		{
			var x=i,y=i+1,
			negX=0,negY=0;
			if(reverseMap)
			{
				//TODO buttonAxis
				if(reverseMap.buttonAxis[i]!==undefined)
				{
					x=reverseMap.buttonAxis[i];
				}
				if(reverseMap.buttonAxis["-"+i]!==undefined)
				{
					negX=reverseMap.buttonAxis["-"+i];
				}
				if(reverseMap.buttonAxis[i+1]!==undefined)
				{
					y=reverseMap.buttonAxis[i+1];
				}
				if(reverseMap.buttonAxis["-"+(i+1)]!==undefined)
				{
					negY=reverseMap.buttonAxis["-"+(i+1)];
				}
				
/*
				if(reverseMap.axes[i]!==undefined)
				{
					x=reverseMap.axes[i];
				}
				else if (reverseMap.axes[-i]!==undefined)
				{
					x=reverseMap.axes[-i];
				}
				if(reverseMap.axes[i+1]!==undefined)
				{
					y=reverseMap.axes[i+1];
				}
				else if (reverseMap.axes[-i-1]!==undefined)
				{
					y=reverseMap.axes[-i-1];
				}
*/
			}

			var titleX=getTitle(x);
			var titleNegX=getTitle(negX);
			var titleY=getTitle(y);
			var titleNegY=getTitle(negY);
			html+='<span class="analogStick">'+
				'<span>'+(i/2)+'</span>'+
				'<label class="axisButton" for="axisButton'+(i/2)+'"> buttons </label><input class="axisButton" type="checkbox" id="axisButton'+(i/2)+'">'+
				'<span>'+
					'<input type="text" size="3" class="axis-y pos" data-axis="'+(i+1)+'" value="'+y+'" title="'+titleY+'">'+
					'<label class="invert-axis-y"> invert <input type="checkbox"></label>'+
					'<input type="text" size="3" class="axis-x pos" data-axis="'+i+'" value="'+x+'" title="'+titleX+'">'+
					'<label class="invert-axis-x"> invert <input type="checkbox"></label>'+
					'<input type="text" size="3" class="axis-y neg" data-axis="-'+(i+1)+'" value="'+negY+'" title="'+titleNegY+'">'+
					'<input type="text" size="3" class="axis-x neg" data-axis="-'+i+'" value="'+negX+'" title="'+titleNegX+'">'+
				'</span>'+
			'</span>';
		}
		html+="</div>";
		return html;
	};
	
	var CONF=GUI.ControllerConfig=µ.Class(GUI,
	{
		init:function(param)
		{
			this.superInit(GUI);
			SC.rs.all(["onInputChange"],this);
			param=param||{};
			
			this.domElement.classList.add("ControllerConfig");
			this.domElement.addEventListener("keydown",this.onInputChange,false);
			
			this.controller=param.controller;
			
			this.domElement.innerHTML=getHTML(param.buttons,param.analogSticks,this.controller);
			
			if(this.controller instanceof SC.ctrl.Keyboard)
			{
				this.domElement.classList.add("Keyboard");
				this.controller.setDisabled(true);
				var axisButtons=this.domElement.querySelectorAll(".axisButton");
				for(var i=0;i<axisButtons.length;i++)
				{
					axisButtons[i].checked=true;
				}
			}
			else
			{
				this.controller.addListener("analogStickChanged buttonChanged",this.controllerChanged)
			}
		},
		onInputChange:function(event)
		{
			event.preventDefault();
			event.stopPropagation();
			
			var input=event.originalTarget;
			input.value=event.keyCode;
			input.title=getTitle(event.keyCode);
		},
		controllerChanged:function(event)
		{
			if(event.type==="buttonChanged"&&							//button changed
			  (document.activeElement.dataset.button!==undefined)||		//& button input
			  	document.activeElement.dataset.axis!==undefined&&		// || buttonAxis input
			  	document.activeElement.parentNode.previousSibling.checked===true)
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
						document.activeElement.value=index*2;
					}
					else
					{
						document.activeElement.value=index*2+1;
					}
				}
			}
		},
		getMapping:function()
		{
			var data={
					buttons:{},
					buttonAxis:{},
					axes:{}
			};
			var btns=this.domElement.querySelectorAll("input[data-button]");
			for(var i=0;i<btns.length;i++)
			{
				var btn=btns[i];
				data.buttons[btn.value]=btn.dataset.button;
			}
			var buttonAxis=this.domElement.querySelectorAll(".axisButton:checked+* > input");
			for(var i=0;i<buttonAxis.length;i++)
			{
				data.buttonAxis[buttonAxis[i].value]=buttonAxis[i].dataset.axis;
			}
			var axes=this.domElement.querySelectorAll(".axisButton:checked+* > .pos");
			for(var i=0;i<axes.length;i++)
			{
				var axis=axes[i];
				var invert=axis.nextSibling.checked;
				data.buttonAxis[axis.value]=(invert ? -axis.dataset.axis : axis.dataset.axis);
			}
			var mapping=new SC.mapping({data:data});
			return mapping;
		},
		destroy:function()
		{
			if(this.controller instanceof SC.ctrl.Keyboard)
			{
				this.controller.setDisabled(false);
			}
			GUI.prototype.destroy.call(this);
		}
	});
	SMOD("ControllerConfig",CONF);
	
})(Morgas,Morgas.setModule,Morgas.getModule);