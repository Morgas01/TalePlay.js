(function(µ,SMOD,GMOD){
	
	var Layer=GMOD("Layer");

	var SC=µ.getModule("shortcut")({
		det:"Detached",
		rj:"request.json",
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
			loaded:function quests_loaded(quests)
            {
            	for(var i in quests)
            	{
            		var quest=new RPGPlayer.Quest(quests[i]);
            		this.quests.set(i,quest);
            	}
            	return this;
            },
			error:function quest_load_error(error)
            {
				SC.debug(["Could not load Quests: ",error],0);
				return error;
            }
		},
		dialogs:{
			loaded:function dialogs_loaded(dialogs)
            {
            	for(var i in dialogs)
            	{
            		this.dialogs.set(i,dialogs[i]);
            	}
            	return this;
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
            this.mega(param);
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
			this.createListener("ready quest-activate quest-complete quest-abort execute");
			
			this.baseUrl=param.baseUrl||"";
			this.imageBaseUrl=param.imageBaseUrl||param.baseUrl||"";
			this.mapBaseUrl=param.mapBaseUrl||param.baseUrl||"";
			this.gameSave=new SC.GameSave({
				cursor:new SC.Map.Cursor()
			});

            this.quests=new Map();
            this.questsReady=SC.rj(this.baseUrl+"quests.json",this).then(requestCallbacks.quests.loaded,requestCallbacks.quests.error);
            
            this.dialogs=new Map();
            SC.rj(this.baseUrl+"dialogs.json",this).then(requestCallbacks.dialogs.loaded,requestCallbacks.dialogs.error);
            
            this.focused=null;
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
			this.map.movingCursors["delete"](this.gameSave.getCursor());
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
			this.setCursor(save.getCursor());
			
			var activeQuests=this.gameSave.getQuests();
			activeQuests.length=0;
			
			var saveQuests=save.getQuests();
        	for(var i=0;i<saveQuests.length;i++)
        	{
        		if(this.quests.has(saveQuests[i]))
        		{
        			if(activeQuests.indexOf(saveQuests[i])===-1)activeQuests.push(saveQuests[i]);
        		}
        		else
        		{
        			SC.debug("quest "+saveQuests[i]+" not found",SC.debug.LEVE.ERROR);
        		}
        	}
            this._changeMap(save.getMap(), save.getPosition());
            if(save.getActions())
            {
            	this.doActions(save.getActions());
            }
		},
		setCursor:function(cursor)
		{
			var _self=this;
			cursor.urls=cursor.urls.map(function(u){return u ? _self.imageBaseUrl+u : u});
			cursor.name=cursor.name||"";
			cursor.collision=cursor.collision!==false;
			this.gameSave.getCursor().fromJSON(cursor);
		},
		getSave:function()
		{
			this.gameSave.setTimeStamp(new Date());
			this.gameSave.setPosition(this.gameSave.getCursor().getPosition());
			
			var clone=new SC.GameSave();
			clone.fromJSON(JSON.parse(JSON.stringify(this.gameSave)));
			var cursor=clone.getCursor();
			var _self=this;
			cursor.urls=cursor.urls.map(function(u){return u ? u.slice(u.lastIndexOf("/")+1) : u});
			
			return clone;
		},
		_changeMap:function(name,position)
		{
			this.map.setPaused(true);
			return SC.rj(this.mapBaseUrl+name+".json",this).then(function changeMap_loaded(json)
			{
				var todo=json.cursors.concat(json.images);
				while(todo.length>0)
				{
					var image=todo.shift();
					image.url=this.imageBaseUrl+image.url;
				}
				json.position=position;
				var animation=this.map.movingCursors.get(this.gameSave.getCursor());
				this.map.fromJSON(json);
				this.gameSave.getCursor().setPosition(position);
				this.map.add(this.gameSave.getCursor());
				if(animation)
				{
					this.map.movingCursors.set(this.gameSave.getCursor(),animation);
				}
				this.map.setPaused(false);
				this.gameSave.setMap(name);
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
			if(this.gameSave.getCursor().direction)
			{
				this.gameSave.getCursor().direction.set(0);
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
				if(a.condition&&!this.resolveContidion(a.condition))
				{
					continue;
				}
				var activeQuests=this.gameSave.getQuests();
				var questIndex=null;
				var quest=null;
				switch (a.type) 
				{
					case "ABORT_QUEST":
						if((questIndex=activeQuests.indexOf(a.questName))!==-1) quest=this.quests.get(a.questName);
						if(quest)
						{
							activeQuests.splice(questIndex,1);
							this.fire("quest-abort",{value:quest});
						}
						break;
					case "RESOLVE_QUEST":
						if((questIndex=activeQuests.indexOf(a.questName))!==-1) quest=this.quests.get(a.questName);
						if(quest)
						{
							activeQuests.splice(questIndex,1);
							this.fire("quest-complete",{value:quest});
							actions=actions.concat(quest.resolve);
						}
						break;
					case "ACTIVATE_QUEST":
						quest=this.quests.get(a.questName);
						if(quest&&activeQuests.indexOf(a.questName)===-1)
						{
							activeQuests.push(a.questName);
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
						this.fire("execute",{action:a});
						break;
				}
			}
			return null;
		},
		resolveContidion:function(conditionString)
		{
			var rtn=false;
			var conditions=conditionString.split("||");
			for(var c=0;c<conditions.length&&!rtn;c++)
			{
				var aspectResult=true;
				var aspects=conditions[c].split("&");
				for(var a=0;a<aspects.length&&aspectResult;a++)
				{
					var terms=aspects[a].match(/(!?\w+)\s*:\s*([\w\s]*\w)/);
					if(terms)
					{
						var negative=false;
						if(terms[1][0]==="!")
						{
							negative=true;
							terms[1]=terms[1].slice(1);
						}
						switch(terms[1])
						{
							case "quest":
								var hasQuest=this.gameSave.getQuests().indexOf(terms[2])!==-1;
								aspectResult=hasQuest&&!negative||!hasQuest&&negative;
								break;
							case "item":
								break;
							case "quest_item":
								break;
							default:
								SC.debug.error("unknown term: "+aspects[a]);
								aspectResult=false;
								break;
						}
					}
					else
					{
						SC.debug.error("invalid term: "+aspects[a]);
						return false;
					}
				}
				rtn=aspectResult;
			}
			return rtn;
		}
    });
	RPGPlayer.saveConverter=function(save,index)
	{
		if(!save)
			return [index,"EMPTY","&nbsp;"];
		try
		{
			return [index,save.getTimeStamp().toLocaleString(),save.getMap()];
		}
		catch(error)
		{
			SC.debug([error,save],SC.debug.LEVEL.ERROR);
			return [index,"CORRUPT DATA","&nbsp;"];
		}
	};
	SMOD("RPGPlayer",RPGPlayer);

	RPGPlayer.Quest=µ.Class({
		init:function(param)
		{
			param=param||{};
			
			this.description=param.description||"NO DESCRIPTION!";
			this.tasks=param.tasks||null;
			this.resolve=param.resolve||[];
		},
		tasksCompleted:function(tasks)
		{//TODO
			return true;
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
		},
		toJSON:function(){return this.name}
	});
	SMOD("RPGPlayer.Quest",RPGPlayer.Quest);
})(Morgas,Morgas.setModule,Morgas.getModule);