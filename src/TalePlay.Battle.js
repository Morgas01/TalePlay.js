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
    	init:function(allies,enemies,areDefeated)
    	{
    		this.mega();
    		this.createListener("skill action .finish");
    		
    		this.allies=allies;
    		this.enemies=enemies;
    		this.areDefeated=areDefeated||TALE.Battle.ALL_DEAD;
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
    SMOD("Battle",TALE.Battle);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);