(function(µ,SMOD,GMOD){

	var GUI=GMOD("GUIElement"),
	
	SC=GMOD("shortcut")({
		MAP:"Map",
		rescope:"rescope",
		proxy:"proxy"
	});
	
	GUI.Map=µ.Class(GUI,{
		init:function(param)
		{
			param=param||{};
			
			this.superInit(GUI,param.styleClass)
			this.map=new SC.Map({
				domElement:this.domElement,
				items:param.items,
				position:param.position
			});
			SC.proxy("map",{
				add:"addImages",
				setPosition:"setPosition",
				move:"move",
				update:"update",
				getImages:"getImages",
				getSize:"getSize"
			},this);
			this.cursor=param.cursor||null;
			this.offset=param.offset||null;
			this.threshold=param.threshold||null;
		}
	});
	
})(Morgas,Morgas.setModule,Morgas.getModule);