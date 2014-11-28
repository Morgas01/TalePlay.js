(function(µ,SMOD,GMOD){
	
	var Layer=GMOD("Layer");

	var SC=µ.getModule("shortcut")({
		Map:"GUI.Map",
		rj:"request.json",
		it:"iterate",
		debug:"debug"
	});

    var RPGPlayer=Layer.RPGPlayer= µ.Class(Layer,{
        init:function(param)
        {
            param=param||{};
            this.superInit(Layer,param);

			this.quests=new Map();
			if(param.quests)
			{
				this.addQuests(param.quests);
			}
			this.map=new SC.Map();

			this.changeMap(param.map,param.pos);
        },
		addQuests:function(quests)
		{
			if(quests instanceof RPGPlayer.Quest)
			{//signle
				this.addQuest(quests);
			}
			else
			{//multiple
				SC.it(quests,function(q)
				{
					this.q.set(q.name,q);
				},false,false,this);
			}
		},
		changeMap:function(url,position)
		{
			SC.rj(this.baseUrl+url).then(function changeMap_loaded(json)
			{
				//TODO
			},
			function changeMap_Error(error)
			{
				SC.debug(["Could nor load Map: ",url,error],0);
			})
		}
    });
	SMOD("RPGPlayer",RPGPlayer);

	RPGPlayer.Quest=µ.Class({
		init:function(param)
		{
			param=param||{};

			this.name=param.name||"NO NAME!";
			this.description=param.description||"NO DESCRIPTION!";

			this.trigger=param.trigger||null;
		}
	});
	SMOD("Quest",RPGPlayer.Quest);
})(Morgas,Morgas.setModule,Morgas.getModule);