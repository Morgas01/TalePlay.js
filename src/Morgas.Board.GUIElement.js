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
		onAxis:function(type,player,index,axis)
		{
			
		},
		onButton:function(type,player,index,value)
		{
			
		},
	});
	
	SMOD("GUIElement",GE);
	
})(Morgas,Morgas.setModule,Morgas.getModule)