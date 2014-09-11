(function(µ,SMOD,GMOD){
	
	µ.Math=µ.Math||{};
	
	µ.Math.Point=µ.Class({
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
			else if (typeof numberOrPoint==="number")
			{
				this.x=1*numberOrPoint;
				if(y===undefined)
				{
					y=numberOrPoint;
				}
				this.y=1*y;
			}
			return this;
		},
		clone:function()
		{
			return new µ.Math.Point(this);
		},
		equals:function(numberOrPoint,y)
		{
			if(typeof numberOrPoint==="object"&&numberOrPoint!==null)
			{
				return this.x==numberOrPoint.x&&this.y==numberOrPoint.y;
			}
			else if (typeof numberOrPoint==="number")
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
			else if (typeof numberOrPoint==="number")
			{
				this.x+=1*numberOrPoint;
				if(y===undefined)
				{
					y=numberOrPoint;
				}
				this.y+=1*y;
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
			else if (typeof numberOrPoint==="number")
			{
				this.x-=numberOrPoint;
				if(y===undefined)
				{
					y=numberOrPoint;
				}
				this.y-=y;
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
			else if (typeof numberOrPoint==="number")
			{
				this.x*=numberOrPoint;
				if(y===undefined)
				{
					y=numberOrPoint;
				}
				this.y*=y;
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
			else if (typeof numberOrPoint==="number")
			{
				this.x/=numberOrPoint;
				if(y===undefined)
				{
					y=numberOrPoint;
				}
				this.y/=y;
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
		doMath:function(fn,numberOrPoint,y)
		{
			if(typeof numberOrPoint==="object"&&numberOrPoint!==null)
			{
				this.x=fn(this.x,1*numberOrPoint.x);
				this.y=fn(this.y,1*numberOrPoint.y);
			}
			else if (typeof numberOrPoint==="number")
			{
				this.x=fn(this.x,1*numberOrPoint);
				if(y===undefined)
				{
					y=1*numberOrPoint;
				}
				this.y=fn(this.y,y);
			}
			return this;
		},
	});
	
	SMOD("Math.Point",µ.Math.Point);
	
})(Morgas,Morgas.setModule,Morgas.getModule);