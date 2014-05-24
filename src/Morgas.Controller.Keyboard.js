(function(µ,SMOD,GMOD){

	var SC=µ.shortcut({
		rescope:"rescope"
	});
	var CTRL=GMOD("Controller");
	CTRL.Keyboard=µ.Class(CTRL,{
		init:function(domElement,map,buttonCount,axesCount)
		{
			this.superInit(CTRL,buttonCount,axesCount);
			
			SC.rescope.all(["onKeyDown","onKeyUp"],this)
			
			this.domElement=null;
			this.setDomElement(domElement)
			
			this.map=map||CTRL.Keyboard.stdMap;
			
		},
		set:function(event,value)
		{
			if(event.keyCode in this.map.buttons)
			{
				this.setButton(this.map.buttons[event.keyCode],value);
				event.preventDefault();
				event.stopPropagation();
			}
			else
			{
				for(var i=0;i<this.map.axes.length;i++)
				{
					if(event.keyCode in this.map.axes[i])
					{
						var x=null,y=null;
						switch(this.map.axes[i][event.keyCode])
						{
							case 1:
								y=value;
								break;
							case 2:
								x=value;
								break;
							case 3:
								y=-value;
								break;
							case 4:
								x=-value;
								break;
							
						}
						this.setAxis(i,x,y);
						event.preventDefault();
						event.stopPropagation();
						return;
					}
				}
			}
		},
		setDomElement:function(domElement)
		{
			if(this.domElement)
			{
				this.domElement.removeEventListener("keydown", this.onKeyDown, false);
				this.domElement.removeEventListener("keyup", this.onKeyUp, false);
				this.domElement=null;
			}
			if(domElement)
			{
				this.domElement=domElement;
				domElement.addEventListener("keydown", this.onKeyDown, false);
				domElement.addEventListener("keyup", this.onKeyUp, false);
			}
		},
		onKeyDown:function(event)
		{
			if(!this.disabled)
			{
				this.set(event,1);
			}
		},
		onKeyUp:function(event)
		{
			if(!this.disabled)
			{
				this.set(event,0);
			}
		},
		destroy:function()
		{
			this.domElement.removeEventListener("keydown", this.onKeyDown, false);
			this.domElement.removeEventListener("keyup", this.onKeyUp, false);
		}
	});
	CTRL.Keyboard.stdMap={
		buttons:{
			32:0,//space
			16:1,//shift
			97:2,//num 1
			98:3,//num 2
			99:4,//num 3
			100:5,//num 4
			101:6,//num 5
			102:7,//num 6
			19:8,//pause
			13:9,//enter
		},
		axes:[{
			87:1,//w
			68:2,//d
			83:3,//s
			65:4//a
		},{
			38:1,//up
			39:2,//right
			40:3,//down
			37:4,//left
		}]
	}

})(Morgas,Morgas.setModule,Morgas.getModule);