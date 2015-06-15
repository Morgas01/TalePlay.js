(function(µ,SMOD,GMOD,HMOD){

	var LOGGER=GMOD("debug");
    var BATTLE=GMOD("Battle");
    
    var SC=GMOD("shortcut")({
    	MONSTER:"Character.Monster",
    	Promise:"Promise"
    });
    
    BATTLE.RoundBased=µ.Class(BATTLE,{

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
    		this.mega.apply(this,arguments);
    		this.createListener(".playerTurn");

    		this.actions=[];
    		
    		this.timeMap=new Map();
    		this.maxSpeed=0;
    		var speed=0;
    		for(var i=0;i<this.allies.length;i++)
    		{
    			speed=this.allies[i].attributes.get("SPD")||0;
    			this.timeMap.set(this.allies[i],speed);
    			this.maxSpeed=Math.max(this.maxSpeed,speed);
    		}
    		for(var i=0;i<this.enemies.length;i++)
    		{
    			speed=this.enemies[i].attributes.get("SPD")||0;
    			this.timeMap.set(this.enemies[i],speed);
    			this.maxSpeed=Math.max(this.maxSpeed,speed);
    		}
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
    	next:function()
    	{
    		if(this.actions.length>0)
    		{
    			this.executeAction(this.actions.shift());
    		}
    		else if (!this.getState(".playerTurn"))
    		{
    			var activeCharacter=this.getActiveCharacter();
    			if(activeCharacter==null)
    			{
    				this.addTime();
    				activeCharacter=this.getActiveCharacter();
    			}
    			if(activeCharacter!==null) this.turnPromise=this.doTurn(activeCharacter);
    		}
    	},
    	getActiveCharacter:function()
    	{
    		var it=this.timeMap.entries();
    		for(var step=it.next();!step.done;step=it.next())
    		{
    			var [character,time]=step.value;
    			if(time>=this.maxSpeed) return character;
    		}
    		return null;
    	},
    	addTime:function()
    	{
    		var it=this.timeMap.entries();
    		for(var step=it.next();!step.done;step=it.next())
    		{
    			var [character,time]=step.value;
    			this.timeMap.set(character,time+character.attributes.SPD);
    		}
    	},
    	doTurn:function(character)
    	{
			this.timeMap.set(character,0);
    		if(character instanceof SC.MONSTER)
    		{
    			character.ki(this); // execute skill
    			this.next();
    		}
    		else
    		{//Player
    			new SC.Promise(function(signal){
	    			this.setState(".playerTurn",{
	    				player:character,
	    				signal:signal,
	    				battle:this
	    			});
    			},[],this).complete(function(skillAndTarget){
    				this.executeSkill(character,...skillAndTarget);
    			}).always(function(){
    				this.turnPromise=null;
    				this.resetState(".playerTurn");
    				this.next();
    			})
    		}
    	}
    });
    SMOD("Battle.RoundBased",BATTLE.RoundBased);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);