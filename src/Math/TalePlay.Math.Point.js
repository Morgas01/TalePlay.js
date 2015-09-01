(function(µ,SMOD,GMOD,HMOD,SC){

    var TALE=this.TalePlay=this.TalePlay||{};
	TALE.Math=TALE.Math||{};
	
	var POINT=TALE.Math.Point=µ.Class({
		init:function(numberOrPoint,y)
		{
			this.x=0;
			this.y=0;
			this.set(numberOrPoint,y);
		},
		set:function(numberOrPoint,y)
		{
			if(typeof numberOrPoint==="object"&&numberOrPoint!==null)
			{
				this.x=1*numberOrPoint.x;
				this.y=1*numberOrPoint.y;
			}
			else if (numberOrPoint!==undefined)
			{
				this.x=1*numberOrPoint;
				if(y===undefined)
				{
					y=numberOrPoint;
				}
				this.y=1*y;
			}
			if(isNaN(this.x)||isNaN(this.y))
			{
				µ.logger.warn(new µ.Warning("Point became NaN",this));
			}
			return this;
		},
		clone:function(cloning)
		{
			if(!cloning)
			{
				cloning=new POINT();
			}
			cloning.set(this.x,this.y);
			return cloning;
		},
		equals:function(numberOrPoint,y)
		{
			if(typeof numberOrPoint==="object"&&numberOrPoint!==null)
			{
				return this.x==numberOrPoint.x&&this.y==numberOrPoint.y;
			}
			else if (numberOrPoint!==undefined)
			{
				if(y===undefined)
				{
					y=numberOrPoint;
				}
				return this.x==numberOrPoint&&this.y==y;
			}
			return false;
		},
		add:function(numberOrPoint,y)
		{
			if(typeof numberOrPoint==="object"&&numberOrPoint!==null)
			{
				this.x+=1*numberOrPoint.x;
				this.y+=1*numberOrPoint.y;
			}
			else if (numberOrPoint!==undefined)
			{
				this.x+=1*numberOrPoint;
				if(y===undefined)
				{
					y=numberOrPoint;
				}
				this.y+=1*y;
			}
			if(isNaN(this.x)||isNaN(this.y))
			{
				µ.logger.warn(new µ.Warning("Point became NaN",this));
			}
			return this;
		},
		sub:function(numberOrPoint,y)
		{
			if(typeof numberOrPoint==="object"&&numberOrPoint!==null)
			{
				this.x-=numberOrPoint.x;
				this.y-=numberOrPoint.y;
			}
			else if (numberOrPoint!==undefined)
			{
				this.x-=numberOrPoint;
				if(y===undefined)
				{
					y=numberOrPoint;
				}
				this.y-=y;
			}
			if(isNaN(this.x)||isNaN(this.y))
			{
				µ.logger.warn(new µ.Warning("Point became NaN",this));
			}
			return this;
		},
		mul:function(numberOrPoint,y)
		{
			if(typeof numberOrPoint==="object"&&numberOrPoint!==null)
			{
				this.x*=numberOrPoint.x;
				this.y*=numberOrPoint.y;
			}
			else if (numberOrPoint!==undefined)
			{
				this.x*=numberOrPoint;
				if(y===undefined)
				{
					y=numberOrPoint;
				}
				this.y*=y;
			}
			if(isNaN(this.x)||isNaN(this.y))
			{
				µ.logger.warn(new µ.Warning("Point became NaN",this));
			}
			return this;
		},
		div:function(numberOrPoint,y)
		{
			if(typeof numberOrPoint==="object"&&numberOrPoint!==null)
			{
				this.x/=numberOrPoint.x;
				this.y/=numberOrPoint.y;
			}
			else if (numberOrPoint!==undefined)
			{
				this.x/=numberOrPoint;
				if(y===undefined)
				{
					y=numberOrPoint;
				}
				this.y/=y;
			}
			if(isNaN(this.x)||isNaN(this.y))
			{
				µ.logger.warn(new µ.Warning("Point became NaN",this));
			}
			return this;
		},
		negate:function()
		{
			this.x=-this.x;
			this.y=-this.y;
			return this;
		},
		invert:function()
		{
			this.x=1/this.x;
			this.y=1/this.y;
			return this;
		},
		abs:function()
		{
			this.x=Math.abs(this.x);
			this.y=Math.abs(this.y);
			return this;
		},
		length:function()
		{
			return Math.sqrt(this.x*this.x+this.y*this.y);
		},
		normalize:function()
		{
			var l=this.length();
			if(l)
			{
				this.div(l);
			}
			return this;
		},
		getAngle:function()
		{
			if(this.y!==0||this.x!==0)
			{
				var a=Math.asin(this.y/this.length());
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
				return 1+Math.floor((this.getAngle()/Math.PI*4+0.5)%8);
			}
		},
		doMath:function(fn,numberOrPoint,y)
		{
			if(typeof numberOrPoint==="object"&&numberOrPoint!==null)
			{
				this.x=fn(this.x,1*numberOrPoint.x);
				this.y=fn(this.y,1*numberOrPoint.y);
			}
			else if (numberOrPoint!==undefined)
			{
				this.x=fn(this.x,1*numberOrPoint);
				if(y===undefined)
				{
					y=1*numberOrPoint;
				}
				this.y=fn(this.y,y);
			}
			if(isNaN(this.x)||isNaN(this.y))
			{
				µ.logger.warn(new µ.Warning("Point became NaN",this));
			}
			return this;
		}
	});
	
	SMOD("Math.Point",POINT);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);