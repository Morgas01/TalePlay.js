(function(µ,SMOD,GMOD,HMOD,SC){

	var	Animation=GMOD("Map.Animation");
	var Command=GMOD("Map.Animation.Command");

	var Key=Animation.Key=µ.Class(Command,
	{
		init:function(keys,duration)
		{
			this.mega();
			this.keys=keys||[];
			this.progress=new WeakMap();
		},
		step:function(image,timeDiff)
		{
			var progress=this.progress.get(image);
			if(!progress)progress=0;
			if(!this.mega(image,timeDiff))
			{
				if(progress+1>=this.keys.length)
				{
					this.progress.delete(image);
					return false;
				}
				else this.progress.set(image,progress+1);
			}
			return true;
		}
	});
    SMOD("Map.Animation.Command",Command);
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);