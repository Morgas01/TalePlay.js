(function(µ,SMOD,GMOD,HMOD){
	
    var CHAR=GMOD("Character");
	
	var SC=GMOD("shortcut")({
		promise:"Promise",
		ATTR:"Attributes"
	});
	
	CHAR.Player=µ.Class(CHAR,{
		fromJSON:function(json)
		{
			this.mega(json);
			
			this.level=json.level;
			this.exp=json.exp;
		}
	});
	SMOD("Character.Player",CHAR.Player);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);