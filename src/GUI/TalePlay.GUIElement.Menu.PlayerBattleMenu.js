(function(µ,SMOD,GMOD,HMOD){
	
	var MENU=GMOD("GUI.Menu");
	
	var SC=GMOD("shortcut")({
		Skill:"Skill"
	});
	
	var PBM=MENU.PlayerBattleMenu=µ.Class(MENU,{
		init:function(param)
		{
			this.mega({
				selectionType:MENU.SelectionTypes.NONE,
				converter:PBM.converter
			});
			
			this.addListener("select",this,"_onSelect");
			
			this.player=param.player;
			this.actionSignal=param.signal;
			this.battle=param.battle;
			this.previous=[];
			this._show(this.player.abilities);
		},
		_show:function(abilityGroup)
		{
			this.clear();
			
			var settings=abilityGroup.settings||{};
			this.type=settings.type||MENU.Types.VERTICAL;
			this.rows=settings.rows||null;
			this.columns=settings.columns||null;
			this.header=settings.header||null;
			
			this.menu.addAll(abilityGroup.items);
			//TODO disable items
			this.update();
			this.setActive(settings.active||0);
		},
		_onSelect:function(event)
		{
			if(event.value instanceof SC.Skill)
			{
				this.actionSignal.resolve(event.value);
				this.destroy();
			}
			else
			{
				this.previous.push(this.menu.items);
				this._show(event.value);
			}
		},
		onButton:function(event)
		{
			if(event.value===1)
			{
				if(event.index===2) this.mega(event);
				else if (event.index===1) this._show(this.previous.shift());
			}
		}
	});
	PBM.converter=function(item)
	{
		return item.name;
	}
	SMOD("Menu.PlayerBattleMenu",PBM);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);