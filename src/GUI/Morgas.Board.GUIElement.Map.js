(function(µ,SMOD,GMOD){

	var GUI=GMOD("GUIElement"),
	MAP=GMOD("Map"),
	SC=GMOD("shortcut")({
		rescope:"rescope",
		find:"find",
		proxy:"proxy",
		point:"Math.Point"
	});
	
	GUI.Map=µ.Class(GUI,{
		init:function(param)
		{
			param=param||{};
			
			this.superInit(GUI,param.styleClass)<
			SC.rescope.all(["_animateCursor"],this);
			this.map=new MAP({
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
            this.cursors=[];
            this.setThreshold(param.threshold);
            this.setSpeed(param.speed);
            this.addCursors(param.cursors);

			this.direction=new SC.point(0,0);
			this.direction8=0;
			this.lastTime=null;
		},
		addCursors:function(cursors)
		{
			cursors=[].concat(cursors);
            for(var i=0;i<cursors.length;i++)
            {
                if(this.cursors.indexOf(cursors[i])===-1)
                {
    				this.addImages(cursors[i]);
                    this.cursors.push(cursors[i]);
                }
            }
		},
		getCursors:function(pattern)
		{
			return SC.find(this.cursors,pattern,true);
		},
		setCursorPosition:function(numberOrPoint,y,index)
		{
			index=index||0;
			if(this.cursors[index])
			{
				//TODO colision
				this.cursors[index].setPosition(this._negOffset.clone().add(numberOrPoint,y));
			}
		},
		moveCursor:function(numberOrPoint,y,index)
		{
			index=index||0;
			if(this.cursors[index])
			{
				//TODO colision
				this.cursors[index].move(numberOrPoint,y);
			}
		},
		update:function(noImages)
		{
			this.map.update(noImages);
		},
		/*
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
		*/
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
			if(!this.direction.equals(0)&&this.cursors[0])
			{
				requestAnimationFrame(this._animateCursor);
				this.moveCursor(this.direction.clone().mul((time-this.lastTime)/1000));
				this.lastTime=time;

                this.cursors[0].domElement.classList.add("moving");
                this.cursors[0].domElement.classList.remove("up","right","down","left");

                if(this.direction8>=1&&(this.direction8<=2||this.direction8===8))
                {
                    this.cursors[0].domElement.classList.add("up");
                }
                if(this.direction8>=2&&this.direction8<=4)
                {
                    this.cursors[0].domElement.classList.add("right");
                }
                if(this.direction8>=4&&this.direction8<=6)
                {
                    this.cursors[0].domElement.classList.add("down");
                }
                if(this.direction8>=6&&this.direction8<=8)
                {
                    this.cursors[0].domElement.classList.add("left");
                }
			}
            else
            {
                this.cursors[0].domElement.classList.remove("moving");
            }
		}
	});
    GUI.Map.Cursor=µ.Class(MAP.Image,{
    	init:function(url,position,size,offset,name,colision,trigger)
    	{
    		this.superInit(MAP.Image,url,position,size,name,colision,trigger);
    		this.domElement.classList.add("cursor");
    		this.offset=new SC.point();
    		this.setOffset(offset);
    	},
        update:function()
        {
        	MAP.Image.prototype.update.call(this);
            this.domElement.style.zIndex=this.rect.position.y+GUI.Map.Cursor.zIndexOffset;
        },
    	setOffset:function(numberOrPoint,y)
    	{
    		this.rect.position.add(this.offset);
    		this.offset.set(numberOrPoint,y);
    		this.rect.position.add(this.offset);
    		this.update();
    	},
    	setPosition:function(numberOrPoint,y)
    	{
            this.rect.position.set(numberOrPoint,y).sub(this.offset);
            this.update();
    	},
    	getPosition:function()
    	{
    		return this.rect.position.clone().add(this.offset);
    	}
    });
    GUI.Map.Cursor.zIndexOffset=100;
	SMOD("GUI.Map",GUI.Map);
	
})(Morgas,Morgas.setModule,Morgas.getModule);