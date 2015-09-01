(function(µ,SMOD,GMOD,HMOD,SC){
	
    var CHAR=GMOD("Character");
	
	SC=SC({
		ATTR:"Attributes"
	});
	
	CHAR.Player=µ.Class(CHAR,{
		fromJSON:function(json)
		{
			this.mega(json);
			
			this.level=json.level;
			this.exp=json.exp;
			this.abilities=json.abilities
		}
	});
	SMOD("Character.Player",CHAR.Player);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);