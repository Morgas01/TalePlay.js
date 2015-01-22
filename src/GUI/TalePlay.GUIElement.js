(function(µ,SMOD,GMOD){

    let TALE=window.TalePlay=window.TalePlay||{};

	let LST=GMOD("Listeners");
	let SC=GMOD("shortcut")({
		sc:"shortcut",
        node:"NodePatch",
        Layer:"Layer"
    });
	
	let GE=TALE.GUIElement=µ.Class(LST,{
		init:function(param)
		{
			param=param||{};
			this.superInit(LST);
			this.nodePatch=new SC.node(this,{
		        parent:"parent",
		        children:"children",
		        addChild:"addChild",
		        removeChild:"removeChild"
			},true);
			
			SC.sc({layer:function(node)
			{
				let layer=node.parent;
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
			let list=this.domElement.classList;
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
			let list=this.domElement.classList;
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
			let c=this.children.slice();
			for(let i=0;i<c.length;i++)
			{
				c[i].destroy();
			}
			LST.prototype.destroy.call(this);
		}
	});
	
	SMOD("GUIElement",GE);
	
})(Morgas,Morgas.setModule,Morgas.getModule);