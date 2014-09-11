(function(µ,SMOD,GMOD){

	var GUI=GMOD("GUIElement"),
	
	SC=GMOD("shortcut")({
		MAP:"Map",
		rescope:"rescope",
		proxy:"proxy",
		point:"Math.Point"
	});
	
	GUI.Map=µ.Class(GUI,{
		init:function(param)
		{
			param=param||{};
			
			this.superInit(GUI,param.styleClass)
			SC.rescope.all(["_animateCursor"],this);
			this.map=new SC.MAP({
				domElement:this.domElement,
				images:param.images,
				position:param.position
			});
			SC.proxy("map",{
				add:"addImages",
				setPosition:"setPosition",
				move:"move",
				getImages:"getImages",
				getSize:"getSize"
			},this);
			this.cursor=null;
			this.setCursor(param.cursor);
			this.offset=new SC.point();
			this._negOffset=new SC.point();
			this.setOffset(param.offset);
			this.speed=new SC.point(100);
			this.setSpeed(param.speed);
			
			this.direction=new SC.point(0,0);
			this.lastTime=null;
		},
		setCursor:function(cursor)
		{
			if(this.cursor)
			{
				this.map.remove(this.cursor);
			}
			this.map.add(cursor);
			this.cursor=cursor;
			this.cursor.move(this._negOffset);
			this.updateCursor();
		},
		getCursor:function()
		{
			return this.cursor;
		},
		setOffset:function(numberOrPoint,y)
		{
			if(this.cursor)
			{
				this.cursor.move(this.offset);
			}
			this.offset.set(numberOrPoint,y);
			this._negOffset.set(this.offset).negate();
			if(this.cursor)
			{
				this.cursor.move(this._negOffset);
			}
		},
		setCursorPosition:function(numberOrPoint,y)
		{
			if(this.cursor)
			{
				this.cursor.setPosition(this._negOffset.clone().add(numberOrPoint,y));
	        	this.updateCursor();
			}
		},
		moveCursor:function(numberOrPoint,y)
		{
			if(this.cursor)
			{
				this.cursor.move(numberOrPoint,y);
	        	this.updateCursor();
			}
		},
		getCursorPosition:function()
		{
			if(this.cursor)
			{
				return this.cursor.position.clone().add(this.offset);
			}
			return undefined
		},
        update:function(noImages)
        {
        	this.updateCursor();
        	this.map.update(noImages);
        },
        updateCursor:function()
        {
			if(this.cursor)
			{
				var size=this.map.getSize(),
				pos=this.cursor.position;
				if(pos.x+this.offset<0)
				{
					pos.x=this._negOffset.x;
				}
				if(pos.x+this.offset>size.x)
				{
					pos.x=size.x+this._negOffset.x;
				}
				if(pos.y+this.offset<0)
				{
					pos.y=this._negOffset.y;
				}
				if(pos.y+this.offset>size.y)
				{
					pos.y=size.y+this._negOffset.y;
				}
				this.cursor.update();
				this.map.setPosition(this.getCursorPosition())
			}
        },
        setSpeed:function(numberOrPoint,y)
        {
        	this.speed.set(numberOrPoint,y);
        },
		onAnalogStick:function(event)
		{
			this.direction.set(event.analogStick).mul(1,-1).normalize().mul(this.speed);
			this.lastTime=Date.now()-performance.timing.navigationStart;
			
			requestAnimationFrame(this._animateCursor);
		},
		_animateCursor:function(time)
		{
			if(!this.direction.equals(0)&&this.cursor)
			{
				requestAnimationFrame(this._animateCursor);
				this.moveCursor(this.direction.clone().mul((time-this.lastTime)/1000));
				this.lastTime=time;
			}
		}
	});
	
	SMOD("GUI.Map",GUI.Map);
	
})(Morgas,Morgas.setModule,Morgas.getModule);