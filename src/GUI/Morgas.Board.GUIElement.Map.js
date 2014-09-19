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
			
			this.superInit(GUI,param.styleClass)<
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
            this.offset=new SC.point();
            this._negOffset=new SC.point();
            this.threshold=new SC.point();
            this.speed=new SC.point(100);
            this.cursor=null;
            this.setOffset(param.offset);
            this.setThreshold(param.threshold);
            this.setSpeed(param.speed);
            this.setCursor(param.cursor);

			this.direction=new SC.point(0,0);
			this.direction8=0;
			this.lastTime=null;
		},
		setCursor:function(cursor)
		{
			if(this.cursor)
			{
				this.map.stage.removeChild(this.cursor.domElement);
			}
			this.map.stage.appendChild(cursor.domElement);
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
				if(pos.x+this.offset.x<0)
				{
					pos.x=this._negOffset.x;
				}
				if(pos.x+this.offset.x>size.x)
				{
					pos.x=size.x+this._negOffset.x;
				}
				if(pos.y+this.offset.y<0)
				{
					pos.y=this._negOffset.y;
				}
				if(pos.y+this.offset.y>size.y)
				{
					pos.y=size.y+this._negOffset.y;
				}
				this.cursor.update();

				var distance=this.getCursorPosition().sub(this.map.getPosition()),
				moveX=0,
				moveY=0;
				if(distance.x<-this.threshold.x)
				{
					moveX=this.threshold.x+distance.x;
				}
				else if (distance.x>this.threshold.x)
				{
					moveX=distance.x-this.threshold.y;
				}
				if(distance.y<-this.threshold.y)
				{
					moveY=this.threshold.y+distance.y;
				}
				else if (distance.y>this.threshold.y)
				{
					moveY=distance.y-this.threshold.y;
				}
				this.map.move(moveX,moveY);
			}
		},
		setSpeed:function(numberOrPoint,y)
		{
			this.speed.set(numberOrPoint,y);
		},
		setThreshold:function(numberOrPoint,y)
		{
			this.threshold.set(numberOrPoint,y);
		},
		onAnalogStick:function(event)
		{
			this.direction.set(event.analogStick).mul(1,-1).mul(this.speed);
            this.direction8=event.analogStick.getDirection8();
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

                this.cursor.domElement.classList.add("moving");
                this.cursor.domElement.classList.remove("up","right","down","left");

                if(this.direction8>=1&&(this.direction8<=2||this.direction8===8))
                {
                    this.cursor.domElement.classList.add("up");
                }
                if(this.direction8>=2&&this.direction8<=4)
                {
                    this.cursor.domElement.classList.add("right");
                }
                if(this.direction8>=4&&this.direction8<=6)
                {
                    this.cursor.domElement.classList.add("down");
                }
                if(this.direction8>=6&&this.direction8<=8)
                {
                    this.cursor.domElement.classList.add("left");
                }
			}
            else
            {
                this.cursor.domElement.classList.remove("moving");
            }
		}
	});
	
	SMOD("GUI.Map",GUI.Map);
	
})(Morgas,Morgas.setModule,Morgas.getModule);