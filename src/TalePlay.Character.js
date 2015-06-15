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
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);