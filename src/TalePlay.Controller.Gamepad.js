(function(µ,SMOD,GMOD){

	var CTRL=GMOD("Controller");

	var SC=GMOD("shortcut")({
		rs:"rescope"
	});
	
	var GP=CTRL.Gamepad=µ.Class(CTRL,{
		init:function(gamepad,map)
		{
			this.superInit(CTRL,map);
			SC.rs.all(["update"],this);
			
			this.gamepad=gamepad;
			this.pollKey=null;
			
			this.addListener(".created:once",this,"update");
		},
		update:function()
		{
			this.set(this.gamepad.buttons.map(function(b){return b.value}),this.gamepad.axes);
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