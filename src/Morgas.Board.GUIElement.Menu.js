(function(µ,SMOD,GMOD){
	
	var GUI=GMOD("GUIElement"),
	
	SC=GMOD("shortcut")({
		MENU:"Menu",
		find:"find",
		rescope:"rescope"
	});
	
	var MENU=GUI.Menu=µ.Class(GUI,{
		init:function(layer,param)
		{
			SC.rescope.all(["_stepActive"],this);
			
			param=param||{};
			
			this.superInit(GUI,layer);
			this.menu=new SC.MENU();
			this.domElement.classList.add("Menu");
			
			this.createListener("activeChanged selectionChanged")

			this.type=param.type||MENU.Types.VERTICAL;
			this.axisState={index:null,player:null,value:0};
			this.buttonState={index:null,player:null};
			this.allow=param.allow;
			this.domItems=[];
			
			this.stepID=null;
			this.stepDelay=param.stepDelay||500;
			this.stepAcceleration=Math.min(1/param.stepAcceleration,param.stepAcceleration)||0.75;
			this.currentStepDelay=null;
			
			this.domElement.dataset.type = this.type===3 ? "GRID" : this.type===2 ? "HORIZONTAL" : "VERTICAL";
			
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
			if(!this.allow||
			  (this.allow.axes&&this.allow.axes.indexOf(index)!==-1)||
			  (this.allow[player]&&this.allow[player].axes&&this.allow[player].axes.indexOf(index)!==-1))
			{
				var value=0;
				if(this.type===MENU.Types.VERTICAL)
				{
					if(axis.y>=0.5)
					{
						value=1;
					}
					else if (axis.y<=-0.5)
					{
						value=-1;
					}
				}
				else if(this.type===MENU.Types.HORIZONTAL)
				{
					if(axis.x>=0.5)
					{
						value=-1;
					}
					else if (axis.x<=-0.5)
					{
						value=1;
					}
				}
				if (value===0&&this.axisState.index===index&&this.axisState.player===player)
				{
					this.axisState.index=this.axisState.player=null;
					this.axisState.value=0;
					clearTimeout(this.stepID);
					this.stepID=null;
				}
				else if (this.axisState.index===null&&value!==0)
				{
					this.axisState.index=index;
					this.axisState.player=player;
					this.axisState.value=value;
					this._stepActive();
				}
			}
		},
		_stepActive:function()
		{
			if(this.axisState.value!==0)
			{
				if(this.menu.active!==-1)
				{
					this.domItems[this.menu.active].classList.remove("active");
				}
				if(this.axisState.value===1)
				{
					this.menu.activeUp();
				}
				else
				{
					this.menu.activeDown();
				}
				if(this.menu.active!==-1)
				{
					this.domItems[this.menu.active].classList.add("active");
				}
				this.fire("activeChanged")
				
				if(this.stepID===null)
				{
					this.currentStepDelay=this.stepDelay;
				}
				else if (this.currentStepDelay!==50)
				{
					this.currentStepDelay=Math.max(50,this.currentStepDelay*this.stepAcceleration);
				}
				this.stepID=setTimeout(this._stepActive, this.currentStepDelay);
			}
			else
			{
				clearTimeout(this.stepID);
				this.stepID=null;
			}
		},
		onButton:function(type,player,index,value)
		{
			if(!this.allow||
			  (this.allow.buttons&&this.allow.buttons.indexOf(index)!==-1)||
			  (this.allow[player]&&this.allow[player].buttons&&this.allow[player].buttons.indexOf(index)!==-1))
			{
				if(value===0&&this.buttonState.index===index&&this.buttonState.player===player)
				{
					this.buttonState.index=this.buttonState.player=null;
				}
				else if (this.buttonState.index===null&&value===1)
				{
					this.buttonState.index=index;
					this.buttonState.player=player;
					
					if(this.menu.active!==-1)
					{
						var cl=this.domItems[this.menu.active].classList;
						if(this.menu.toggleActive())
						{
							cl.add("selected");
						}
						else
						{
							cl.remove("selected");
						}
						this.fire("selectionChanged");
					}
				}
			}
		},
		addItem:function(item)
		{
			var domItem=document.createElement("span");
			domItem.classList.add("menuitem");
			domItem.innerHTML=item;
			this.domItems.push(domItem);
			this.menu.addItem(item);
			
			this.domElement.appendChild(domItem);
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