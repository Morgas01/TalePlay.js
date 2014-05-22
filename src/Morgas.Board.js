(function(µ,SMOD,GMOD){
	
	var SC=GMOD("shortcut")({
		rs:"rescope",
		ctrl:"Controller"
	});
	
	var _ctrlCB=function(_self)
	{
		return function()
		{
			if(!_self.disabled&&_self.layers.length>0)
			{
				var args=Array.prototype.slice.call(arguments,0);
				var player=null;
				for(var i=_self.controllers.length-1;i>=0;i--)
				{
					if(_self.controllers[i].controller===this)
					{
						player=i;
					}
				}
				if(!_self.playerDisabled[player])
				{
					args.splice(1,0,player);
					_self.layers[0].fire.apply(_self.layers[0],args);
				}
			}
		}
	};
	var CTRL_EVENTS="changed axisChanged buttonChanged";
	var BOARD=µ.Board=µ.Class({
		init:function(container)
		{
			this.controllers=[];
			this.layers=[];
			this.disabled=false;
			this.playerDisabled={};
			
			this.ctrlCallback=_ctrlCB(this);
			
			this.domElement=document.createElement("div");
			this.domElement.style.position="relative";
			
			if(container)
			{
				container.appendChild(this.domElement);
			}
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
		ctrlCallback:null,/*see _ctrlCB function*/
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