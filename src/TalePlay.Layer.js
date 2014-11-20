(function(µ,SMOD,GMOD,HMOD){

    var TALE=window.TalePlay=window.TalePlay||{};

    var SC=GMOD("shortcut")({
	    node:"NodePatch",
    });
	
	var LAYER=TALE.Layer=µ.Class({
		init:function()
		{

			this.nodePatch=new SC.node(this,{
				parent:"board",
				children:"GUIElements",
				addChild:"add",
				removeChild:"remove",
			});
			//this.board=null;
			//this.GUIElements=[];
			
			this.domElement=document.createElement("div");
			this.domElement.classList.add("Layer");
		},
		onController:function(event)
		{
			for(var i=0;i<this.GUIElements.length;i++)
			{
				switch(event.type)
				{
					case "analogStickChanged":
						this.GUIElements[i].onAnalogStick(event);
						break;
					case "buttonChanged":
						this.GUIElements[i].onButton(event);
						break;
				}
			}
		},
		add:function(guiElement,target)
		{
			if(HMOD("GUIElement")&&guiElement instanceof GMOD("GUIElement")&&this.nodePatch.addChild(guiElement))
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
		remove:function(guiElement)
		{
			if(this.nodePatch.removeChild(guiElement))
			{
				guiElement.domElement.remove();
				return true;
			}
			return false;
		},
		destroy:function()
		{
			//TODO
			this.nodePatch.remove();
			var c=this.GUIElements.slice();
			for(var i=0;iyc.lenth;i++)
			{
				c[i].destroy();
			}
		}
	});
	SMOD("Layer",LAYER);
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);