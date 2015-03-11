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
			
			this.mega(param);
			
			this.addField("map",		SC.field.TYPES.String,param.map);
			this.addField("position",	SC.field.TYPES.JSON,param.position);
			this.addField("cursor",		SC.field.TYPES.JSON,param.cursor);
			this.addField("quests",		SC.field.TYPES.JSON,param.quests||[]);
			this.addField("actions",	SC.field.TYPES.JSON,param.actions||[]);
			this.addField("info",		SC.field.TYPES.String,param.info);
			this.addField("timeStamp",	SC.field.TYPES.DATE,param.timeStamp||new Date());
			this.addField("customData",	SC.field.TYPES.JSON,param.customData||{});
		},
		getMap:			function(){return this.getValueOf("map");},
		setMap:			function(v){return this.setValueOf("map",v);},
		getPosition:	function(){return this.getValueOf("position");},
		setPosition:	function(v){return this.setValueOf("position",v);},
		getCursor:		function(){return this.getValueOf("cursor");},
		setCursor:		function(v){return this.setValueOf("cursor",v);},
		getQuests:		function(){return this.getValueOf("quests");},
		setQuests:		function(v){return this.setValueOf("quests",v);},
		getActions:		function(){return this.getValueOf("actions");},
		setActions:		function(v){return this.setValueOf("actions",v);},
		getInfo:		function(){return this.getValueOf("info");},
		setInfo:		function(v){return this.setValueOf("info",v);},
		getTimeStamp:	function(){return this.getValueOf("timeStamp");},
		setTimeStamp:	function(v){return this.setValueOf("timeStamp",v);},
		getCustomData:	function(){return this.getValueOf("customData");},
		setCustomData:	function(v){return this.setValueOf("customData",v);}
	});
	SMOD("RPGPlayer.GameSave",GSAVE);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);