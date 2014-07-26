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
			this.addStyleClass("GUIElement");
			
			if (styleClass)
			{
				this.addStyleClass(styleClass);
			}
		},
		addStyleClass:function(styleClass)
		{
			var list=this.domElement.classList;
			if(!Array.isArray(styleClass))
			{
				list.add.apply(list,arguments);
			}
			else
			{
				list.add(styleClass);
			}
		},
		removeStyleClass:function(styleClass)
		{
			var list=this.domElement.classList;
			if(!Array.isArray(styleClass))
			{
				list.remove.apply(list,arguments);
			}
			else
			{
				list.remove(styleClass);
			}
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