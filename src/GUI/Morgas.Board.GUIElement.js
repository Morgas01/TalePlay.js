(function(µ,SMOD,GMOD){

	var BOARD=GMOD("Board"),
	LST=GMOD("Listeners");
	
	var GE=BOARD.GUIElement=µ.Class(LST,{
		init:function()
		{
			this.superInit(LST);
			
			this.layer=null;

			this.domElement=document.createElement("div");
			this.domElement.classList.add("GUIElement");
		},
		setLayer:function(layer)
		{
			this.layer=layer;
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