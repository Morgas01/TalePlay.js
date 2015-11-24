(function(µ,SMOD,GMOD,HMOD,SC){

	var	MAP=GMOD("Map");

    SC=SC({
		org:"Organizer",
		rs:"rescope"
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
		}
    });
	SMOD("Map.Int",INT);
	INT.Image= µ.Class(MAP.Image,
    {
        init:function(url,position,size,name,collision,triggers)
        {
        	this.mega(url,position,size,name);
			this.collision=!!collision;
			this.triggers={};
			if(triggers)
			{
				for(var t of INT.Image.TRIGGER_TYPES)
				{
					if(t in triggers)this.triggers[t]=triggers[t];
				}
			}
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