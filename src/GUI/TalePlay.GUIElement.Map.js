(function(µ,SMOD,GMOD){

	var GUI=GMOD("GUIElement"),
	MAP=GMOD("Map"),
	SC=GMOD("shortcut")({
		find:"find",
		goPath:"goPath",//for Map.cursors shortcut
		rescope:"rescope",
		proxy:"proxy",
		point:"Math.Point"
	});
	
	var cursorFilter=function(image){return image instanceof GUI.Map.Cursor};
	var cursorGetter=function(GuiMap){return GuiMap.map.organizer.getFilter("cursors")};
	
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
			this.map.organizer.filter("cursors",cursorFilter);
			SC.proxy("map",{
				add:"add",
				addAll:"addAll",
				setPosition:"setPosition",
				move:"move",
				getImages:"getImages",
				getSize:"getSize",
                collide:"collide"
			},this);
            this.threshold=new SC.point();
            GMOD("shortcut")({cursors:cursorGetter},this,this,true);
            this.movingCursors=new Map();
            this.setThreshold(param.threshold);
            param.cursors&&this.addAll(param.cursors);
            this.assignFilter=param.assignFilter||null;
            this.animationRquest=null;
		},
		getCursors:function(pattern)
		{
			return SC.find(this.cursors,pattern,true);
		},
		update:function(noImages)
		{
			this.map.update(noImages);
		},
		updateSize:function()
		{
			this.map.calcSize(function(img)
			{
				return !(img instanceof GUI.Map.Cursor)
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
					data.direction.set(event.analogStick).mul(1,-1);
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
			for([index, data] of this.movingCursors)
			{
				var cursor=this.cursors[index];
				if(data.direction8!==0&&cursor)
				{
					var timeDiff=Math.min(time-data.lastTime,GUI.Map.MAX_TIME_DELAY);
					var distance=cursor.move(data.direction.clone().mul(cursor.speed).mul(timeDiff/1000));

					//step trigger
					var stepTrigger=this.map.trigger("step",cursor.getPosition());
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
						var activateTrigger=this.map.trigger("activate",this.cursors[i].getPosition());
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
		},
		toJSON:function()
		{
			var json={
				map:this.map.toJSON(),
				threshold:this.threshold.clone,
				cursors:this.cursors.slice()
			};
			for(var i=0;i<this.cursors.length;i++)
			{
				json.map.images.splice(json.map.images.indexOf(this.cursors[i]),1);
			}
			return json;
		},
		fromJSON:function(json)
		{
			this.map.fromJSON(json.map);
			this.cursors.length=0;
			for(var i=0;i<json.cursors.length;i++)
			{
				this.addCursors(new GUI.Map.Cursor().fromJSON(json.cursors[i]));
			}
			this.threshold.set(json.threshold);
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
    	},
    	move:function(numberOrPoint,y)
    	{
    		var distance=new SC.point();
			if(this.map)
			{
				var size=this.map.getSize();
				distance.set(numberOrPoint,y);
				//map boundary
				var pos=this.rect.position.clone().add(this.offset);
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
				if(this.collision)
				{
					var progress=1;
					var rect=this.rect.clone();
					rect.position.add(numberOrPoint,y);
					var collisions=this.map.collide(rect);
					for(var i=0;i<collisions.length;i++)
					{
						var cImage=collisions[i];
						var p=null;
						if(cImage===this||this.rect.contains(cImage.rect)||cImage.rect.contains(this.rect))
						{//is self or inside
							continue;
						}
						
						if(distance.x>0&&this.rect.position.x+this.rect.size.x<=cImage.rect.position.x)
						{
							p=Math.max(p,(cImage.rect.position.x-this.rect.position.x-this.rect.size.x)/distance.x);
						}
						else if (distance.x<0&&this.rect.position.x>=cImage.rect.position.x+cImage.rect.size.x)
						{
							p=Math.max(p,(cImage.rect.position.x+cImage.rect.size.x-this.rect.position.x)/distance.x);
						}
						
						if(distance.y>0&&this.rect.position.y+this.rect.size.y<=cImage.rect.position.y)
						{
							p=Math.max(p,(cImage.rect.position.y-this.rect.position.y-this.rect.size.y)/distance.y);
						}
						else if (distance.y<0&&this.rect.position.y>=cImage.rect.position.y+cImage.rect.size.y)
						{
							p=Math.max(p,(cImage.rect.position.y+cImage.rect.size.y-this.rect.position.y)/distance.y);
						}
						
						if(p!==null)
						{
							progress=Math.min(progress,p);
						}
					}
					distance.mul(progress);
				}
				MAP.Image.prototype.move.call(this,distance);
			}
			return distance;
    	},
		toJSON:function()
		{
			var json=MAP.Image.prototype.toJSON.call(this);
			json.offset=this.offset;
			json.speed=this.speed;
			return json;
		},
		fromJSON:function(json)
		{
			MAP.Image.prototype.fromJSON.call(this,json);
			this.offset.set(json.offset);
			this.speed.set(json.speed);
			
			return this;
		}
    });
    GUI.Map.Cursor.zIndexOffset=100;
	SMOD("GUI.Map",GUI.Map);
	
})(Morgas,Morgas.setModule,Morgas.getModule);