(function(µ,SMOD,GMOD,HMOD,SC){

	var	MAP=GMOD("Map");

    SC=SC({
		org:"Organizer",
		rs:"rescope",
		RECT:"Math.Rect",
		POINT:"Math.Point"
    });

	var collisionFilter=function(img){return img.collision};
	//var triggerGroups=function(img){return Object.keys(img.triggers)};

    var INT=MAP.Interactive=µ.Class(MAP,
    {
        init:function(param)
        {
			this.org=new SC.org();
        	this.mega(param);

			SC.rs.all(this,["_animate"]);

			this.org.filter("collision",collisionFilter);
			//.group("triggers",triggerGroups);

			this.animations=new Set();
			this.animationRequest=null;
			this.animationTime=null;

			this.startAnimations();
        },
		add:function(image)
		{
			if(this.mega(image))
			{
				this.org.add(image);
				return true;
			}
			return false;
		},
		remove:function(image)
		{
			if(this.mega(image))
			{
				this.org.remove(image);
				return true;
			}
			return false;
		},
		addAnimation:function(animation)
		{
			this.animations.add(animation);
		},
		startAnimations:function()
		{
			if(this.animationRequest==null)
			{
				this.animationTime=Date.now();
				this.animationRequest=requestAnimationFrame(this._animate);
			}
		},
		stopAnimaion:function()
		{
			if(this.animationRequest!=null)
			{
				cancelAnimationFrame(this.animationRequest);
				this.animationRequest=this.animationTime=null;
			}
		},
		_animate:function()
		{
			var time=Date.now();
			var timeDiff=time-this.animationTime;
			for(var ani of this.animations)
			{
				var running=true;
				try
				{
					running=ani.step(timeDiff);
				}
				catch (e)
				{
					running=false;
					µ.logger.warn(e);
				}
				if(!running) this.animations.delete(ani);
			}

			this.animationTime=time;
			this.animationRequest=requestAnimationFrame(this._animate);
		},
		collide:function(rect)
		{
			var rtn=[],cImages=this.organizer.getFilter("collision");
			for(var i=0;i<cImages.length;i++)
			{
				if(cImages[i].rect.collide(rect))
				{
					rtn.push(cImages[i]);
				}
			}
			return rtn;
		}
    });
	SMOD("Map.Int",INT);
	INT.Image= µ.Class(MAP.Image,
    {
        init:function(url,position,size,name,triggers,collision,collideRect)
        {
        	this.mega(url,position,size,name);
			this.triggers={};
			if(triggers)
			{
				for(var t of INT.Image.TRIGGER_TYPES)
				{
					if(t in triggers)this.triggers[t]=triggers[t];
				}
			}
			this.collision=!!collision;
			this.collideRect=new SC.RECT(0,0,size);
			if(collideRect)this.collideRect.copy(collideRect);
        },
		setCollision:function(collision)
		{
			if(this.collision!=!!collision)
			{
				this.collision=!!collision;
				this.map.org.update([this]);
			}
		},
		toJSON:function()
		{
			var rtn=this.mega();
			rtn.triggers=this.triggers;
			rtn.collision=this.collision;
			rtn.collideRect=this.collideRect;
			return rtn;
		},
		fromJSON:function(json)
		{
			this.mega(json);
			this.triggers=json.triggers;
			this.collision=json.collision;
			this.collideRect.copy(json.collideRect);
		},

		move:function(numberOrPoint,y)
		{
			var distance=new SC.point(numberOrPoint,y);
			if(this.map)
			{
				var mapSize=this.map.size;
				var rect=this.collideRect.clone();
				var rPos=rect.position;
				rPos.add(this.rect.position);

				//map boundary
				if(rPos.x+distance.x<0)
				{
					distance.x=-rPos.x;
				}
				else if (rPos.x+distance.x>mapSize.x)
				{
					distance.x=mapSize.x-rPos.x;
				}
				if(rPos.y+distance.y<0)
				{
					distance.y=-rPos.y;
				}
				else if (rPos.y+distance.y>mapSize.y)
				{
					distance.y=mapSize.y-rPos.y;
				}
				//collision
				if(this.collision)
				{
					var progress=new SC.POINT(1,1);
					var cRect=rect.clone();
					cRect.position.add(rtn.distance);
					var collisions=this.map.collide(rect);
					for(var i=0;i<collisions.length;i++)
					{
						var cImage=collisions[i];
						var px=null,py=null;
						if(cImage===this||rect.collide(cImage.rect)||cImage.rect.collide(rect))
						{//is self or inside
							continue;
						}

						var absMe=rect.getAbsolute();
						var absImage=cImage.rect.getAbsolute();
						if(distance.x>0&&absMe.max.x<=absImage.min.x)
						{
							px=(absImage.min-absMe.max.x)/distance.x;
						}
						else if(distance.x<0&&absMe.min.x>=absImage.max.x)
						{
							px=(absImage.max-absMe.min.x)/distance.x;
						}

						if(distance.y>0&&absMe.max.y<=absImage.min.y)
						{
							py=(absImage.min.y-absMe.max.y)/distance.y;
						}
						else if (distance.y<0&&absMe.min.y>=absImage.max.y)
						{
							py=(absImage.max.y-absMe.min.y)/distance.y;
						}

						if(p!==null)
						{
							progress=Math.min(progress,p);
						}
					}
					distance.mul(progress);
				}
			}
			this.mega(distance);
			return distance;
		}

    });
	INT.Image.TRIGGER_TYPES=["stepIn","setpOver","stepOut","activate","collide"];
	SMOD("Map.Int.Image",INT.Image);

	INT.Animation=µ.Class({
		init:function(target)
		{
			this.target=target;
		},
		step:function(timeDiff)
		{
			return false;
		}
	});
	SMOD("Map.Int.Animation",INT.Animation);
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);