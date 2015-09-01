(function(µ,SMOD,GMOD,HMOD,SC){
	
	//TODO change to Layer
	
	var AMENU=GMOD("Layer.ActionMenu");
	
	SC=SC({
		manager:"GUI.ControllerManager",
		rj:"request.json",

		//default
		persistanceLayer:"Layer.Persistance"
	});
	
	var SMENU=AMENU.StartMenu=µ.Class(AMENU,{
		init:function(param)
		{
			param=param||{};
			
			this.mega({
				styleClass:["panel","center"],
				actions:[
					{
						text:"New Game",
						action:"newGame",
						url:param.newGameUrl
					},
					{
						text:"Controllers",
						action:"openControllerManager",
						controllerLayout:param.controllerLayout||{}
					},
					{
						text:"Load",
						action:"loadSave"
					},
					{
						text:"import from File",
						action:"fileImport"
					}
				]
			});

			this.domElement.classList.add("StartMenu");
			this.createListener("start");

			if(typeof param.persistanceLayer==="function") this.persistanceLayer=param.persistanceLayer;
			else if (param.persistanceLayer)this.persistanceLayer=GMOD(param.persistanceLayer);
			else this.persistanceLayer=SC.persistanceLayer;
			this.dbConn=param.dbConn;
			this.saveClass=param.saveClass;
			this.saveConverter=param.saveConverter;

		},
		onController:function(event)
		{
			if(event.type==="buttonChanged"&&event.value==1)
			{
				switch(event.index)
				{
					case 1:
						this.menu.setActive(0);
						break;
					case 2:
						this.mega(event);
						break;
				}
			}
			else
			{
				this.mega(event);
			}
		},
		newGame:function(item)
		{
			SC.rj(item.url,this).then(function(newGameJson)
			{
				var save=new this.saveClass();
				save.fromJSON(newGameJson);
				this.fire("start",{save:save});
			},
			function(error)
			{
				µ.logger.error("could not load new game: ",error);
			});
		},
		openControllerManager:function(item)
		{
			var param={
				styleClass:["panel","overlay"],
				buttons:item.controllerLayout.buttons,
				analogSticks:item.controllerLayout.analogSticks,
				dbConn:this.dbConn
			};
			var m=new SC.manager(param);
			this.add(m);
			m.update("controllers");
		},
		loadSave:function()
		{
			var p=new this.persistanceLayer({
				dbConn:this.dbConn,
				saveClass:this.saveClass,
				saveConverter:this.saveConverter
			});
			p.addListener("load:once",this,function(event)
			{
				this.fire("start",{save:event.save});
				event.source.destroy();
			});
			this.board.addLayer(p);
		},
		fileImport:function()
		{
			//TODO
		}
	});
	SMOD("StartMenu",SMENU);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);