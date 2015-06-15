(function(µ,SMOD,GMOD,HMOD){

    var TALE=this.TalePlay=this.TalePlay||{};
	
    TALE.Skill=µ.Class({
    	/**
    	 * @callback Skill~calcFn
    	 * @param {Battle} battle
    	 * @param {Character} user
    	 * @param {Character[]} target
    	 */
    	/**
    	 * @param {Skill~calcFn} calcFn
    	 * @param {Number} (target=Skill.Targets.SINGLE) - @see Skill.Targets
    	 * @param {Object} (costs=null) - map of energy costs 
    	 */
    	init:function(name,calcFn,target,costs)
    	{
    		this.name=name;
    		this.calcFn=calcFn;
    		this.target=target||TALE.Skill.Targets.SINGLE;
    		this.costs={};
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