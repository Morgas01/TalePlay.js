(function(µ,SMOD,GMOD){
	/**
	 * Defines a Controller with buttons and axes
	 */
	var SC=µ.shortcut({
		rescope:"rescope",
		mapping:"ControllerMapping"
	});
	
	var LST=GMOD("Listeners");
	
	
	var CTRL=µ.Controller=µ.Class(LST);
	CTRL.AnalogStick=µ.Class({
		init:function(x,y)
		{
			this.x=x||0;
			this.y=y||0;
		},
		setIndex:function(index,value)
		{
			if(index%2===0)
			{
				if(this.x!==value)
				{
					var old={x:this.x,y:this.y};
					this.x=value;
					return old;
				}
			}
			else if(this.y!==value)
			{
				var old={x:this.x,y:this.y};
				this.y=value;
				return old;
			}
			return null;
		},
		set:function(x,y)
		{
			if(!this.equals(x, y))
			{
				var old={x:this.x,y:this.y};
				this.x=x;
				this.y=y;
				return old;
			}
			return null;
		},
		equals:function(x,y)
		{
			if(this.x===x&&this.y===y||(typeof x==="object"&&this.x===x.x&&this.y===x.y))
			{
				return true;
			}
			return false;
		},
		getForce:function()
		{
			return Math.sqrt(this.x*this.x+this.y*this.y);
		},
		getAngle:function()
		{
			if(this.y!==0||this.x!==0)
			{
				var a=Math.asin(this.y/this.getForce());
				if(this.x>=0)
				{
					a=Math.PI/2-a;
				}
				else
				{
					a+=Math.PI*1.5;
				}
				return a;
			}
			return 0;
		},
		getDirection4:function()
		{//0:none 1:up 2:right 3:down 4:left
			if(this.y===0&&this.x===0)
			{
				return 0;
			}
			else if(Math.abs(this.y)>Math.abs(this.x))
			{
				if(this.y>0)
				{
					return 1;
				}
				else
				{
					return 3;
				}
			}
			else
			{
				if(this.x>0)
				{
					return 2;
				}
				else
				{
					return 4;
				}
			}
		},
		getDirection8:function()
		{
			//0:none 1:up 2:up-right 3:right 4:down-right ...
			if(this.y===0&&this.x===0)
			{
				return 0;
			}
			else
			{
				return 1+Math.floor(this.getAngle()/(Math.PI/4));
			}
		},
		toString:function()
		{
			JSON.stringify(this);
		},
		toJSON:function()
		{
			return {x:this.x.toFixed(5).slice(0,6),y:this.y.toFixed(5).slice(0,6)};
		}
		
	});
	
	CTRL.prototype.init=function(mapping,mappingName)
	{
		this.superInit(LST);
		
		this.disabled=false;
		this.analogSticks={};
		this.buttons={};
		this.mapping=null;
		
		this.setMapping(mapping,mappingName);
		this.createListener("changed analogStickChanged buttonChanged");
	};
	CTRL.prototype.toString=function()
	{
		return JSON.stringify(this);
	};
	CTRL.prototype.toJSON=function()
	{
		return {buttons:this.buttons,analogSticks:this.analogSticks};
	};
	CTRL.prototype.getMapping=function()
	{
		return this.mapping;
	};
	CTRL.prototype.setMapping=function(mapping,mappingName)
	{
		if(mapping)
		{
			if(!(mapping instanceof SC.mapping))
			{
				mapping=new SC.mapping({data:mapping,name:mappingName||"default"});
			}
			this.mapping=mapping;
		}
		else
		{
			this.mapping=null;
		}
	};
	CTRL.prototype.getAnalogStick=function(axisIndex)
	{
		var stickIndex=Math.floor(axisIndex/2);
		if(this.analogSticks[stickIndex]===undefined)
		{
			this.analogSticks[stickIndex]=new CTRL.AnalogStick();
		}
		return this.analogSticks[stickIndex];
	};
	CTRL.prototype.setButton=function(buttonMap)
	{
		var changed=false,axisMap=undefined;
		if(this.mapping)
		{
			var remapped={};
			axisMap={};
			for(var i in buttonMap)
			{
				var axisIndex=this.mapping.getButtonAxisMapping(i);
				if(axisIndex!==undefined)
				{
					axisMap[Math.abs(axisIndex)]=this.mapping.convertAxisValue(axisIndex,buttonMap[i]);
				}
				else
				{
					remapped[this.mapping.getButtonMapping(i)]=buttonMap[i];
				}
			}
			buttonMap=remapped;
		}
		
		for(var index in buttonMap)
		{
			var value=buttonMap[index];
			if(this.buttons[index]===undefined||this.buttons[index]!==value)
			{
				var old=this.buttons[index]||0;
				this.buttons[index]=value;
				this.fire("buttonChanged",{index:1*index,value:value,oldValue:old});
				changed=true;
			}
		}
		if(axisMap)
		{
			changed=this.setAxis(axisMap,true)||changed;
		}
		if(changed)
		{
			this.fire("changed");
		}
		return changed;
	};
	CTRL.prototype.setAxis=function(axisMap,fromButton)
	{
		var changed=false;
		if(this.mapping&&!fromButton)
		{
			var remapped={};
			for(var i in axisMap)
			{
				var index=this.mapping.getAxisMapping(i);
				remapped[Math.abs(index)]=this.mapping.convertAxisValue(index,axisMap[i]);
			}
			axisMap=remapped;
		}
		
		var keys=Object.keys(axisMap).sort();
		for(var i=0;i<keys.length;i++)
		{
			var old=undefined;
			var index=keys[i];
			var aStick=this.getAnalogStick(index);
			if(index%2==0&&keys[i+1]===index+1)
			{
				i++;
				old=aStick.set(axisMap[index],axisMap[index+1]);
			}
			else
			{
				old=aStick.setIndex(index,axisMap[index]);
			}
			if(old)
			{
				changed=true;
				this.fire("analogStickChanged",{index:index>>1,analogStick:aStick,oldValue:old});
			}
		}
		if(changed&&!fromButton)
		{
			this.fire("changed");
		}
		return changed;
	};
	CTRL.prototype.set=function(buttons,axes)
	{
		this.setButton(buttons);
		this.setAxis(axes);
	};
	CTRL.prototype.setDisabled=function(disabled)
	{
		this.disabled=disabled===true;
		for(var i in this.listeners)
		{
			this.listeners[i].setDisabled(this.disabled);
		}
	};
	CTRL.prototype.destroy=function()
	{
		//TODO;
	};
	SMOD("Controller",CTRL);
	
})(Morgas,Morgas.setModule,Morgas.getModule);