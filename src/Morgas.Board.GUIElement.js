(function(µ,SMOD,GMOD){

	var BOARD=GMOD("Board"),
	LST=GMOD("Listeners");
	
	SC=GMOD("shortcut")({
		rescope:"rescope"
	});
	
	var GE=BOARD.GUIElement=µ.Class(LST,{
		init:function(Layer,domElement)
		{
			this.onBoard=SC.rescope(this.onBoard);
			SC.rescope(["onAxis","onButton"],this);
			
			this.layer=null;
			this.setLayer(layer);
			
			this.domElement=domElement||document.createElement("div");
			this.domElement.classList.add("GUIElement");
			this.domElement.style.position="absolute";
		},
		setLayer:function(layer)
		{
			if(layer)
			{
				this.layer=layer;
				this.layer.addListener("axisChanged",this.onAxis);
				this.layer.addListener("buttonChanged",this.onButton);
				this.layer.addListener(".board",this.onBoard);
				return true;
			}
			else
			{
				this.removeLayer();
				return false;
			}
		},
		removeLayer:function()
		{
			this.layer.removeListener(".board",this.onBoard);
			this.layer.removeListener("axisChanged",this.onAxis);
			this.layer.removeListener("buttonChanged",this.onButton);
			this.layer=null;
		},
		onBoard:function(type,board)
		{
			if(board)
			{
				board.domElement.appendChild(this.domElement)
			}
			else
			{
				this.domElement.remove();
			}
		},
		onAxis:function(type,player,index,axis)
		{
			
		},
		onButton:function(type,player,index,value)
		{
			
		},
	});
	
	SMOD("GUIElement");
	
})(Morgas,Morgas.setModule,Morgas.getModule)