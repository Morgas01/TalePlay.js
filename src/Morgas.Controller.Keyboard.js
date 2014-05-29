(function(µ,SMOD,GMOD){

	var SC=µ.shortcut({
		rescope:"rescope"
	});
	var CTRL=GMOD("Controller");
	CTRL.Keyboard=µ.Class(CTRL,{
		init:function(domElement,mapping,buttonCount,axesCount)
		{
			this.superInit(CTRL,mapping||CTRL.Keyboard.stdMapping);
			
			SC.rescope.all(["onKeyDown","onKeyUp"],this)
			
			this.domElement=null;
			this.setDomElement(domElement)
		},
		setMapping:function(mapping)
		{
			CTRL.prototype.setMapping.call(this, mapping);
			if(this.mapping)
			{
				this.mapping.setValueOf("type","Keyboard");
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
			this.onKey(event,1);
		},
		onKeyUp:function(event)
		{
			this.onKey(event,0);
		},
		onKey:function(event,value)
		{
			if(!this.disabled&&this.mapping)
			{
				if(this.mapping.hasButtonMapping(event.keyCode)||this.mapping.hasButtonAxisMapping(event.keyCode))
				{
					event.preventDefault();
					event.stopPropagation();
					
					var map={};
					map[event.keyCode]=value;
					this.setButton(map);
				}
			}
		},
		destroy:function()
		{
			this.setDomElement();
			CTRL.prototype.destroy.call(this);
		}
	});
	CTRL.Keyboard.stdMapping={
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
		buttonAxis:{
			//1
			87:1,//w
			68:0,//d
			83:-1,//s
			65:-0,//a
			//2
			38:3,//up
			39:2,//right
			40:-3,//down
			37:-2,//left
		}
	}

})(Morgas,Morgas.setModule,Morgas.getModule);