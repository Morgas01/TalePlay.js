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
    	 * @param {Object} skills - Object map of skill functions
    	 * @param {areDefeated} [areDefeated]
    	 */
    	init:function(allies,enemies,skills,areDefeated)
    	{
    		this.mega();
    		this.createListener(".finish");
    		
    		this.allies=allies;
    		this.enemies=enemies;
    		this.skills=skills;
    		this.areDefeated=areDefeated||TALE.Battle.ALL_DEAD;
    	},
    	
    	/**
    	 * @param {String} name
    	 * @param {Character} user
    	 * @param {(Character|Character[])} target
    	 */
    	executeSkill:function(name,user,target)
    	{
    		var skill=this.skills[name];
    		var actions=skill(this,user,target);
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
    				target.life.sub(amount);
    				break;
    			case "heal":
    				target.life.add(amount);
    				break;
    			default:
    				LOGGER.warn(["unknown action type ",action.type]);
    				return null;
    		}
    		return action;
    	},
    	check:function()
    	{
    		var win=this.areDefeated(this.allies) ? false : (this.areDefeated(this.enemies) ? true : null);
    		if(win!==null)
    		{
    			this.setState(".finish",{
	    			win:win
	    		});
    		}
    	}
    });
    TALE.Battle.ALL_DEAD=function(group)
    {
    	for(var i=0;i<group.length;i++)
    	{
    		if(group[i].life.value>0)return false;
    	}
    	return true;
    };
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);