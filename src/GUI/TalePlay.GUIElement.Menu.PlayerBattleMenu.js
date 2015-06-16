(function(µ,SMOD,GMOD,HMOD){
	
	var MENU=GMOD("GUI.Menu");
	
	var SC=GMOD("shortcut")({
		Skill:"Skill",
		Character:"Character"
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
			this.selectedSkill=null;
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
				if(event.value.target===SC.Skill.Targets.SELF)
				{
					this.actionSignal.resolve([this.selectedSkill,this.player]);
				}
				else
				{
					this.selectedSkill=event.value;
					this.previous.push(this.menu.items);
					this._show({items:this.battle.enemies});
				}
			}
			else if (this.selectedSkill&&event.value instanceof SC.Character)
			{
				this.actionSignal.resolve([this.selectedSkill,event.value]);
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
				else if (event.index===1&&this.previous.length>0)
				{
					if(this.selectedSkill)this.selectedSkill=null;
					this._show(this.previous.shift());
				}
			}
		}
	});
	PBM.converter=function(item)
	{
		return item.name;
	}
	SMOD("Menu.PlayerBattleMenu",PBM);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);