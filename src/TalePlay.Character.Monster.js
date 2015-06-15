(function(µ,SMOD,GMOD,HMOD){
	
    var CHAR=GMOD("Character");
	
	var SC=GMOD("shortcut")({
		promise:"Promise",
		ATTR:"Attributes"
	});
	
	CHAR.Monster=µ.Class(CHAR,{
		fromJSON:function(json)
		{
			this.mega(json);
			
			if(typeof json.ki==="function")
			{
				this.ki=json.ki;
			}
			else
			{
				this.ki=CHAR.Monster.KI[json.ki];
			}
		},
		ki:function(battle){}
	});
	SMOD("Character.Monster",CHAR.Monster);
	
	CHAR.Monster.KI={
		random:function(battle)
		{
			/*
			var index=Math.floor(Math.random()*this.skills.length);
			var skill=this.skills[index];
			var target=null;
			battle.executeSkill(skill,this,target);
			*/
			//TODO
		}
	}
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);