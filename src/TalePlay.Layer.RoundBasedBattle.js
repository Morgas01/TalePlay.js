(function(µ,SMOD,GMOD){
	
	var Layer=GMOD("Layer"),
	
	SC=GMOD("shortcut")({
		rs:"rescope",
		RBB:"Battle.RoundBased",
		CP:"GUI.CharacterPanel",
		PBM:"Menu.PlayerBattleMenu",
	});
	
	Layer.RoundBasedBattle=µ.Class(Layer,{
    	/**
    	 * @param {Character[]} allies
    	 * @param {Character[]} enemies
    	 * @param {areDefeated} (areDefeated)
    	 */
    	init:function(allies,enemies,areDefeated)
    	{
    		this.mega({mode:Layer.Modes.FOCUSED});
			this.domElement.classList.add("RoundBasedBattle");
			this.battle=new SC.RBB(allies,enemies,areDefeated);
			this.battle.addListener(".playerTurn",this,this._playerTurn);
			this.battle.addListener("action",this,this._action);
			this.listeners[".finish"]=this.battle.listeners[".finish"];
			
			this.domElement.innerHTML='</div><div class="enemies"></div><div class="visual"></div><div class="allies"></div>';
			this.enemiesDiv=this.domElement.childNodes[0];
			this.visualDiv=this.domElement.childNodes[1];
			this.alliesDiv=this.domElement.childNodes[2];
			
			this.panelMap=new WeakMap();
			for(var i=0;i<enemies.length;i++)
			{
				this.panelMap.set(enemies[i],new SC.CP(enemies[i]));
				this.add(this.panelMap.get(enemies[i]),this.enemiesDiv);
			}
			for(var i=0;i<allies.length;i++)
			{
				this.panelMap.set(allies[i],new SC.CP(allies[i]));
				this.add(this.panelMap.get(allies[i]),this.alliesDiv);
			}
			
			//start
			this.battle.next();
		},
		_playerTurn:function(event)
		{
			var cp=this.panelMap.get(event.value.player);
			cp.addStyleClass("active");
			this.focused=new SC.PBM(event.value)
			this.add(this.focused,this.visualDiv);
			this.focused.addListener("destroy",this,function()
			{
				cp.removeStyleClass("active");
				this.focused=null;
			});
		},
		_action:function(event)
		{
			var cp=this.panelMap.get(event.target)
			if(cp)cp.update();
			this.battle.next();
		},
		destroy:function()
		{
			delete this.listeners[".finish"];
			this.battle.destroy();
			this.mega();
		}
	});
	
	SMOD("Layer.RoundBasedBattle",Layer.RoundBasedBattle);
	
})(Morgas,Morgas.setModule,Morgas.getModule);