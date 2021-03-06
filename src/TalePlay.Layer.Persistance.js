(function(µ,SMOD,GMOD,HMOD,SC){
	
	var LAYER=GMOD("Layer");
	
	SC=SC({
		rs:"rescope",
		Menu:"GUI.Menu",
		download:"download"
	});
	
	var PERSISTANCE=LAYER.Persistance=µ.Class(LAYER,{
		init:function(param)
		{
			param=param||{};
			
			this.mega({mode:LAYER.Modes.LAST});
			SC.rs.all(this,["_update","_fillMenu"]);
			
			this.createListener("load");

			this.domElement.classList.add("Persistance");
			
			this.dbConn=param.dbConn;
			this.saveClass=param.saveClass;
			this.saveData=param.saveData;
			
			this.menu=new SC.Menu({
				type:param.type||SC.Menu.Types.TABLE,
				styleClass:"center",
				active:param.active||0,
				loop:param.loop===true,
				selectionType:SC.Menu.SelectionTypes.NONE,
				converter:param.saveConverter
			});
			
			this.add(this.menu);
			this.menu.addListener("select",this,"_onSelect");
			
			this._update();
		},
		onController:function(event)
		{
			if(event.type==="buttonChanged"&&event.value==1)
			{
				switch(event.index)
				{
					case 1:
						if(this.GUIElements.length>1)this.GUIElements[1].setActive(3);//submenu
						else this.destroy();
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
		_update:function()
		{
			this.dbConn.load(this.saveClass,{}).then(this._fillMenu);
			return null;
		},
		_fillMenu:function(results)
		{
			this.menu.clear();
			var saves=[];
			for(var i=0;i<results.length;i++)
			{
				saves[results[i].getID()]=results[i];
			}
			saves.push(null);
			this.menu.addAll(saves);
			if(this.menu.getActive().index===-1)this.menu.setActive(0);
			return null;
		},
		_onSelect:function(event)
		{
			if(event.value)
			{
				var subMenu=new SC.Menu({
					styleClass:["panel","center"],
					items:[
					   this.saveData ? "Save" : "Load",
					   "Export",
					   "Delete",
					   "Cancel"
					],
					active:0,
					loop:false,
					selectionType:SC.Menu.SelectionTypes.NONE
				});
				subMenu.addListener("select",this,"_onSubSelect");
				this.add(subMenu);
			}
			else if (this.saveData)
			{
				this.saveData.setID(event.index);
				this.dbConn.save([this.saveData]).then(this._update);
			}
		},
		_onSubSelect:function(event)
		{
			switch (event.value)
			{
				case "Load":
					this.fire("load",{save:this.menu.getActive().value});
					break;
				case "Save":
					this.saveData.setID(this.menu.getActive().index);
					this.dbConn.save([this.saveData]).then(this._update);
					break;
				case "Export":
					SC.download(JSON.stringify(this.menu.getActive().value),"save.json","application/json");
					break;
				case "Delete":
					this.dbConn["delete"](this.saveClass,[this.menu.getActive().value]).then(this._update);
					break;
				case "Cancel":
					break;
			}
			event.source.destroy();
		}
	});
	SMOD("Layer.Persistance",PERSISTANCE);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);