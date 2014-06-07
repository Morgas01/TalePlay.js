(function(µ,SMOD,GMOD){

	var SC=µ.shortcut({
		rescope:"rescope"
	});

	var CTRL=GMOD("Controller");
	
	var GP=CTRL.Gamepad=µ.Class(CTRL,{
		init:function(gamepad,map,pollDelay)
		{
			this.gamepad=gamepad;
			
			this.superInit(CTRL,map);
			
			SC.rescope.all(["update"],this)
			
			this.pollDelay=pollDelay||GP.pollDelay;
			this.pollKey=null;
			
			this.addListener(".created",this.update);
		},
		update:function()
		{
			this.set(this.gamepad.buttons.map(function(b){return b.value;}),this.gamepad.axes);
			this.pollKey=requestAnimationFrame(this.update,this.pollDelay);
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
				cancelAnimationFrame(this.pollKey);
			}
			else
			{
				this.update();
			}
		}
	});
	GP.pollDelay=50;
})(Morgas,Morgas.setModule,Morgas.getModule);