(function(µ,SMOD,GMOD){

	var SC=µ.shortcut({
		rescope:"rescope"
	});

	var CTRL=GMOD("Controller");
	
	var GP=CTRL.Gamepad=µ.Class(CTRL,{
		init:function(gamepad,map,pollDelay)
		{
			this.gamepad=gamepad;
			
			this.superInit(CTRL,this.gamepad.buttons.length,this.gamepad.axes.length>>>1);
			
			SC.rescope.all(["update"],this)
			
			this.pollDelay=pollDelay||GP.pollDelay;
			this.pollKey=null;

			this.map=map||{};
			this.map.buttons=this.map.buttons||{};
			this.map.axes=this.map.axes||{};
			
			this.addListener(".created",this.update);
		},
		update:function()
		{
			this.set(this.gamepad.buttons.map(function(b){return b.value;}),this.gamepad.axes);
			this.pollKey=setTimeout(this.update,this.pollDelay);
		},
		toJSON:function()
		{
			var json=CTRL.prototype.toJSON.call(this);
			json.gpIndex=this.gpIndex;
			return json;
		},
		setDisabled:function(disabled)
		{
			CTRL.prototype.setDisabled.call(this,disabled);
			if(this.disabled)
			{
				clearTimeout(this.pollKey);
			}
			else
			{
				this.update();
			}
		}
	});
	GP.pollDelay=50;
})(Morgas,Morgas.setModule,Morgas.getModule);