(function(µ,SMOD,GMOD,HMOD){
	
	var CHAR=GMOD("Character");
	
	CHAR.Energy=µ.Class({
		init:function(param)
		{
			this.fromJSON(param);
		},
		fromJSON:function(json)
		{
			this.value=json.value;
			this.max=json.max;
			return this.clamp();
		},
		clamp:function(val)
		{
			if(val!==true)this.max=Math.max(0,this.max);
			if(val!==false)this.value=Math.max(0,Math.min(this.value,this.max));
			return this;
		},
		setValue:function(value)
		{
			this.value=value;
			return this.clamp(true);
		},
		setMax:function(max)
		{
			this.max=max;
			return this.clamp(false);
		},
		add:function(value)
		{
			this.value+=value;
			return this.clamp(true);
		},
		sub:function(value)
		{
			this.value-=value;
			return this.clamp(true);
		},
	});
	SMOD("Character.Energy",CHAR.Energy);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);