(function(µ,SMOD,GMOD,HMOD){

    var TALE=this.TalePlay=this.TalePlay||{};
	
    TALE.Skill=µ.Class({
    	init:function(calcFn,target)
    	{
    		this.calcFn=calcFn;
    		this.target=target;
    	}
    });
    TALE.Skill.Targets={
    	SELF:0,
    	SINGLE:1,
    	GROUP:2,
    	ALLIES:3,
    	ENEMIES:4
    };
    
    SMOD("Skill",TALE.Skill);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);