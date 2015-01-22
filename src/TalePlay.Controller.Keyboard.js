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
				if(this.mapping.hasButtonMapping(event.code||event.key)||this.mapping.hasButtonAxisMapping(event.code||event.key))
				{
					event.preventDefault();
					event.stopPropagation();
					
					let map={};
					map[event.code||event.key]=value;
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
			"1": "2",
			"2": "3",
			"3": "4",
			"4": "5",
			"5": "6",
			"6": "7",
			" ": "0",
			"Shift": "1",
			"Pause": "8",
			"Enter": "9"
		},
		"buttonAxis": {
			"w": "1",
			"d": "0",
			"s": "-1",
			"a": "-0",
			"Up": "3",
			"Right": "2",
			"Down": "-3",
			"Left": "-2"
		},
		"axes": {}
	};
	SMOD("Controller.Keyboard",CTRL.Keyboard)

})(Morgas,Morgas.setModule,Morgas.getModule);