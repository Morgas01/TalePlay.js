(function(µ,SMOD,GMOD){
	
	var GUI=GMOD("GUIElement"),
	
	SC=GMOD("shortcut")({
		MENU:"Menu"
	});
	
	var MENU=GUI.Menu=µ.Class(GUI,{
		init:function(layer,param)
		{
			this.superInit(GUI,layer);
			this.domElement.classList.add("Menu");
			
			this.createListener("activeChanged selected")
			
			param=param||{};
			this.menu=new SC.MENU(param);

			this.type=param.type||;
			this.axes=param.axes||[];
			this.buttons=param.buttons||[];
			
			this.lastdirection4=0;
		},
		onAxis:function(type,player,index,axis)
		{
			if(this.axes.length===0||this.axes.indexOf(index)!==-1)
			{
				var direction=axis.getDirection4();
				if(direction!==this.lastdirection4&&direction!==0)
				{
					if(this.type===MENU.Types.VERTICAL&&direction===1||
					   this.type===MENU.Types.HORIZONTAL&&direction===4)
					{
						this.menu.activeUp();
					}
					else if (this.type===MENU.Types.VERTICAL&&direction===3||
							   this.type===MENU.Types.HORIZONTAL&&direction===2)
					{
						this.menu.activeDown();
					}
				}
				this.lastdirection4=direction;
				this.fire("activeChanged")
			}
		},
		onButton:function(type,player,index,value)
		{
			
		},
		
	});
	MENU.Types={
		VERTICAL:1,
		HORIZONTAL:2,
		GRID:3//TODO
	};
	
})(Morgas,Morgas.setModule,Morgas.getModule);