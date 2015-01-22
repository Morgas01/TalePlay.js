(function(µ,SMOD,GMOD){
	
	let CTRL=GMOD("Controller");
	let DBObj=GMOD("DBObj");
	
	let SC=GMOD("shortcut")({
		DBField:"DBField"
	});
	
	let MAPPING=CTRL.Mapping=µ.Class(DBObj,{
		objectType:"ControllerMapping",
		init:function(param)
		{
			param=param||{};
			this.superInit(DBObj,param);
			
			this.addField("name",SC.DBField.TYPES.STRING,param.name||"");
			this.addField("type",SC.DBField.TYPES.STRING,param.type||"");
			
			let data={
					buttons:{},
					buttonAxis:{},
					axes:{}
			};
			if(param.data)
			{
				data.buttons=param.data.buttons||data.buttons;
				data.buttonAxis=param.data.buttonAxis||data.buttonAxis;
				data.axes=param.data.axes||data.axes;
			}
			this.addField("data",SC.DBField.TYPES.JSON,  data);
		},
		setMapping:function(type,from,to)
		{
			let mapping=this.getValueOf("data")[type];
			if(mapping)
			{
				if(to===undefined||to===null)
				{
					delete mapping[from];
				}
				else
				{
					mapping[from]=to;
				}
			}
		},
		getMapping:function(type,from)
		{
			return this.getValueOf("data")[type][from];
		},
		removeMapping:function(type,from)
		{
			this.setMapping(type, from);
		},
		hasMapping:function(type,from)
		{
			let mapping=this.getValueOf("data")[type];
			if(mapping)
			{
				return from in mapping;
			}
			return false;
		},
		setMappingAll:function(type,map)
		{
			for(let i in map)
			{
				this.setMapping(type, i, map[i]);
			}
		},

		setButtonMapping:function(from,to){this.setMapping("buttons", from, to);},
		getButtonMapping:function(from)
		{
			let to=this.getMapping("buttons", from);
			if(to===undefined)
				to=from;
			return to;
		},
		removeButtonMapping:function(from){this.removeMapping("buttons", from)},
		hasButtonMapping:function(from){return this.hasMapping("buttons", from)},

		setButtonAxisMapping:function(from,to){this.setMapping("buttonAxis", from, to);},
		getButtonAxisMapping:function(from){return this.getMapping("buttonAxis", from)},
		removeButtonAxisMapping:function(from){this.removeMapping("buttonAxis", from)},
		hasButtonAxisMapping:function(from){return this.hasMapping("buttonAxis", from)},

		setAxisMapping:function(from,to){this.setMapping("axes", from, to);},
		getAxisMapping:function(from)
		{
			let to=this.getMapping("axes", from);
			if(to===undefined)
				to=from;
			return to;
		},
		removeAxisMapping:function(from){this.removeMapping("axes", from)},
		hasAxisMapping:function(from){return this.hasMapping("axes", from)},
		
		convertAxisValue:function(index,value){return Math.sign(1/index)*value;},
		
		getReverseMapping:function()
		{
			let mapping=this.getValueOf("data");
			let reverse={
				buttons:{},
				buttonAxis:{},
				axes:{}
			};
			for(let type in mapping)
			{
				for(let i in mapping[type])
				{
					let index=mapping[type][i];
					if(type==="axes"&&1/index<0)
					{
						index=-index;
						i="-"+i;
					}
					else if(index===0&&1/index<0)
					{
						index="-0";
					}
					reverse[type][index]=i;
				}
			}
			return reverse;
		}
		
	});
	SMOD("Controller.Mapping",MAPPING);
})(Morgas,Morgas.setModule,Morgas.getModule);