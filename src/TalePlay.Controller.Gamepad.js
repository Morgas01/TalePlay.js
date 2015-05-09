(function(µ,SMOD,GMOD){

	var CTRL=GMOD("Controller");

	var SC=GMOD("shortcut")({
		rs:"rescope"
	});
	
	var GP=CTRL.Gamepad=µ.Class(CTRL,{
		init:function(gamepad,map,precision)
		{
			this.mega(map);
			SC.rs.all(this,["update"]);
			
			this.gamepad=gamepad;
			this.gamepadIndex=gamepad.index;
			this.precision=precision||1;
			this.pollKey=null;
			
			this.addListener(".created:once",this,"update");
		},
		update:function()
		{
			this.gamepad=navigator.getGamepads()[this.gamepadIndex];
			if(this.gamepad.connected)
			{
				this.set(this.gamepad.buttons.map(function(b){return b.value}),this.gamepad.axes.map(function(a){return a.toFixed(this.precision)*1}));
			}
			this.pollKey=requestAnimationFrame(this.update);
		},
		toJSON:function()
		{
			var json=CTRL.prototype.toJSON.call(this);
			json.gpIndex=this.gpIndex;
			return json;
		},
		setDisabled:function(disabled)
		{
			this.mega(disabled);
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
	SMOD("Controller.Gamepad",GP);
})(Morgas,Morgas.setModule,Morgas.getModule);