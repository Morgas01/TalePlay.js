(function(µ,SMOD,GMOD,HMOD,SC){
	
	//TODO change to Layer
	
	var AMENU=GMOD("Layer.ActionMenu");

	SC=SC({
		manager:"GUI.ControllerManager",

		// default
		persistanceLayer:"Layer.Persistance"
	});

	var GMENU=AMENU.GameMenu=µ.Class(AMENU,{
		init:function(param)
		{
			param=param||{};
			
			var menuParam={
				styleClass:["panel"],
				actions:[
					{
						text:"Controllers",
						action:"openControllerManager",
						controllerLayout:param.controllerLayout||{}
					},
					{
						text:"save",
						action:"saveGame",
						data:param.saveData
					},
					{
						text:"close",
						action:"close"
					}
				]
			};
			if(!param.saveData)
			{
				menuParam.disabled=[1];
			}
			else menuParam.active=1;
			this.mega(menuParam);

			this.domElement.classList.add("GameMenu");
			this.createListener("start close");

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
						this.menu.setActive(2);
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
		saveGame:function(item)
		{
			if(item.data)
			{
				var p=new this.persistanceLayer({
					dbConn:this.dbConn,
					saveClass:this.saveClass,
					saveConverter:this.saveConverter,
					saveData:item.data
				});
				this.board.addLayer(p);
			}
		},
		close:function()
		{
			this.fire("close");
		}
	});
	SMOD("RPGPlayer.GameMenu",GMENU);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);