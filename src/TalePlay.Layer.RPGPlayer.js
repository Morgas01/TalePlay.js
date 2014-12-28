(function(µ,SMOD,GMOD){
	
	var Layer=GMOD("Layer");

	var SC=µ.getModule("shortcut")({
		det:"Detached",
		Map:"GUI.Map",
		Dialog:"GUI.Dialog",
		rj:"Request.json",
		it:"iterate",
		aLst:"attachListeners",
		debug:"debug"
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
	}

    var RPGPlayer=Layer.RPGPlayer=µ.Class(Layer,{
        init:function(param)
        {
            param=param||{};
            this.superInit(Layer,param);
			this.domElement.classList.add("RPGPlayer");
			
			SC.aLst(this);
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
			this.map=new SC.Map();
			this.map.addListener("trigger",this,this._onTrigger);
			
			var startMenu=new (GMOD(param.startMenu||"StartMenu"))(this,param);
			startMenu.addListener("start:once",this,function(event)
			{
				event.source.destroy();
				this.add(this.focused=this.map);
				this.loadSave(event.save);
			});
			this.add(this.focused=startMenu);
        },
		onController:function(event)
		{
			if(this.focused)
			{
				this.focused[Layer._CONTROLLER_EVENT_MAP[event.type]](event);
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
            		if(self.quests.has(save.quests[i].name))
            		{
            			quest=self.quests.get(save.quests[i].name).clone();
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
				var a=actions[i]
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
					case "EXECUTE":
						try{
							a.value(this);
						}catch(e){µ.debug(["doAction Error: ",a,e],0);}
						break;
				}
			}
		}
    });
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
	SMOD("Quest",RPGPlayer.Quest);
})(Morgas,Morgas.setModule,Morgas.getModule);