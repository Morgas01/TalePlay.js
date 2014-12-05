(function(µ,SMOD,GMOD){

    var TALE=window.TalePlay=window.TalePlay||{};
	
	var LST=GMOD("Listeners");
	var POINT=GMOD("Math.Point");
	
	var SC=µ.shortcut({
		mapping:"Controller.Mapping"
	});
	
	var CTRL=TALE.Controller=µ.Class(LST,{
		init:function(mapping,mappingName)
		{
			this.superInit(LST);
			
			this.disabled=false;
			this.analogSticks={};
			this.buttons={};
			this.mapping=null;
			
			this.setMapping(mapping,mappingName);
			this.createListener("changed analogStickChanged buttonChanged");
		},
		getMapping:function()
		{
			return this.mapping;
		},
		setMapping:function(mapping,mappingName)
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
		},
		getAnalogStick:function(axisIndex)
		{
			var stickIndex=Math.floor(axisIndex/2);
			if(this.analogSticks[stickIndex]===undefined)
			{
				this.analogSticks[stickIndex]=new CTRL.AnalogStick();
			}
			return this.analogSticks[stickIndex];
		},
		setButton:function(buttonMap)
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
		},
		setAxis:function(axisMap,fromButton)
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
				var index=keys[i];
				var aStick=this.getAnalogStick(index);
				var old=aStick.clone();
				if(index%2==0&&keys[i+1]===index+1)
				{
					i++;
					aStick.set(axisMap[index],axisMap[index+1]);
				}
				else
				{
					aStick.setComponent(index,axisMap[index]);
				}
				if(aStick.hasChanged())
				{
					changed=true;
					this.fire("analogStickChanged",{index:index>>1,analogStick:aStick});
				}
			}
			if(changed&&!fromButton)
			{
				this.fire("changed");
			}
			return changed;
		},
		set:function(buttons,axes)
		{
			this.setButton(buttons);
			this.setAxis(axes);
		},
		setDisabled:function(disabled)
		{
			this.disabled=disabled===true;
			for(var i in this.listeners)
			{
				this.listeners[i].setDisabled(this.disabled);
			}
		},
		destroy:function()
		{
			//TODO;
		},
		toString:function()
		{
			return JSON.stringify(this);
		},
		toJSON:function()
		{
			return {buttons:this.buttons,analogSticks:this.analogSticks};
		}
	});
	//TODO use Math.Point
	CTRL.AnalogStick=µ.Class(POINT,{
		init:function(x,y)
		{
			this.old={x:0,y:0}
			this.superInit(POINT,x,y);
		},
		clone:function(cloning)
		{
			if(!cloning)
			{
				cloning=new CTRL.AnalogStick();
			}
			POINT.prototype.clone.call(this,cloning);
			cloning.old.x=this.old.x;
			cloning.old.y=this.old.y;
			return cloning;
		},
		clonePoint:function()
		{
			return POINT.prototype.clone.call(this);
		},
		pushOld:function()
		{
			this.old.x=this.x;
			this.old.y=this.y;
			return this;
		},
		hasChanged:function()
		{
			return !this.equals(this.old);
		},
		getDifference:function()
		{
			return new POINT(this.old).sub(this);
		},
		setComponent:function(index,value)
		{
			this.pushOld();
			
			if(index%2===0)
			{
				this.x=value;
			}
			else
			{
				this.y=value;
			}
			return this;
		},
		set:function(numberOrPoint,y)
		{
			this.pushOld();
			POINT.prototype.set.call(this,numberOrPoint,y);
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
				return 1+Math.floor((this.getAngle()+Math.PI/8)/(Math.PI/4));
			}
		}
	});
	
	
	SMOD("Controller",CTRL);
	
})(Morgas,Morgas.setModule,Morgas.getModule);