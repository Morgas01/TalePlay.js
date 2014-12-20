(function(µ,SMOD,GMOD){
	
	var Layer=GMOD("Layer");

	var SC=µ.getModule("shortcut")({
		det:"Detached",
		Map:"GUI.Map",
		rj:"Request.json",
		rs:"rescope",
		it:"iterate",
		aLst:"attachListeners",
		debug:"debug"
	});

    var RPGPlayer=Layer.RPGPlayer=µ.Class(Layer,{
        init:function(param)
        {
            param=param||{};
            this.superInit(Layer,param);
			this.domElement.classList.add("RPGPlayer");
			
			SC.aLst(this);
			this.createListener("ready quest-activate quest-complete quest-abort");
			
			this.baseUrl=param.baseUrl||"";
			this.imageBaseUrl=param.imageBaseUrl||"";
            this.cursor=new SC.Map.Cursor(
        		param.cursor.url,
        		0,
        		param.cursor.size,
        		param.cursor.offset,
        		param.cursor.name,
        		param.cursor.colision!==false,
        		null,
        		param.cursor.speed
        	);

            this.quests=new Map();
			this.activeQuests=new Map();
            var questsReady=SC.rj(this.baseUrl+"quests.json").then(SC.rs(function quests_loaded(quests)
            {
            	for(var i=0;i<quests.length;i++)
            	{
            		var quest=new RPGPlayer.Quest(quests[i]);
            		this.quests.set(quest.name,quest);
            		if(param.quests&&param.quests.indexOf(quests[i].name)!==-1)
            		{
            			quest=quest.clone();
            			this.activeQuests.set(quest.name,quest);
            		}
            	}
            	return null;
            },this),function quest_load_error(error)
            {
				SC.debug(["Could not load Quests: ",error],0);
            });
			
			this.map=new SC.Map();
			this.add(this.map);
			this.map.addListener("trigger",this,this._onTrigger);

			var mapReady=this._changeMap(param.map,param.position);
			new SC.det([this,questsReady,mapReady]).then(function(scope) {
				scope.fire("ready");
			});
        },
		_changeMap:function(url,position)
		{
			return SC.rj(this.baseUrl+url).then(SC.rs(function changeMap_loaded(json)
			{
				var todo=json.cursors.concat(json.images);
				while(todo.length>0)
				{
					var image=todo.shift();
					image.url=this.imageBaseUrl+image.url;
				}
				json.position=position;
				this.map.fromJSON(json);
				this.cursor.setPosition(position);
				this.map.add(this.cursor);
            	return null;
			},this),
			function changeMap_Error(error)
			{
				SC.debug(["Could not load Map: ",url,error],0);
			});
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