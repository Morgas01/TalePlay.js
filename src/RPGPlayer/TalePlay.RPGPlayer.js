(function(µ,SMOD,GMOD){
	
	var Layer=GMOD("Layer");

	var SC=µ.getModule("shortcut")({
		det:"Detached",
		rj:"Request.json",
		debug:"debug",
		idb:"IDBConn",
		
		Map:"GUI.Map",
		Dialog:"GUI.Dialog",
		GameSave:"RPGPlayer.GameSave"
		/* default modules:
		 * StartMenu
		 * RPGPlayer.GameMenu
		 */
	});
	
	var requestCallbacks={
		quests:{
			loaded:function quests_loaded(quests,self)
            {
            	for(var i=0;i<quests.length;i++)
            	{
            		var quest=new RPGPlayer.Quest(quests[i]);
            		self.quests.set(quest.name,quest);
            	}
            	return self;
            },
			error:function quest_load_error(error)
            {
				SC.debug(["Could not load Quests: ",error],0);
				return error;
            }
		},
		dialogs:{
			loaded:function dialogs_loaded(dialogs,self)
            {
            	for(var i=0;i<dialogs.length;i++)
            	{
            		self.dialogs.set(dialogs[i].name,dialogs[i]);
            	}
            	return self;
            },
			error:function dialogs_load_error(error)
            {
            	SC.debug(["Could not load Dialogs: ",error],0);
				return error;
            }
		}
	};

    var RPGPlayer=Layer.RPGPlayer=µ.Class(Layer,{
        init:function(param)
        {
            param=param||{};
            this.superInit(Layer,param);
			this.domElement.classList.add("RPGPlayer");
			
			if(!param.board)
			{
				throw "board is undefined";
			}
			else
			{
				param.board.addLayer(this);
			}
			
			if(!param.gameName)
			{
				throw "gameName is undefined";
			}
			else
			{
				this.gameName=param.gameName;
				this.domElement.dataset.gamename=this.gameName;
				this.dbConn=new SC.idb(this.gameName);
			}
			this.createListener("ready quest-activate quest-complete quest-abort");
			
			this.baseUrl=param.baseUrl||"";
			this.imageBaseUrl=param.imageBaseUrl||param.baseUrl||"";
			this.mapBaseUrl=param.mapBaseUrl||param.baseUrl||"";
            this.cursor=new SC.Map.Cursor();

            this.quests=new Map();
			this.activeQuests=new Map();
            this.questsReady=SC.rj(this.baseUrl+"quests.json",this).then(requestCallbacks.quests.loaded,requestCallbacks.quests.error);
            
            this.dialogs=new Map();
            SC.rj(this.baseUrl+"dialogs.json",this).then(requestCallbacks.dialogs.loaded,requestCallbacks.dialogs.error);
            
            this.focused=null;
            this.mapName=null;
			this.map=new SC.Map();
			this.map.addListener("trigger",this,"_onTrigger");
			
			this._StartMenu=(typeof param.startMenu==="function")?param.startMenu:GMOD(param.startMenu||"StartMenu");
			this._GameMenu=(typeof param.gameMenu==="function")?param.gameMenu:GMOD(param.gameMenu||"RPGPlayer.GameMenu");
			
			this._openStartMenu();
        },
        _openStartMenu:function()
        {
        	this.focused=null;
        	var smenu=new this._StartMenu({
        		dbConn:this.dbConn,
        		saveClass:SC.GameSave,
        		saveConverter:RPGPlayer.saveConverter,
        		newGameUrl:this.baseUrl+"newgame.json"
        	});
        	smenu.addListener("start:once",this,function(event)
			{
				event.source.destroy();
				this.focused=this.map;
				if(!this.has(this.map)) this.add(this.map);
				this.loadSave(event.save);
			});
			this.board.addLayer(smenu);
        },
		_openGameMenu:function(enableSave)
		{
			this.map.movingCursors["delete"](this.cursor);
			this.map.setPaused(true);
			this.focused=null;
			var gmenu=new this._GameMenu({
				dbConn:this.dbConn,
        		saveClass:SC.GameSave,
				saveConverter:RPGPlayer.saveConverter,
				saveData:enableSave?this.getSave():null
			});
			gmenu.addListener("close:once",this,function(event)
			{
				event.source.destroy();
				this.focused=this.map;
				this.map.setPaused(false);
			});
			this.board.addLayer(gmenu);
		},
		onController:function(event)
		{
			if(this.focused)
			{
				if(this.focused===this.map&&event.type==="buttonChanged")
				{
					switch (event.index)
					{
						case 1:
							//TODO speed up?
						case 2:
							this.focused[Layer._CONTROLLER_EVENT_MAP[event.type]](event);
							break;
						case 3:
							if(event.value==1) this._openGameMenu();
							break;
					}
				}
				else
				{
					this.focused[Layer._CONTROLLER_EVENT_MAP[event.type]](event);
				}
			}
		},
		loadSave:function(save)
		{
			this.cursor.url=this.imageBaseUrl+save.cursor.url;
			this.cursor.name=save.cursor.name||"";
			this.cursor.rect.size.set(save.cursor.size);
			this.cursor.offset.set(save.cursor.offset);
			this.cursor.speed.set(save.cursor.speed);
			this.cursor.collision=save.cursor.collision!==false;
			
			this.questsReady.complete(function (self)
            {
				var aQ=[];
            	for(var i=0;i<save.quests.length;i++)
            	{
            		if(self.quests.has(save.quests[i]))
            		{
            			var quest=self.quests.get(save.quests[i]).clone();
            			self.activeQuests.set(quest.name,quest);
            			aQ.push(quest.name);
            		}
            	}
            	return aQ;
            });
            this._changeMap(save.map, save.position);
            if(save.actions)
            {
            	this.doActions(save.actions);
            }
		},
		getSave:function()
		{
			var save={
				"cursor":{
					"url":this.cursor.url.slice(this.cursor.url.lastIndexOf("/")+1),
					"name":this.cursor.name,
					"size":this.cursor.rect.size,
					"offset":this.cursor.offset
				},
				"map":this.mapName,
				"position":this.cursor.getPosition(),
				"quests":[]
			};
			var it=this.activeQuests.entries();
			var step=null;
			while(step=it.next(),!step.done)
			{
				save.quests.push(step.value[0]);
			}
			
			return new SC.GameSave({data:save});
		},
		_changeMap:function(name,position)
		{
			this.map.setPaused(true);
			return SC.rj(this.mapBaseUrl+name+".json",this).then(function changeMap_loaded(json,self)
			{
				var todo=json.cursors.concat(json.images);
				while(todo.length>0)
				{
					var image=todo.shift();
					image.url=self.imageBaseUrl+image.url;
				}
				json.position=position;
				var animation=self.map.movingCursors.get(self.cursor);
				self.map.fromJSON(json);
				self.cursor.setPosition(position);
				self.map.add(self.cursor);
				if(animation)
				{
					self.map.movingCursors.set(self.cursor,animation);
				}
				self.map.setPaused(false);
				self.mapName=name;
            	return name;
			},
			function changeMap_Error(error)
			{
				SC.debug(["Could not load Map: ",name,error],0);
				return error;
			});
		},
		_stopCursor:function()
		{
			if(this.cursor.direction)
			{
				this.cursor.direction.set(0);
			}
		},
		_showDialog:function(dialogName)
		{
			var dialog=this.dialogs.get(dialogName);
			if(dialog)
			{
				dialog.styleClass="panel";
				this.focused=new SC.Dialog(dialog);
				this.focused.addListener("dialogEnd:once",this,function(event)
				{
					this.focused.destroy();
					this.focused=this.map;
					if(event.actions)
					{
						this.doActions(event.actions);
					}
				});
				this.add(this.focused);
				this._stopCursor();
			}
		},
		_onTrigger:function(e)
		{
			this.doActions(e.value);
		},
		doActions:function(actions)
		{
			for(var i=0;i<actions.length;i++)
			{
				var a=actions[i];
				switch (a.type) 
				{
					case "ABORT_QUEST":
						var quest=this.activeQuests.get(a.questName);
						if(quest)
						{
							this.activeQuests["delete"](a.questName);
							this.fire("quest-abort",{value:quest});
						}
						break;
					case "RESOLVE_QUEST":
						var quest=this.activeQuests.get(a.questName);
						if(quest)
						{
							this.activeQuests["delete"](a.questName);
							this.fire("quest-complete",{value:quest});
							actions=actions.concat(quest.resolve);
						}
						break;
					case "ACTIVATE_QUEST":
						var quest=this.quests.get(a.questName);
						if(quest)
						{
							quest=quest.clone();
							this.activeQuests.set(quest.name,quest);
							this.fire("quest-activate",{value:quest});
						}
						break;
					case "CHANGE_MAP":
						this._changeMap(a.mapName, a.position);
						break;
					case "SHOW_DIALOG":
						this._showDialog(a.dialogName);
						break;
					case "OPEN_GAMEMENU":
						this._openGameMenu(a.enableSave);
						break;
					case "EXECUTE":
						try{
							a.value(this);
						}catch(e){µ.debug(["doAction Error: ",a,e],0);}
						break;
				}
			}
		}
    });
	RPGPlayer.saveConverter=function(save,index)
	{
		if(!save)
			return ["EMPTY"];
		try
		{
			return [index,save.getTimeStamp().toLocaleString(),save.getData().map];
		}
		catch(error)
		{
			SC.debug([error,save],SC.debug.LEVEL.ERROR);
			return "CORRUPT DATA";
		}
	};
	SMOD("RPGPlayer",RPGPlayer);

	RPGPlayer.Quest=µ.Class({
		init:function(param)
		{
			param=param||{};
			
			this.name=param.name||"NO NAME!";
			this.description=param.description||"NO DESCRIPTION!";
			this.resolve=param.resolve||[];
		},
		clone:function(cloning)
		{
			if(!cloning)
			{
				cloning=new RPGPlayer.Quest();
			}
			cloning.name=this.name;
			cloning.description=this.description;
			cloning.resolve=this.resolve.slice();
			
			return cloning;
		}
	});
	SMOD("RPGPlayer.Quest",RPGPlayer.Quest);
})(Morgas,Morgas.setModule,Morgas.getModule);