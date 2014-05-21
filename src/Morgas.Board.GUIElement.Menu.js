(function(µ,SMOD,GMOD){
	
	var GUI=GMOD("GUIElement"),
	
	SC=GMOD("shortcut")({
		MENU:"Menu"
	});
	
	var MENU=GUI.Menu=µ.Class(GUI,{
		init:function(layer,param)
		{
			this.superInit(GUI,layer);
			this.domElement.classList.add("Menu");
			
			this.createListener("activeChanged selectionChanged")

			this.type=param.type||MENU.Types.VERTICAL;
			this.axes=param.axes||[];
			this.buttons=param.buttons||[];
			this.domItems=[];
			
			this.lastdirection4=0;
			this.lastButton=null;
			
			param=param||{};
			this.menu=new SC.MENU(param);
			
			if(param.items)
			{
				for(var i=0;i<param.items.length;i++)
				{
					this.addItem(param.items[i]);
				}
			}
		},
		onAxis:function(type,player,index,axis)
		{
			if(this.axes.length===0||this.axes.indexOf(index)!==-1)
			{
				var direction=axis.getDirection4();
				if(direction!==this.lastdirection4&&direction!==0)
				{
					if(this.type===MENU.Types.VERTICAL&&direction===1||
					   this.type===MENU.Types.HORIZONTAL&&direction===4)
					{
						this.menu.activeUp();
					}
					else if (this.type===MENU.Types.VERTICAL&&direction===3||
							   this.type===MENU.Types.HORIZONTAL&&direction===2)
					{
						this.menu.activeDown();
					}
				}
				this.lastdirection4=direction;
				this.fire("activeChanged")
			}
		},
		onButton:function(type,player,index,value)
		{
			if(this.buttons.length==0||this.buttons.indexOf(index)!==-1)
			{
				if(this.lastButton===index&&value===0)
				{
					this.lastButton=null;
				}
				else if (this.lastButton===null)
				{
					this.menu.toggleActive();
					this.lastButton=index;
				}
			}
		},
		addItem:function(item)
		{
			var domItem=document.createElement("span");
			domItem.innerHTML=item;
			this.domItems.push(domIdem);
			this.menu.addItem(item);
			
			this.domELement.appendChild(domItem);
		},
		removeItem:function(item)
		{
			var index=this.menu.removeItem(item);
			if(index!==-1)
			{
				this.domItems.splice(index,1);
			}
			return index;
		},
		getItem:function(index)
		{
			var rtn=this.menu.getItem(index);
			rtn.domElement=this.domItems[index];
			return rtn;
		}
		
	});
	MENU.Types={
		VERTICAL:1,
		HORIZONTAL:2,
		GRID:3//TODO
	};
	
})(Morgas,Morgas.setModule,Morgas.getModule);