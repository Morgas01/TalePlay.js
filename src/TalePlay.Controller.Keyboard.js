(function(µ,SMOD,GMOD){

	let CTRL=GMOD("Controller");
	
	let SC=µ.shortcut({
		rescope:"rescope"
	});
	
	CTRL.Keyboard=µ.Class(CTRL,{
		init:function(mapping,mappingName,domElement)
		{
			this.superInit(CTRL,mapping!==undefined ? mapping : CTRL.Keyboard.stdMapping,mappingName);
			
			SC.rescope.all(["onKeyDown","onKeyUp"],this);
			
			this.domElement=null;
			this.setDomElement(domElement||window)
		},
		setMapping:function(mapping)
		{
			CTRL.prototype.setMapping.call(this, mapping);
			if(this.mapping)
			{
				this.mapping.setValueOf("type","Keyboard");
			}
		},
		setDomElement:function(domElement)
		{
			if(this.domElement)
			{
				this.domElement.removeEventListener("keydown", this.onKeyDown, false);
				this.domElement.removeEventListener("keyup", this.onKeyUp, false);
				this.domElement=null;
			}
			if(domElement)
			{
				this.domElement=domElement;
				domElement.addEventListener("keydown", this.onKeyDown, false);
				domElement.addEventListener("keyup", this.onKeyUp, false);
			}
		},
		onKeyDown:function(event)
		{
			this.onKey(event,1);
		},
		onKeyUp:function(event)
		{
			this.onKey(event,0);
		},
		onKey:function(event,value)
		{
			if(!this.disabled&&this.mapping)
			{
				if(this.mapping.hasButtonMapping(event.code||event.key||event.keyCode)||this.mapping.hasButtonAxisMapping(event.code||event.key||event.keyCode))
				{
					event.preventDefault();
					event.stopPropagation();
					
<<<<<<< HEAD
					var map={};
					map[event.code||event.key||event.keyCode]=value;
=======
					let map={};
					map[event.code||event.key]=value;
>>>>>>> master
					this.setButton(map);
				}
			}
		},
		destroy:function()
		{
			this.setDomElement();
			CTRL.prototype.destroy.call(this);
		}
	});
	CTRL.Keyboard.stdMapping={
		"buttons": {
			"13": "9",
			"16": "1",
			"19": "8",
			"32": "0",
			"97": "2",
			"98": "3",
			"99": "4",
			"100": "5",
			"101": "6",
			"102": "7"
		},
		"buttonAxis": {
			"37": "-2",
			"38": "3",
			"39": "2",
			"40": "-3",
			"65": "-0",
			"68": "0",
			"83": "-1",
			"87": "1"
		},
		"axes": {}
	};
	SMOD("Controller.Keyboard",CTRL.Keyboard)

})(Morgas,Morgas.setModule,Morgas.getModule);