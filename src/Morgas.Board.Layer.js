(function(µ,SMOD,GMOD){

	var BOARD=GMOD("Board");
    var SC=GMOD("shortcut")({
	    node:"NodePatch"
    });
	
	var LAYER=BOARD.Layer=µ.Class({
		init:function()
		{

			this.nodePatch=new SC.node(this,{
				parent:"board",
				children:"GUIElements"
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
			this.nodePatch.addChild(guiElement);
			
			if(typeof target==="string")
			{
				target=this.domElement.querySelector(target);
			}
			if(!target)
			{
				target=this.domElement;
			}
			target.appendChild(guiElement.domElement);
		},
		remove:function(guiElement)
		{
			if(this.nodePatch.removeChild(guiElement))
			{
				guiElement.domElement.remove();
				return true;
			}
			return false;
		}
	});
	SMOD("Layer",LAYER);
})(Morgas,Morgas.setModule,Morgas.getModule);