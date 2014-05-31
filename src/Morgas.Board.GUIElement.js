(function(µ,SMOD,GMOD){

	var BOARD=GMOD("Board"),
	LST=GMOD("Listeners");
	
	var GE=BOARD.GUIElement=µ.Class(LST,{
		init:function()
		{
			this.superInit(LST);

			this.domElement=document.createElement("div");
			this.domElement.classList.add("GUIElement");
		},
		onAnalogStick:function(event)
		{
			
		},
		onButton:function(event)
		{
			
		},
		destroy:function()
		{
			this.domElement.remove();
		}
	});
	
	SMOD("GUIElement",GE);
	
})(Morgas,Morgas.setModule,Morgas.getModule)