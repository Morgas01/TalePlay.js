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
			var cursor=this.cursors[index];
			if(cursor)
			{
				this.moveCursor(cursor.position.clone().negate().add(cursor.offset).add(numberOrPoint,y), null, index);
			}
		},
		moveCursor:function(numberOrPoint,y,index)
		{
			index=index||0;
			var cursor=this.cursors[index];
			var distance=new SC.point();
			if(cursor)
			{
				var size=this.map.getSize();
				distance.set(numberOrPoint,y);
				//map boundary
				var pos=cursor.rect.position.clone().add(cursor.offset);
				if(pos.x+distance.x<0)
				{
					distance.x=-pos.x;
				}
				else if (pos.x+distance.x>size.x)
				{
					distance.x=size.x-pos.x;
				}
				if(pos.y+distance.y<0)
				{
					distance.y=-pos.y;
				}
				else if (pos.y+distance.y>size.y)
				{
					distance.y=size.y-pos.y;
				}
				//collision
				if(cursor.collision)
				{
					var progress=1;
					var rect=cursor.rect.clone();
					rect.position.add(numberOrPoint,y);
					var collisions=this.map.collide(rect);
					for(var i=0;i<collisions.length;i++)
					{
						var cImage=collisions[i];
						var p=null;
						if(cImage===cursor||cursor.rect.contains(cImage.rect)||cImage.rect.contains(cursor.rect))
						{//is self or inside
							continue;
						}
						
						if(distance.x>0&&cursor.rect.position.x+cursor.rect.size.x<=cImage.rect.position.x)
						{
							p=Math.max(p,(cImage.rect.position.x-cursor.rect.position.x-cursor.rect.size.x)/distance.x);
						}
						else if (distance.x<0&&cursor.rect.position.x>=cImage.rect.position.x+cImage.rect.size.x)
						{
							p=Math.max(p,(cImage.rect.position.x+cImage.rect.size.x-cursor.rect.position.x)/distance.x);
						}
						
						if(distance.y>0&&cursor.rect.position.y+cursor.rect.size.y<=cImage.rect.position.y)
						{
							p=Math.max(p,(cImage.rect.position.y-cursor.rect.position.y-cursor.rect.size.y)/distance.y);
						}
						else if (distance.y<0&&cursor.rect.position.y>=cImage.rect.position.y+cImage.rect.size.y)
						{
							p=Math.max(p,(cImage.rect.position.y+cImage.rect.size.y-cursor.rect.position.y)/distance.y);
						}
						
						if(p!==null)
						{
							progress=Math.min(progress,p);
						}
					}
					distance.mul(progress);
				}
				cursor.move(distance);
			}
			return distance;
		},
		update:function(noImages)
		{
			this.map.update(noImages);
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
			if(!this.direction.equals(0)&&this.cursors[0])
			{
				var timeDiff=Math.min(time-this.lastTime,GUI.Map.MAX_TIME_DELAY);
				requestAnimationFrame(this._animateCursor);
				this.moveCursor(this.direction.clone().mul((timeDiff)/1000));
				var pos=this.cursors[0].getPosition();
				var mapPos=this.map.getPosition();
				if(pos.x<mapPos.x-this.threshold.x)
				{
					this.move(pos.x-mapPos.x+this.threshold.x,0);
				}
				else if(pos.x>mapPos.x+this.threshold.x)
				{
					this.move(pos.x-mapPos.x-this.threshold.x,0);
				}
				if(pos.y<mapPos.y-this.threshold.y)
				{
					this.move(0,pos.y-mapPos.y+this.threshold.y);
				}
				else if(pos.y>mapPos.y+this.threshold.y)
				{
					this.move(0,pos.y-mapPos.y-this.threshold.y);
				}
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
	GUI.Map.MAX_TIME_DELAY=250;
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
            this.domElement.style.zIndex=Math.floor(this.rect.position.y+GUI.Map.Cursor.zIndexOffset);
        },
    	setOffset:function(numberOrPoint,y)
    	{
    		this.rect.position.add(this.offset);
    		this.offset.set(numberOrPoint,y);
    		this.rect.position.sub(this.offset);
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