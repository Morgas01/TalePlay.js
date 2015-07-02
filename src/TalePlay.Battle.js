(function(µ,SMOD,GMOD,HMOD){
	
    var TALE=this.TalePlay=this.TalePlay||{};

	var LOGGER=GMOD("debug");
    var LISTENERS=GMOD("Listeners");
    
    TALE.Battle=µ.Class(LISTENERS,{

		/**
		 * @callback areDefeated
		 * @param {Character[]} group
		 * @this Battle
		 * @returns {Boolean}
    	*/
    	
    	/**
    	 * @param {Character[]} allies
    	 * @param {Character[]} enemies
    	 * @param {areDefeated} [areDefeated]
    	 */
    	init:function(allies,enemies)
    	{
    		this.mega();
    		this.createListener("skill action .finish");
    		
    		this.allies=allies;
    		this.enemies=enemies;
    	},
    	
    	/**
    	 * @param {Skill} skill
    	 * @param {Character} user
    	 * @param {(Character|Character[])} target
    	 */
    	executeSkill:function(skill,user,target)
    	{
    		var actions=[].concat(skill.calcFn(this,user,target));
    		this.fire("skill",{
    			skill:skill,
    			user:user,
    			target:target
    		});
    		for(var i=0;i<actions.length;i++)
    		{
    			var a=actions[i];
    			a=this.executeAction(a);
    			if(a)
    			{
	    			a.doer=user;
	    			this.fire(a.type,a);
    			}
    		}
    		this.check();
    	},
    	
    	/**
    	 * @param {Object} action
    	 * @param {String} action.type
    	 * @param {Number} action.amount
    	 * @param {Character} action.target
    	 */
    	executeAction:function(action)
    	{
    		switch (action.type)
    		{
    			case "damage":
    				action.target.life.sub(action.amount);
    				break;
    			case "heal":
    				action.target.life.add(action.amount);
    				break;
    			default:
    				LOGGER.warn(["unknown action type ",action.type]);
    				return null;
    		}
    		this.fire("action",action);
    		return action;
    	},
    	check:function()
    	{
    		var win=TALE.Battle.areDead(this.allies)*2-TALE.Battle.areDead(this.enemies);
    		if(win!==0)
    		{
    			this.setState(".finish",{
	    			win:win==-1
	    		});
    		}
    	}
    });
    TALE.Battle.isDead=function(character)
    {
    	return character.life.value<=0;
    };
    TALE.Battle.areDead=function(group)
    {
    	return group.reduce((a,b)=>a&&TALE.Battle.isDead(b),true);
    };
    SMOD("Battle",TALE.Battle);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);