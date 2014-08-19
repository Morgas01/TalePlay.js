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
					y=x;
				}
				this.y=1*y;
			}
			return this;
		},
		clone:function()
		{
			return new µ.Math.Point(this);
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
					y=x;
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
					y=x;
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
					y=x;
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
					y=x;
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
			this.div(this.length());
			return this;
		}
	});
	
	SMOD("Math.Point",µ.Math.Point);
	
})(Morgas,Morgas.setModule,Morgas.getModule);