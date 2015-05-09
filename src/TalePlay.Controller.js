(function(µ,SMOD,GMOD){

    var TALE=this.TalePlay=this.TalePlay||{};
	
	var LST=GMOD("Listeners");
	var POINT=GMOD("Math.Point");
	
	var SC=µ.shortcut({
		mapping:"Controller.Mapping"
	});
	
	var CTRL=TALE.Controller=µ.Class(LST,{
		init:function(mapping,mappingName)
		{
			this.mega();
			
			this.analogSticks={};
			this.buttons={};
			this.mapping=null;
			
			this.setMapping(mapping,mappingName);
			this.createListener("changed analogStickChanged buttonChanged .disabled .connected");
			this.addListener(".disabled",this,"reset");
			//TODO this.addListener(".connected",this,"reset");
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
			if(this.analogSticks[axisIndex]===undefined)
			{
				this.analogSticks[axisIndex]=new CTRL.AnalogStick();
			}
			return this.analogSticks[axisIndex];
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
			
			var keys=Object.keys(axisMap);
			while(keys.length>0)
			{
				var key=keys.shift(), xAxis=undefined, yAxis=undefined; index=-1;
				var aStick=this.getAnalogStick(key>>1);
				if(key%2==0)
				{
					xAxis=axisMap[key];
					yAxis=axisMap[key*1+1]||aStick.y;
					
					index=keys.indexOf(key*1+1);
					if(index!==-1) keys.splice(index,1);
				}
				else
				{
					xAxis=axisMap[key-1]||aStick.x;
					yAxis=axisMap[key];
					
					index=keys.indexOf(key-1);
					if(index!==-1) keys.splice(index,1);
				}
				aStick.set(xAxis,yAxis);
				if(aStick.hasChanged())
				{
					changed=true;
					this.fire("analogStickChanged",{index:key>>1,analogStick:aStick});
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
		reset:function()
		{
			var changed=false;
			for(var b in this.buttons)
			{
				var oldValue=this.buttons[b];
				if(oldValue!==0)
				{
					this.buttons[b]=0;
					this.fire("buttonChanged",{index:1*b,value:0,oldValue:old});
					changed=true;
				}
			}
			for(var a in this.analogSticks)
			{
				var aStick=this.analogSticks[a];
				aStick.set(0,0);
				if(aStick.hasChanged())
				{
					this.fire("analogStickChanged",{index:1*a,analogStick:aStick});
					changed=true;
				}
			}
		},
		setDisabled:function(disabled)
		{
			if(disabled) this.setState(".disabled");
			else this.resetState(".disabled");
		},
		destroy:function()
		{
			//TODO;
			this.mega();
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
			this.old={x:0,y:0};
			this.mega(x,y);
		},
		clone:function(cloning)
		{
			if(!cloning)
			{
				cloning=new CTRL.AnalogStick();
			}
			this.mega(cloning);
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
			this.mega(numberOrPoint,y);
		}
	});
	
	
	SMOD("Controller",CTRL);
	
})(Morgas,Morgas.setModule,Morgas.getModule);