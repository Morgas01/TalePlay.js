(function(µ,SMOD,GMOD){

	let CTRL=GMOD("Controller");

	let SC=GMOD("shortcut")({
		rs:"rescope"
	});
	
	let GP=CTRL.Gamepad=µ.Class(CTRL,{
		init:function(gamepad,map,precision)
		{
			this.superInit(CTRL,map);
			SC.rs.all(["update"],this);
			
			this.gamepad=gamepad;
			this.precision=precision||1;
			this.pollKey=null;
			
			this.addListener(".created:once",this,"update");
		},
		update:function()
		{
			if(!this.gamepad.connected)
			{
				let gamepads=navigator.getGamepads();
				if(gamepads[this.gamepad.index])
				{
					this.gamepad=gamepads[this.gamepad.index];
				}
			}
			if(this.gamepad.connected)
			{
				this.set(this.gamepad.buttons.map(function(b){return b.value}),this.gamepad.axes.map(function(a){return a.toFixed(this.precision)*1}));
			}
			this.pollKey=requestAnimationFrame(this.update);
		},
		toJSON:function()
		{
			let json=CTRL.prototype.toJSON.call(this);
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
	SMOD("Controller.Gamepad",GP);
})(Morgas,Morgas.setModule,Morgas.getModule);