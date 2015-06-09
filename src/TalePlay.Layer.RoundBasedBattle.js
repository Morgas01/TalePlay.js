(function(µ,SMOD,GMOD){
	
	var Layer=GMOD("Layer"),
	
	SC=GMOD("shortcut")({
		rs:"rescope",
		RBB:"Battle.RoundBased",
		CP:"GUI.CharacterPanel",
		PBM:"GUI.PlayerBattleMenu",
	});
	
	Layer.RoundBasedBattle=µ.Class(Layer,{
    	/**
    	 * @param {Character[]} allies
    	 * @param {Character[]} enemies
    	 * @param {areDefeated} [areDefeated]
    	 */
    	init:function(allies,enemies,areDefeated)
    	{
    		this.mega({mode:Layer.Modes.FOCUSED});
			this.addStyleClass("RoundBasedBattle");
			this.battle=new RBB(allies,enemies,areDefeated);
			this.battle.addListener(".playerTurn",this,this._playerTurn);
			this.battle.addListener("action",this,this._action);
			
			this.domElement.innerHTML='<div class="visual"></div><div class="control"></div>';
			this.controlDiv=this.domElement.childNodes[1];
			
			for(var i=0;i<allies.length;i++)
			{
				this.add(new SC.CP(allies[i]),this.controlDiv);
			}
			
			//start
			this.battle.next();
		},
		_playerTurn:function(event)
		{
			this.focused=new SC.PBM(event)
			this.add(this.focused,this.controlDiv);
		},
		_action:function(event)
		{
			//TODO update gui
			this.battle.next();
		}
	});
	
	SMOD("Layer.RoundBasedBattle",Layer.RoundBasedBattle);
	
})(Morgas,Morgas.setModule,Morgas.getModule);