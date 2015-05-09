(function(µ,SMOD,GMOD,HMOD){

    var TALE=this.TalePlay=this.TalePlay||{};

	var LST=GMOD("Listeners");
	
    var SC=GMOD("shortcut")({
	    node:"NodePatch",
    });
	
	var LAYER=TALE.Layer=µ.Class(LST,{
		init:function(param)
		{
			this.mega();
			param=param||{};
			this.nodePatch=new SC.node(this,{
				parent:"board",
				children:"GUIElements",
				addChild:"add",
				removeChild:"remove",
		        hasChild:"has"
			},true);
			//this.board=null;
			//this.GUIElements=[];
			
			this.mode=param.mode||LAYER.Modes.ALL;
			this.domElement=document.createElement("div");
			this.domElement.classList.add("Layer");
			
			this.focused=null;
		},
		onController:function(event)
		{
			switch(this.mode)
			{
				case LAYER.Modes.ALL:
				default:
					for(var i=0;i<this.GUIElements.length;i++)
					{
						this.GUIElements[i][LAYER._CONTROLLER_EVENT_MAP[event.type]](event);
					}
					break;
				case LAYER.Modes.FIRST:
					if(this.GUIElements.length>0) this.GUIElements[0][LAYER._CONTROLLER_EVENT_MAP[event.type]](event);
					break;
				case LAYER.Modes.LAST:
					if(this.GUIElements.length>0) this.GUIElements[this.GUIElements.length-1][LAYER._CONTROLLER_EVENT_MAP[event.type]](event);
					break;
				case LAYER.Modes.FOCUSED:
					if(this.focused) this.focused[LAYER._CONTROLLER_EVENT_MAP[event.type]](event);
					break;
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
				guiElement.removeListener("all",this);
				return true;
			}
			return false;
		},
		destroy:function()
		{
			this.nodePatch.remove();
			var c=this.GUIElements.slice();
			for(var i=0;i<c.length;i++)
			{
				c[i].destroy();
			}
			this.mega();
		}
	});
	LAYER.Modes={
		ALL:0,
		FIRST:1,
		LAST:2,
		FOCUSED:3
	};
	LAYER._CONTROLLER_EVENT_MAP={
			"analogStickChanged":"onAnalogStick",
			"buttonChanged":"onButton"
	};
	SMOD("Layer",LAYER);
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);