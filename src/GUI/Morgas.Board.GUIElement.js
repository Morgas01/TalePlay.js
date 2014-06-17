(function(µ,SMOD,GMOD){

	var BOARD=GMOD("Board"),
	LST=GMOD("Listeners"),
	NODE=GMOD("NodePatch");
	
	var GE=BOARD.GUIElement=µ.Class(LST,{
		init:function(styleClass)
		{
			this.superInit(LST);
			new NODE(this,{
				parent:"layer"
			})
			//this.layer=null;

			this.domElement=document.createElement("div");
			this.domElement.classList.add("GUIElement");
			
			if (styleClass)
			{
				this.addStyleClass(styleClass);
			}
		},
		addStyleClass:function(styleClass)
		{
			this.domElement.classList.add(styleClass);
		},
		onAnalogStick:function(event)
		{
			
		},
		onButton:function(event)
		{
			
		},
		destroy:function()
		{
			if(this.layer)
			{
				this.layer.remove(this);
			}
			this.domElement.remove();
		}
	});
	
	SMOD("GUIElement",GE);
	
})(Morgas,Morgas.setModule,Morgas.getModule)