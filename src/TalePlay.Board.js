(function(µ,SMOD,GMOD,HMOD){

    var TALE=this.TalePlay=this.TalePlay||{};
    
	var SC=GMOD("shortcut")({
		rs:"rescope",
        node:"NodePatch"
	});
	
	var CTRL_EVENTS="analogStickChanged buttonChanged";
	var BOARD=TALE.Board=µ.Class({
		init:function(container)
		{
			this.controllers=[];
			this.nodePatch=new SC.node(this,{
				children:"layers",
				addChild:"addLayer",
				removeChild:"removeLayer",
				hasChild:"hasLayer"
			});
			//this.layers=[];
			
			this.disabled=false;
			this.playerDisabled={};
			

			SC.rs.all(["focus"],this);
			
			this.domElement=document.createElement("div");
			this.domElement.classList.add("Board");
			
			this.keyTrigger=document.createElement("textarea");
			this.domElement.appendChild(this.keyTrigger);
			this.keyTrigger.classList.add("keyTrigger");
			this.keyTrigger.style.position="absolute";
			this.keyTrigger.style.zIndex="-1";
			this.keyTrigger.style.height=this.keyTrigger.style.width="0";
			this.keyTrigger.style.resize="none";
			
			this.domElement.addEventListener("click", this.focus, false);
			
			if(container)
			{
				container.appendChild(this.domElement);
			}
		},
		setDisabled:function()
		{
			//TODO
		},
		setPlayerDisabled:function()
		{
			//TODO
		},
		addController:function(controller,player)
		{
			this.removeController(controller);
			this.controllers.push({controller:controller,player:player||1});
			controller.addListener(CTRL_EVENTS,this,"_ctrlCallback");
			//TODO no key events on a div
			/**/
			if(HMOD("Controller.Keyboard")&&controller instanceof GMOD("Controller.Keyboard"))
			{
				controller.setDomElement(this.keyTrigger);
			}
			//*/
		},
		removeController:function(controller)
		{
			for(var i=this.controllers.length-1;i>=0;i--)
			{
				if(this.controllers[i].controller===controller)
				{
					controller.removeListener(CTRL_EVENTS,this,"_ctrlCallback");
					if(HMOD("Controller.Keyboard")&&controller instanceof GMOD("Controller.Keyboard"))
					{
						controller.setDomElement();
					}
					this.controllers.splice(i,1);
					return true;
				}
			}
			return false;
		},
		setControllerDisabled:function()
		{
			//TODO
		},
		_ctrlCallback:function(event)
		{
			if(!this.disabled&&this.layers.length>0)
			{
				var args=Array.prototype.slice.call(arguments,0);
				event.player=null;
				for(var i=this.controllers.length-1;i>=0;i--)
				{
					if(this.controllers[i].controller===event.source)
					{
						event.player=i;
						break;
					}
				}
				if(!this.playerDisabled[event.player])
				{
					this.layers[this.layers.length-1].onController(event);
				}
			}
		},
		addLayer:function(layer)
		{
			if(HMOD("Layer")&&layer instanceof GMOD("Layer")&&this.nodePatch.addChild(layer))
			{
				this.domElement.appendChild(layer.domElement);
				return true;
			}
			return false;
		},
		removeLayer:function(layer)
		{
			if(this.nodePatch.removeChild(layer))
			{
				layer.domElement.remove();
				return true;
			}
			return false;
		},
		focus:function(event)
		{
			if(!event||(event.target.tagName!=="INPUT"&&event.target.tagName!=="SELECT"&&event.target.tagName!=="TEXTAREA"))
			{
				this.keyTrigger.focus();
			}
		}
	});
	SMOD("Board",BOARD);
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);