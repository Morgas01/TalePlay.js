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
				for(var i=_self.controllers.length;i>=0;i--)
				{
					if(_self.controllers[i].ctrl===this)
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
	
	var BOARD=µ.Board=µ.Class({
		init:function(domElement)
		{
			this.controllers=[];
			this.layers=[];
			this.disabled=false;
			this.playerDisabled={};
			
			this.ctrlCallback=_ctrlCB(this);
			
			this.domElement=domElement||document.createElement("div");
			this.domElement.style.position="relative";
		},
		addController:function(controller,player)
		{
			this.removeController(ctrl);
			this.controllers.push({ctrl:ctrl,player:player||0});
			ctrl.addListener(CTRL_EVENTS,this.ctrlCallback);
			if(controller instanceof SC.Controller.Keyboard)
			{
				controller.setDomElement(this.domElement);
			}
		},
		removeController:function(ctrl)
		{
			for(var i=this.controllers.length;i>=0;i--)
			{
				if(this.controllers[i].ctrl===ctrl)
				{
					ctrl.removeListener(CTRL_EVENTS,this.ctrlCallback);
					if(ctrl instanceof SC.Controller.Keyboard)
					{
						ctrl.setDomElement();
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