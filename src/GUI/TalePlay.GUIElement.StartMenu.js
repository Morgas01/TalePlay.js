(function(µ,SMOD,GMOD){
	
	var GUI=GMOD("GUIElement");
	
	var SC=GMOD("shortcut")({
		Menu:"GUI.Menu",
		rj:"Request.json",
		bind:"bind",
		debug:"debug"
	});
	
	var SMENU=GUI.StartMenu=µ.Class(GUI,{
		init:function(RPGPlayer,param)
		{
			param=param||{};
			this.superInit(GUI,param);

			this.domElement.classList.add("StartMenu");
			this.createListener("start");
			
			this.menu=new SC.Menu({
				styleClass:["panel","center","mainMenu"],
				items:[
					"New Game",
					"Load"
				],
				active:0,
				loop:false,
				selectionType:SC.Menu.SelectionTypes.NONE
			});
			
			this.nodePatch.patchNow();
			this.addChild(this.menu);
			this.menu.addListener("select",this,this._onSelect);

		},
		onAnalogStick:function(event)
		{
			if(this.children.length>0)
			{
				this.children[this.children.length-1].onAnalogStick(event);
			}
		},
		onButton:function(event)
		{
			if(this.children.length>0)
			{
				this.children[this.children.length-1].onButton(event);
			}
		},
		_onSelect:function(event)
		{
			this.removeChild(this.menu);
			switch(event.index)
			{
				case 0:
					SC.rj(this.layer.baseUrl+"newgame.json",this).then(function(newGameJson,scope)
					{
						scope.fire("start",{save:newGameJson});
					},
					function(error)
					{
						SC.debug(["could not load new game: ",error],0);
					})
					break;
				case 1:
					//TODO
					break;
			}
		}
	});
	SMOD("StartMenu",SMENU);
	
})(Morgas,Morgas.setModule,Morgas.getModule);