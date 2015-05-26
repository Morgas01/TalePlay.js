(function(µ,SMOD,GMOD,HMOD){

    var TALE=this.TalePlay=this.TalePlay||{};
	
	TALE.Attribues=µ.Class({
		init:function(param)
		{
			this.mega();
			this.fromJSON(param);
		},
		fromJSON:function(json)
		{
			this.attr={};
			this.add(json);
		},
		add:function(param)
		{
			if(param instanceof TALE.Attribues)
			{
				param=param.attr;
			}
			for(var i in param)
			{
				if(!(i in this.attr))
				{
					this.attr[i]=0;
				}
				var val=parseFloat(param[i]);
				if(val)
				{
					this.attr[i]+=val;
				}
			}
			return this;
		},
		clone:function()
		{
			return new TALE.Attribues(this);
		},
		get:function(key)
		{
			if(key in this.attr)return this.attr[key];
			return 0;
		},
		toJSON:function()
		{
			return this.attr;
		}
	});
	SMOD("Attribues",TALE.Attribues);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);