(function(µ,SMOD,GMOD){

	var BOARD=GMOD("Board"),
	LST=GMOD("Listeners");
	
	var LAYER=BOARD.Layer=µ.Class(LST,{
		init:function()
		{
			this.superInit(LST);
			
			this.board=null;
			this.GUIElements=[];
			
			this.domElement=document.createElement("div");
			this.domElement.classList.add("Layer");
		},
		setBoard:function(board)
		{
			this.board=board;
			this.board.domElement.appendChild(this.domElement);
		},
		removeBoard:function()
		{
			this.board.domElement.removeChild(this.domElement);
			this.board=null;
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
			if(this.GUIElements.indexOf(guiElement)===-1)
			{
				this.GUIElements.push(guiElement);
				guiElement.setLayer(this);
			}
			
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
			index=this.GUIElements.indexOf(guiElement);
			if(index!==-1)
			{
				this.GUIElements[index].domElement.remove();
				this.GUIElements.splice(index,1);
			}
		}
	});
	
})(Morgas,Morgas.setModule,Morgas.getModule)