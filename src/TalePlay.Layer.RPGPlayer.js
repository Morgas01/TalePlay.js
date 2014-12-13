(function(µ,SMOD,GMOD){
	
	var Layer=GMOD("Layer");

	var SC=µ.getModule("shortcut")({
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
			this.createListener("quest-complete");
			
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
			if(param.quests)
			{
				this.addQuests(param.quests);
			}
			
			this.map=new SC.Map();
			this.add(this.map);
			this.map.addListener("trigger",this,this._onTrigger);

			this.changeMap(param.map,param.position);
        },
		addQuests:function(quests)
		{
			if(quests instanceof RPGPlayer.Quest)
			{//single
				this.addQuest(quests);
			}
			else
			{//multiple
				SC.it(quests,this.addQuest,false,false,this);
			}
		},
		addQuest:function(quest)
		{
			this.quests.set(quest.name,quest);
		},
		changeMap:function(url,position)
		{
			SC.rj(this.baseUrl+url).then(SC.rs(function changeMap_loaded(json)
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
			},this),
			function changeMap_Error(error)
			{
				SC.debug(["Could nor load Map: ",url,error],0);
			})
		},
		_onTrigger:function(e)
		{
			var action=e.value;
			switch(action.type)
			{
				case "RESOLVE_QUEST":
					var quest=this.quests.get(action.questName);
					if(quest)
					{
						this.quests["delete"](action.questName);
						this.fire("quest-complete",{value:quest});
					}
				break;
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
		}
	});
	SMOD("Quest",RPGPlayer.Quest);
})(Morgas,Morgas.setModule,Morgas.getModule);