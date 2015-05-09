(function(µ,SMOD,GMOD){

    var TALE=this.TalePlay=this.TalePlay||{};

	var LST=GMOD("Listeners");
	var SC=GMOD("shortcut")({
		sc:"shortcut",
        node:"NodePatch",
        Layer:"Layer"
    });
	
	var GE=TALE.GUIElement=µ.Class(LST,{
		init:function(param)
		{
			param=param||{};
			this.mega();
			this.nodePatch=new SC.node(this,{
		        parent:"parent",
		        children:"children",
		        addChild:"addChild",
		        removeChild:"removeChild"
			},true);
			
			SC.sc({layer:function(node)
			{
				var layer=node.parent;
				while(layer&&!(layer instanceof SC.Layer))
				{
					layer=layer.parent
				}
				return layer;
			}},this,this.nodePatch,true);
			//this.layer=null;

			this.domElement=document.createElement(param.element||"div");
			this.addStyleClass("GUIElement");
			
			if (param.styleClass)
			{
				this.addStyleClass(param.styleClass);
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
		addChild:function(guiElement,target)
		{
			if(guiElement instanceof GE&&this.nodePatch.addChild(guiElement))
			{
				if(typeof target==="string")
				{
					target=this.domElement.querySelector(target);
				}
				if(!target)
				{
					target=this.domElement;
				}
				target.appendChild(guiElement.domElement);
				return true;
			}
			return false;
		},
		removeChild:function(guiElement)
		{
			if(this.nodePatch.removeChild(guiElement))
			{
				guiElement.domElement.remove();
				guiElement.removeListener("all",this);
				return true;
			}
			return false;
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
			var c=this.children.slice();
			for(var i=0;i<c.length;i++)
			{
				c[i].destroy();
			}
			this.mega();
		}
	});
	
	SMOD("GUIElement",GE);
	
})(Morgas,Morgas.setModule,Morgas.getModule);