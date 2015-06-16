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
			
			this.domElement.innerHTML='<div class="visual"></div><div class="control"></div>';
			this.controlDiv=this.domElement.childNodes[1];
			
			this.panelMap=new WeakMap();
			for(var i=0;i<allies.length;i++)
			{
				this.panelMap.set(allies[i],new SC.CP(allies[i]));
				this.add(this.panelMap.get(allies[i]),this.controlDiv);
			}
			
			//start
			this.battle.next();
		},
		_playerTurn:function(event)
		{
			var cp=this.panelMap.get(event.value.player);
			cp.addStyleClass("active");
			this.focused=new SC.PBM(event.value)
			this.add(this.focused,this.controlDiv);
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
		}
	});
	
	SMOD("Layer.RoundBasedBattle",Layer.RoundBasedBattle);
	
})(Morgas,Morgas.setModule,Morgas.getModule);