(function(µ,SMOD,GMOD){
	
	//TODO change to Layer
	
	let AMENU=GMOD("Layer.ActionMenu");
	
	
	let GMENU=AMENU.GameMenu=µ.Class(AMENU,{
		init:function(param)
		{
			param=param||{};
			
			let menuParam={
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
				menuParam.disabled=[0];
			}
			this.superInit(AMENU,menuParam);

			this.domElement.classList.add("GameMenu");
			this.createListener("start close");
		
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
						this.menu.setActive(2);
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
		openControllerManager:function(item)
		{
			let param={
				styleClass:["panel","overlay"],
				buttons:item.controllerLayout.buttons,
				analogSticks:item.controllerLayout.analogSticks,
				dbConn:this.dbConn
			};
			let m=new SC.manager(param);
			this.add(m);
			m.update("controllers");
		},
		saveGame:function(item)
		{
			if(item.data)
			{
				let p=new this.persistanceLayer({
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
	
})(Morgas,Morgas.setModule,Morgas.getModule);