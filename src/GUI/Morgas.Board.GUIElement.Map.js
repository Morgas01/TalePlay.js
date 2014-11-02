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
			
			this.superInit(GUI,param.styleClass);
			this.createListener("trigger");
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
            this.cursors=[];
            this.movingCursors=new Map();
            this.setThreshold(param.threshold);
            param.cursors&&this.addCursors(param.cursors);
            this.assignFilter=param.assignFilter||null;
            this.animationRquest=null;
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

				//step trigger
				var stepTrigger=SC.find(this.map.trigger(cursor.getPosition()),{trigger:{type:"step"}},true);
				for(var i=0;i<stepTrigger.length;i++)
				{
					this.fire("trigger",{
						triggerType:"step",
						image:stepTrigger[i],
						cursor:cursor,
						index:index,
						distance:distance
					});
				}
			}
			return distance;
		},
		update:function(noImages)
		{
			this.map.update(noImages);
		},
		updateSize:function()
		{
			this.map.calcSize(function(img)
			{
				return !img.domElement.classList.contains("cursor");
			});
		},
		setThreshold:function(numberOrPoint,y)
		{
			this.threshold.set(numberOrPoint,y);
		},
		onAnalogStick:function(event)
		{
			for(var i=0;i<this.cursors.length;i++)
			{
				if(!this.assignFilter||this.assignFilter(event,this.cursors[i],i))
				{
					var data=this.movingCursors.get(i);
					if(!data)
					{
						data={
							direction:new SC.point(),
							direction8:0,
							lastTime:Date.now()-performance.timing.navigationStart
						};
						this.movingCursors.set(i,data);
					}
					data.direction.set(event.analogStick).mul(1,-1).mul(this.cursors[i].speed);
					data.direction8=event.analogStick.getDirection8();
				}
			}
			if(this.animationRquest===null)
			{
				this.animationRquest=requestAnimationFrame(this._animateCursor);
			}
		},
		_animateCursor:function(time)
		{
			for(move of this.movingCursors)
			{
				var index=move[0];
				var cursor=this.cursors[index];
				var data=move[1];
				if(data.direction8!==0&&cursor)
				{
					var timeDiff=Math.min(time-data.lastTime,GUI.Map.MAX_TIME_DELAY);
					this.moveCursor(data.direction.clone().mul((timeDiff)/1000),undefined,index);
					data.lastTime=time;
					
					//move map
					var pos=cursor.getPosition();
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
	
					//set classes
	                cursor.domElement.classList.add("moving");
	                cursor.domElement.classList.remove("up","right","down","left");
	
	                if(data.direction8>=1&&(data.direction8<=2||data.direction8===8))
	                {
	                    cursor.domElement.classList.add("up");
	                }
	                if(data.direction8>=2&&data.direction8<=4)
	                {
	                    cursor.domElement.classList.add("right");
	                }
	                if(data.direction8>=4&&data.direction8<=6)
	                {
	                    cursor.domElement.classList.add("down");
	                }
	                if(data.direction8>=6&&data.direction8<=8)
	                {
	                    cursor.domElement.classList.add("left");
	                }
				}
	            else
	            {
	                cursor.domElement.classList.remove("moving");
	                this.movingCursors["delete"](index);
	            }
			}
			if(this.movingCursors.size>0)
			{
				this.animationRquest=requestAnimationFrame(this._animateCursor);
			}
			else
			{
				this.animationRquest=null;
			}
		},
		onButton:function(event)
		{
			if(event.value===1)
			{
				for(var i=0;i<this.cursors.length;i++)
				{
					if(!this.assignFilter||this.assignFilter(event,this.cursors[i],i))
					{
						var activateTrigger=SC.find(this.map.trigger(this.cursors[i].getPosition()),{trigger:{type:"activate"}},true);
						for(var t=0;t<activateTrigger.length;t++)
						{
							if(activateTrigger[t].trigger.type==="activate")
							{
								this.fire("trigger",{
									triggerType:"activate",
									image:activateTrigger[t],
									cursor:this.cursors[i],
									index:i
								});
							}
						}
					}
				}
			}
		}
	});
	GUI.Map.MAX_TIME_DELAY=250;
    GUI.Map.Cursor=µ.Class(MAP.Image,{
    	init:function(url,position,size,offset,name,colision,trigger,speed)
    	{
    		this.superInit(MAP.Image,url,position,size,name,colision,trigger);
    		this.domElement.classList.add("cursor");
    		this.offset=new SC.point();
    		this.setOffset(offset);
    		this.speed=new SC.point(200);
    		this.setSpeed(speed);
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
    	},
    	setSpeed:function(numberOrPoint,y)
    	{
            this.speed.set(numberOrPoint,y);
    	}
    });
    GUI.Map.Cursor.zIndexOffset=100;
	SMOD("GUI.Map",GUI.Map);
	
})(Morgas,Morgas.setModule,Morgas.getModule);