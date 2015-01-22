(function(µ,SMOD,GMOD,HMOD){
	
	var PLAYER=GMOD("RPGPlayer");
	var DBOBJ=GMOD("DBObj");
	
	var SC=GMOD("shortcut")({
		field:"DBField"
	});
	
	var GSAVE=PLAYER.GameSave=µ.Class(DBOBJ,{
		objectType:"GameSave",
		init:function(param)
		{
			param=param||{};
			
			this.superInit(DBOBJ,param);
			
			this.addField("map",		SC.field.TYPES.String,param.map);
			this.addField("position",	SC.field.TYPES.JSON,param.position);
			this.addField("cursor",		SC.field.TYPES.JSON,param.cursor);
			this.addField("quests",		SC.field.TYPES.JSON,param.quests);
			this.addField("actions",	SC.field.TYPES.JSON,param.actions);
			this.addField("info",		SC.field.TYPES.String,param.info);
			this.addField("timeStamp",	SC.field.TYPES.DATE,param.timeStamp||new Date());
		},
		getMap:			function(){return this.getValueOf("map");},
		getPosition:	function(){return this.getValueOf("position");},
		getCursor:		function(){return this.getValueOf("cursor");},
		getQuests:		function(){return this.getValueOf("quests");},
		getActions:		function(){return this.getValueOf("actions");},
		getInfo:		function(){return this.getValueOf("info");},
		getTimeStamp:	function(){return this.getValueOf("timeStamp");}
	});
	SMOD("RPGPlayer.GameSave",GSAVE);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);