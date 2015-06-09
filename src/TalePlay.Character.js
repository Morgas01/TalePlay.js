(function(µ,SMOD,GMOD,HMOD){
	
    var TALE=this.TalePlay=this.TalePlay||{};
	
	
	var SC=GMOD("shortcut")({
		promise:"Promise",
		ATTR:"Attributes"
	});
	
	TALE.Character=µ.Class({
		init:function(param)
		{
			this.mega();
			this.fromJSON(param);
		},
		fromJSON:function(json)
		{
			this.name=json.name||"";
			this.life=new TALE.Character.Energy(json.life);
			this.attributes=new SC.ATTR(json.attributes);
		}
	});
	SMOD("Character",TALE.Character);
	
	TALE.Character.Energy=µ.Class({
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
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);