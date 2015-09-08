(function(µ,SMOD,GMOD,HMOD,SC){

	var	MAP=GMOD("Map");

    SC=SC({
		org:"Organizer"
    });

	var collisionFilter=function(img){return img.collision};
	var triggerGroups=function(img){return Object.keys(img.triggers)};

    var INT=MAP.Interactive=µ.Class(MAP,
    {
        init:function(param)
        {
			this.org=new SC.org();
        	this.mega(param);

			this.org.filter("collision",collisionFilter)
			.group("triggers",triggerGroups);

			this.animations=new Map();
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
		}
    });
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
	INT.Image.Animation=µ.Class({
		step:function(image,timeDiff)
		{
			return false;
		}
	});
    SMOD("Map.Int",INT);
	SMOD("Map.Animation",INT.Image.Animation);
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);