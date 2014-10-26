(function(µ,SMOD,GMOD){
	
	var POINT=GMOD("Math.Point");
	
	var RECT=µ.Math.Rect=µ.Class(
	{
		init:function(position,size)
		{
			this.position=new POINT();
			this.size=new POINT();
			
			this.setPosition(position);
			this.setSize(size);
		},
		clone:function()
		{
			return new RECT(this.position,this.size);
		},
		setPosition:function(x,y)
		{
			this.position.set(x,y);
			return this;
		},
		setSize:function(x,y)
		{
			this.size.set(x,y);
			return this;
		},
		set:function(posX,posY,sizeX,sizeY)
		{
			this.position.set(posX,posY);
			this.size.set(sizeX,sizeY);
			return this;
		},
		setAbsolute:function(x1,y1,x2,y2)
		{
			var _x1=Math.min(x1,x2),
			_y1=Math.min(y1,y2),
			_x2=Math.max(x1,x2),
			_y=Math.max(y1,y2);
			this.set(_x1, _y1, _x2-_x1, _y2-_y1);
			return this;
		},
		getAbsolute:function()
		{
			return {min:this.position.clone(),max:this.position.clone().add(this.size)};
		},
		collide:function(rect)
		{
			if(rect===this)
			{
				return true;
			}
			else
			{
				var me=this.getAbsolute(),
				that=rect.getAbsolute();
				
				return !(me.min.x>=that.max.x||me.min.y>=that.max.y||me.max.x<=that.min.x||me.max.y<=that.min.y);
			}
		},
        contains:function(numberOrPoint,y)
        {
            var p=new POINT(numberOrPoint,y);
            return (this.position.x <= p.x && this.position.x+this.size.x > p.x &&
                    this.position.y <= p.y && this.position.y+this.size.y > p.y);
        }
	});
	SMOD("Math.Rect",RECT);
})(Morgas,Morgas.setModule,Morgas.getModule);