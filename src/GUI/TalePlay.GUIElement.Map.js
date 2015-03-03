(function(µ,SMOD,GMOD){

	var GUI=GMOD("GUIElement"),
	MAP=GMOD("Map"),
	SC=GMOD("shortcut")({
		find:"find",
		rescope:"rescope",
		proxy:"proxy",
        Org:"Organizer",
		point:"Math.Point"
	});
	
	var cursorFilter= function(image){return image instanceof GUI.Map.Cursor};
	var cursorGetter= function(GuiMap){return GuiMap.organizer.getFilter("cursors")};
	
	GUI.Map=µ.Class(GUI,{
		init:function(param)
		{
			param=param||{};
			
			this.superInit(GUI,param);
			this.createListener("trigger");
			SC.rescope.all(["_animateCursor"],this);
			
			this.map=new MAP({
				domElement:this.domElement,
				images:param.images,
				position:param.position
			}); //note: sets class "map" to domElement
			this.map.gui=this;
			SC.proxy("map",[
				"setPosition",
				"move",
				"getImages",
				"getSize",
				"update"
			],this);
			
        	this.organizer=new SC.Org()
        	.filter("cursors",cursorFilter)
        	.filter("collision","collision")
        	.group("trigger","trigger.type");
			
            this.threshold=new SC.point();
            GMOD("shortcut")({cursors:cursorGetter},this,this,true);
            this.movingCursors=new Map();
            this.setThreshold(param.threshold);
            param.cursors&&this.addAll(param.cursors);
            this.assignFilter=param.assignFilter||null;
            this.animationRquest=null;
            this.paused=param.paused===true;
		},
        addAll:function(images)
        {
        	images=[].concat(images);
            for(var i=0;i<images.length;i++)
            {
                this.add(images[i]);
            }
        },
        add:function(image)
        {
            if(this.map.add(image))
            {
                this.organizer.add([image]);
            }
        },
        remove:function(image)
        {
        	if(this.map.remove(image))
        	{
        		this.organizer.remove(image);
        		this.movingCursors["delete"](image);
        	}
        },
		getCursors:function(pattern)
		{
			return SC.find(this.cursors,pattern,true);
		},
		updateSize:function()
		{
			this.map.calcSize(function(img){return !(img instanceof GUI.Map.Cursor)});
		},
		setThreshold:function(numberOrPoint,y)
		{
			this.threshold.set(numberOrPoint,y);
		},
		setPaused:function(paused)
		{
			this.paused=!!paused;
			if(this.animationRquest!==null&&this.paused)
			{
				cancelAnimationFrame(this.animationRquest);
				this.animationRquest=null;
			}
			else if(!this.paused)
			{
				var now=Date.now();
				for(var entries=this.movingCursors.entries(),entryStep=entries.next();!entryStep.done;entryStep=entries.next())
				{
					var data=entryStep.value[1];
					data.lastTime=now-performance.timing.navigationStart;
				}
				this.animationRquest=requestAnimationFrame(this._animateCursor);
			}
		},
		isPaused:function()
		{
			return this.paused;
		},
        collide:function(rect)
        {
        	var rtn=[],
        	cImages=this.organizer.getFilter("collision");
        	for(var i=0;i<cImages.length;i++)
        	{
        		if(cImages[i].rect.collide(rect))
        		{
        			rtn.push(cImages[i]);
        		}
        	}
        	return rtn;
        },
        trigger:function(type,numberOrPoint,y)
        {
        	var rtn=[],
        	tImages=this.organizer.getGroupValue("trigger",type);
        	for(var i=0;i<tImages.length;i++)
        	{
        		if(tImages[i].rect.contains(numberOrPoint,y))
        		{
        			rtn.push(tImages[i]);
        		}
        	}
        	return rtn;
        },
		onAnalogStick:function(event)
		{
			for(var i=0;i<this.cursors.length;i++)
			{
				if(!this.assignFilter||this.assignFilter(event,this.cursors[i],i))
				{
					var data=this.movingCursors.get(this.cursors[i]);
					if(!data)
					{
						data={
							direction:null,
							lastTime:Date.now()-performance.timing.navigationStart
						};
						this.movingCursors.set(this.cursors[i],data);
					}
					data.direction=event.analogStick.clonePoint()
					.mul(1,-1);//negate y for screen coordinates;
				}
			}
			if(this.animationRquest===null&&!this.paused)
			{
				this.animationRquest=requestAnimationFrame(this._animateCursor);
			}
		},
		_animateCursor:function(time)
		{
			for(var entries=this.movingCursors.entries(),entryStep=entries.next();!entryStep.done;entryStep=entries.next())
			{
				var cursor=entryStep.value[0],data=entryStep.value[1];
				var timeDiff=Math.min(time-data.lastTime,GUI.Map.MAX_TIME_DELAY);
	            if(data.animation)
	            {
	            	data.direction=data.animation.step(timeDiff);
	            }
				if(!data.direction.equals(0)&&cursor)
				{
		            cursor.domElement.classList.add("moving");
		            var distance=cursor.move(data.direction,timeDiff);

					//step trigger
		            //TODO step in/over/out
					var stepTrigger=this.trigger("step",cursor.getPosition());
					for(var i=0;i<stepTrigger.length;i++)
					{
						this.fire("trigger",{
							triggerType:"step",
							image:stepTrigger[i],
							cursor:cursor,
							value:stepTrigger[i].trigger.value,
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
				}
	            else
	            {
	                cursor.domElement.classList.remove("moving");
	                this.movingCursors["delete"](cursor);
	            }
			}
			if(this.movingCursors.size>0&&!this.paused)
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
			if(event.value===1&&!this.paused)
			{
				for(var i=0;i<this.cursors.length;i++)
				{
					var cursor=this.cursors[i];
					if(!this.assignFilter||this.assignFilter(event,cursor,i))
					{
						var activateTrigger=this.trigger("activate",cursor.getPosition());
						if(activateTrigger.length===0&&cursor.direction)
						{
							var dir=cursor.direction;
							var pos=new SC.point(
								cursor.rect.position.x+(dir.x===0 ? cursor.offset.x : dir.x>0 ? cursor.rect.size.x : 0),
								cursor.rect.position.y+(dir.y===0 ? cursor.offset.y : dir.y<0 ? cursor.rect.size.y : 0)
							);
							activateTrigger=this.trigger("activate",pos);
						}
						for(var t=0;t<activateTrigger.length;t++)
						{
							if(activateTrigger[t].trigger.type==="activate")
							{
								this.fire("trigger",{
									triggerType:"activate",
									image:activateTrigger[t],
									cursor:this.cursors[i],
									value:activateTrigger[t].trigger.value,
									controllerEvent:event
								});
							}
						}
					}
				}
			}
		},
		playAnimation:function(animation)
		{
			var data=this.movingCursors.get(animation.cursor);
			if(!data)
			{
				data={
					direction:null,
					animation:null,
					lastTime:Date.now()-performance.timing.navigationStart
				};
				this.movingCursors.set(animation.cursor,data);
			}
			data.animation=animation;

			if(this.animationRquest===null&&!this.paused)
			{
				this.animationRquest=requestAnimationFrame(this._animateCursor);
			}
		},
		toJSON:function()
		{
			var json=this.map.toJSON();
			json.cursors=this.cursors.slice();
			json.threshold=this.threshold.clone;
			for(var i=0;i<this.cursors.length;i++)
			{
				json.images.splice(json.images.indexOf(this.cursors[i]),1);
			}
			return json;
		},
		fromJSON:function(json)
		{
			this.movingCursors.clear();
			for(var i=0;i<json.images.length;i++)
			{
				json.images[i]=new GUI.Map.Image().fromJSON(json.images[i]);
			}
			for(var i=0;i<json.cursors.length;i++)
			{
				json.images.push(new GUI.Map.Cursor().fromJSON(json.cursors[i]));
			}
			this.map.fromJSON(json);
			this.organizer.clear().add(json.images);
			this.threshold.set(json.threshold);
		}
	});
	GUI.Map.MAX_TIME_DELAY=250;
    GUI.Map.Image=µ.Class(MAP.Image,{
    	init:function(url,position,size,name,collision,trigger){
    		this.superInit(MAP.Image,url,position,size,name);

            this.collision=!!collision;
            this.trigger={
            	type:null,
            	value:null
            };
            if(trigger)
            {
            	this.trigger.type=trigger.type||null;
            	this.trigger.value=trigger.value||null;
            }
    	},
		toJSON:function()
		{
			var json=MAP.Image.prototype.toJSON.call(this);
			json.collision=this.collision;
			json.trigger=this.trigger;
			return json;
		},
		fromJSON:function(json)
		{
			MAP.Image.prototype.fromJSON.call(this,json);
			this.collision=json.collision;
			this.trigger=json.trigger;
			
			return this;
		}
    });
	GUI.Map.Cursor=µ.Class(GUI.Map.Image,{
    	init:function(urls,position,size,offset,name,colision,trigger,speed)
    	{
    		this.superInit(GUI.Map.Image,GUI.Map.Cursor.emptyImage,position,size,name,colision,trigger);
    		this.domElement.classList.add("cursor");
            this.domElement.style.zIndex=GUI.Map.Cursor.zIndexOffset;
            
            Object.defineProperty(this,"backUrl",{
            	enumerable:true,
            	get:function(){return this.domElement.style.backgroundImage;},
            	set:function(url){this.domElement.style.backgroundImage='url("'+url+'")';}
            });
    		this.urls=null;
    		this.setUrls(urls);
    		
    		this.offset=new SC.point(this.rect.size).div(2);
    		this.setOffset(offset);
    		
    		this.speed=new SC.point(200);
    		this.setSpeed(speed);
    		
    		this.direction=null;
    		this.updateDirection();
    	},
        update:function()
        {
        	GUI.Map.Image.prototype.update.call(this);
        },
        updateDirection:function()
        {
        	this.domElement.classList.remove("up","right","down","left");
        	if(this.direction)
        	{
        		// y axis is inverted on screen
	            var direction8=this.direction.clone().mul(1,-1).getDirection8();
	            if(this.urls[direction8]) this.backUrl=this.urls[direction8];
	            else if (direction8!==0&&direction8%2===0&&this.urls[direction8-1]) this.backUrl=this.urls[direction8-1];
	            else this.backUrl=this.urls[0];
	            
	            if(direction8>=1&&(direction8<=2||direction8===8))
	            {
	                this.domElement.classList.add("up");
	            }
	            if(direction8>=2&&direction8<=4)
	            {
	            	this.domElement.classList.add("right");
	            }
	            if(direction8>=4&&direction8<=6)
	            {
	            	this.domElement.classList.add("down");
	            }
	            if(direction8>=6&&direction8<=8)
	            {
	            	this.domElement.classList.add("left");
	            }
            }
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
    	setUrls:function(urls)
    	{
    		this.urls=[].concat(urls);
    		this.backUrl=this.urls[0];
    		if(this.domElement)this.updateDirection();
    	},
    	move:function(direction,timediff)
    	{
    		this.direction=direction;
    		var distance=new SC.point();
			if(this.map)
			{
				var size=this.map.getSize();
				distance.set(this.direction).mul(this.speed).mul(timediff/1000);
				
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
					rect.position.add(distance);
					var collisions=this.map.gui.collide(rect);
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
				GUI.Map.Image.prototype.move.call(this,distance);
			}
			this.updateDirection();
			return distance;
    	},
		toJSON:function()
		{
			var json=GUI.Map.Image.prototype.toJSON.call(this);
			json.offset=this.offset;
			json.speed=this.speed;
			delete json.url;
			json.urls=this.urls.slice();
			return json;
		},
		fromJSON:function(json)
		{
			json.url=GUI.Map.Cursor.emptyImage;
			GUI.Map.Image.prototype.fromJSON.call(this,json);
			this.offset.set(json.offset);
			this.speed.set(json.speed);
			this.setUrls(json.urls);
			
			return this;
		}
    });
	GUI.Map.Cursor.emptyImage="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    GUI.Map.Cursor.zIndexOffset=100;
    GUI.Map.Cursor.Animation=µ.Class({
    	init:function(cursor)
    	{
    		this.cursor=cursor;
    		this.progress=0;
    	},
    	step:function(timeDiff)
    	{
    		SC.debug("Abstract GUI.Map.Cursor.Animation used",SC.debug.LEVEL.WARNING);
    	}
    });
    GUI.Map.Cursor.Animation.Key=µ.Class(GUI.Map.Cursor.Animation,{ //key animation
    	init:function(cursor,keys)
    	{
    		this.superInit(GUI.Map.Cursor.Animation,cursor);
    		this.keys=keys;
    		
    		this.cursor.setPosition(this.keys[0]);
    		this.progress=1;//next key
    	},
    	step:function(timediff)
    	{
    		if(this.keys[this.progress])
    		{
    			var dir=this.cursor.getPosition().negate().add(this.keys[this.progress]);
    			var dist=this.cursor.speed.clone().mul(timediff/1000);
    			if( (dist.x>Math.abs(dir.x)&&dist.y>Math.abs(dir.y)) && (this.keys.length>this.progress+1))
    			{
    				var remaining=dist.clone().sub(dir.abs()).div(dist);
    				dir=new SC.point(this.keys[this.progress+1]).sub(this.keys[this.progress]).mul(remaining).add(this.keys[this.progress]);
    				dir=this.cursor.getPosition().negate().add(dir);
    				this.progress++;
    			}
    			dir.div(dist);
    			var absX=Math.abs(dir.x),absY=Math.abs(dir.y)
    			if(absX>1||absY>1) dir.mul(1/(absX>absY ? absX : absY));
    			else
    			{
    				dir.set(0);
    			}
    			return dir;
    		}
    		else
    		{
    			return new SC.point();
    		}
    	}
    });
	SMOD("GUI.Map",GUI.Map);
	
})(Morgas,Morgas.setModule,Morgas.getModule);