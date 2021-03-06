(function(µ,SMOD,GMOD,HMOD,SC){
	
	//TODO change to Layer
	
	var LAYER=GMOD("Layer");
	
	SC=SC({
		Menu:"GUI.Menu"
	});
	
	var AMENU=LAYER.ActionMenu=µ.Class(LAYER,{
		init:function(param)
		{
			param=param||{};
			
			this.mega({mode:LAYER.Modes.LAST});

			this.domElement.classList.add("ActionMenu");
			
			this.menu=new SC.Menu({
				styleClass:param.styleClass,
				items:param.actions,
				active:param.active||0,
				loop:param.loop===true,
				selectionType:SC.Menu.SelectionTypes.NONE,
				converter:param.converter||AMENU.defaultConverter,
				disabled:param.disabled
			});
			
			this.add(this.menu);
			this.menu.addListener("select",this,"_onSelect");

		},
		_onSelect:function(event)
		{
			if(typeof this[event.value.action]==="function")
			{
				this[event.value.action](event.value);
			}
			else
			{
				µ.logger.error(event.value.action+" is not a function");
			}
		}
	});
	AMENU.defaultConverter=function(item)
	{
		return item.text;
	};
	SMOD("Layer.ActionMenu",AMENU);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);