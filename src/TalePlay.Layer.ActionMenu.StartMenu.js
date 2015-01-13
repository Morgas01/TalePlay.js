(function(µ,SMOD,GMOD){
	
	//TODO change to Layer
	
	var AMENU=GMOD("Layer.ActionMenu");
	
	var SC=GMOD("shortcut")({
		rj:"Request.json",
		debug:"debug"
	});
	
	var SMENU=AMENU.StartMenu=µ.Class(AMENU,{
		init:function(param)
		{
			param=param||{};
			
			this.superInit(AMENU,{
				styleClass:["panel","center"],
				actions:[
					{
						text:"New Game",
						action:"newGame",
						url:param.newGameUrl
					},
					{
						text:"Load",
						action:"loadSave"
					},
					{
						text:"import from File",
						action:"fileImport"
					}
				],
			});

			this.domElement.classList.add("StartMenu");
			this.createListener("start");
		
			this.persistanceLayer=(typeof param.persistanceLayer==="function")?param.persistanceLayer:GMOD(param.persistanceLayer||"Layer.Persistance");
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
						AMENU.prototype.onController.call(this,event);
						break;
				}
			}
			else
			{
				AMENU.prototype.onController.call(this,event);
			}
		},
		newGame:function(item)
		{
			SC.rj(item.url,this).then(function(newGameJson,scope)
			{
				scope.fire("start",{save:newGameJson});
			},
			function(error)
			{
				SC.debug(["could not load new game: ",error],SC.debug.LEVEL.ERROR);
			});
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
			});
			this.board.addLayer(p);
		},
		fileImport:function()
		{
			//TODO
		}
	});
	SMOD("StartMenu",SMENU);
	
})(Morgas,Morgas.setModule,Morgas.getModule);