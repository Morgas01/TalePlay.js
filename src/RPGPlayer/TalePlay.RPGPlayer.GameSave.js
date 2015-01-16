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
			
			this.addField("data",SC.field.TYPES.JSON,param.data);
			this.addField("timeStamp",SC.field.TYPES.DATE,param.timeStamp||new Date());
		},
		getData:function(){return this.getValueOf("data");},
		setData:function(d){return this.setValueOf("data",d);},
		getTimeStamp:function(){return this.getValueOf("timeStamp");},
		setTimeStamp:function(t){return this.setValueOf("timeStamp",t);},
	});
	SMOD("RPGPlayer.GameSave",GSAVE);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);