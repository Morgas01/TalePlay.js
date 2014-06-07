(function(µ,SMOD,GMOD){
	
	var SC=GMOD("shortcut")({
		rs:"rescope",
		ctrl:"Controller"
	});
	
	var CTRL_EVENTS="analogStickChanged buttonChanged";
	var BOARD=µ.Board=µ.Class({
		init:function(container)
		{
			this.controllers=[];
			this.layers=[];
			this.disabled=false;
			this.playerDisabled={};
			

			SC.rs.all(["ctrlCallback"],this);
			
			this.domElement=document.createElement("div");
			this.domElement.style.position="relative";
			this.domElement.classList.add("Board");
			
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
			this.controllers.push({controller:controller,player:player||0});
			controller.addListener(CTRL_EVENTS,this.ctrlCallback);
			if(controller instanceof SC.ctrl.Keyboard)
			{
				controller.setDomElement(this.domElement);
			}
		},
		removeController:function(controller)
		{
			for(var i=this.controllers.length-1;i>=0;i--)
			{
				if(this.controllers[i].controller===controller)
				{
					controller.removeListener(CTRL_EVENTS,this.ctrlCallback);
					if(controller instanceof SC.ctrl.Keyboard)
					{
						controller.setDomElement();
					}
					this.controllers.splice(i,1);
				}
			}
		},
		setControllerDisabled:function()
		{
			//TODO;
		},
		ctrlCallback:function(event)
		{
			if(!this.disabled&&this.layers.length>0)
			{
				var args=Array.prototype.slice.call(arguments,0);
				event.player=null;
				for(var i=this.controllers.length-1;i>=0;i--)
				{
					if(this.controllers[i].controller===this)
					{
						event.player=i;
						break;
					}
				}
				if(!this.playerDisabled[event.player])
				{
					this.layers[0].onController(event);
				}
			}
		},
		addLayer:function(layer)
		{
			this.layers.unshift(layer);
			layer.setBoard(this);
		},
		removeLayer:function()
		{
			this.layers.shift().removeBoard();
			
		}
	});
	SMOD("Board",BOARD);
})(Morgas,Morgas.setModule,Morgas.getModule)