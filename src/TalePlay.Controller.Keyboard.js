(function(µ,SMOD,GMOD){

	var CTRL=GMOD("Controller");
	
	var SC=µ.shortcut({
		rescope:"rescope"
	});
	
	CTRL.Keyboard=µ.Class(CTRL,{
		init:function(mapping,mappingName,domElement)
		{
			this.mega(mapping!==undefined ? mapping : CTRL.Keyboard.stdMapping,mappingName);
			
			SC.rescope.all(this,["onKeyDown","onKeyUp"]);
			
			this.domElement=null;
			this.setDomElement(domElement||window)
		},
		setMapping:function(mapping)
		{
			this.mega(mapping);
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
				if(this.mapping.hasButtonMapping(event.code)||this.mapping.hasButtonAxisMapping(event.code))
				{
					event.preventDefault();
					event.stopPropagation();
					
					var map={};
					map[event.code]=value;
					this.setButton(map);
				}
			}
		},
		destroy:function()
		{
			this.setDomElement();
			this.mega();
		}
	});
	CTRL.Keyboard.stdMapping={
		"buttons": {
			"Space": "0",
			"ShiftLeft": "1",
			"Numpad1": "2",
			"Numpad2": "3",
			"Numpad3": "4",
			"Numpad4": "5",
			"Numpad5": "6",
			"Numpad6": "7",
			"Pause": "8",
			"Enter": "9"
		},
		"buttonAxis": {
			"KeyW": "1",
			"KeyD": "0",
			"KeyS": "-1",
			"KeyA": "-0",
			"ArrowUp": "3",
			"ArrowRight": "2",
			"ArrowDown": "-3",
			"ArrowLeft": "-2"
		},
		"axes": {}
	};
	SMOD("Controller.Keyboard",CTRL.Keyboard)

})(Morgas,Morgas.setModule,Morgas.getModule);