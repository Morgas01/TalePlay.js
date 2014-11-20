(function(µ,SMOD,GMOD){

    var TALE=window.TalePlay=window.TalePlay||{};

	var LST=GMOD("Listeners");
	var SC=GMOD("shortcut")({
        node:"NodePatch"
    });
	
	var GE=TALE.GUIElement=µ.Class(LST,{
		init:function(styleClass)
		{
			this.superInit(LST);
			this.nodePatch=new SC.node(this,{
				parent:"layer"
			});
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
			if(Array.isArray(styleClass))
			{
				list.add.apply(list,styleClass);
			}
			else
			{
				list.add(styleClass);
			}
		},
		removeStyleClass:function(styleClass)
		{
			var list=this.domElement.classList;
			if(Array.isArray(styleClass))
			{
				list.remove.apply(list,styleClass);
			}
			else
			{
				list.remove(styleClass);
			}
		},
		onAnalogStick:function(event)
		{
			//overwrite when needed
		},
		onButton:function(event)
		{
			//overwrite when needed
		},
		destroy:function()
		{
			this.nodePatch.remove();
		}
	});
	
	SMOD("GUIElement",GE);
	
})(Morgas,Morgas.setModule,Morgas.getModule);