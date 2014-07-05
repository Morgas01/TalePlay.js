(function(µ,SMOD,GMOD){
	
	var GUI=GMOD("GUIElement"),
	
	SC=GMOD("shortcut")({
		MENU:"Menu",
		find:"find",
		rescope:"rescope"
	});
	
	var MENU=GUI.Menu=µ.Class(GUI,{
		init:function(param)
		{
			SC.rescope.all(["_stepActive","onClick"],this);
			
			param=param||{};
			
			this.superInit(GUI);
			this.menu=new SC.MENU(param);
			this.domElement.classList.add("Menu");
			
			this.domElement.addEventListener("click",this.onClick,false);
			
			this.createListener("activeChanged select")

			this.type=param.type||MENU.Types.VERTICAL;
			this.converter=param.converter||MENU.defaultConverter;
			this.axisState={index:null,player:null,value:0};
			this.buttonState={index:null,player:null};
			
			this.stepID=null;
			this.stepDelay=param.stepDelay||500;
			this.stepAcceleration=Math.min(1/param.stepAcceleration,param.stepAcceleration)||0.75;
			this.currentStepDelay=null;
			
			this.domElement.dataset.type = reverseTypes[this.type];
			
			this.update();
		},
		onAnalogStick:function(event)
		{
			var value=0;
			switch(this.type)
			{
			case MENU.Types.VERTICAL:
			case MENU.Types.TABLE:
					if(event.analogStick.y>=0.5)
					{
						value=1;
					}
					else if (event.analogStick.y<=-0.5)
					{
						value=-1;
					}
					break;
				case MENU.Types.HORIZONTAL:
					if(event.analogStick.x>=0.5)
					{
						value=-1;
					}
					else if (event.analogStick.x<=-0.5)
					{
						value=1;
					}
					break;
			}
			if (value===0&&this.axisState.index===event.index&&this.axisState.player===event.player)
			{
				this.axisState.index=this.axisState.player=null;
				this.axisState.value=0;
				clearTimeout(this.stepID);
				this.stepID=null;
			}
			else if (this.axisState.index===null&&value!==0)
			{
				this.axisState.index=event.index;
				this.axisState.player=event.player;
				this.axisState.value=value;
				this._stepActive();
			}
		},
		_stepActive:function()
		{
			if(this.axisState.value!==0)
			{
				if(this.menu.active!==-1)
				{
					this.domElement.children[this.menu.active].classList.remove("active");
				}
				
				this.menu.moveActive(-this.axisState.value);
				
				if(this.menu.active!==-1)
				{
					this.domElement.children[this.menu.active].classList.add("active");
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
		onClick:function(event)
		{
			var target=event.target;
			while(target.parentNode&&target.parentNode!==this.domElement)
			{
				target=target.parentNode;
			}
			var index=Array.indexOf(this.domElement.children,target);
			if(index!==-1)
			{
				this.toggleSelect(index);
			}
		},
		onButton:function(event)
		{
			if(event.value===0&&this.buttonState.index===event.index&&this.buttonState.player===event.player)
			{
				this.buttonState.index=this.buttonState.player=null;
			}
			else if (this.buttonState.index===null&&event.value===1)
			{
				this.buttonState.index=event.index;
				this.buttonState.player=event.player;
				
				if(this.menu.active!==-1)
				{
					this.toggleSelect(this.menu.active)
				}
			}
		},
		toggleSelect:function(index)
		{
			if(this.fire("select",this.menu.getItem(index)))
			{
				var cl=this.domElement.children[index].classList;
				if(this.menu.toggleSelect(index))
				{
					cl.add("selected");
				}
				else
				{
					cl.remove("selected");
				}
			}
		},
		update:function()
		{
			this.domElement.innerHTML="";
			for(var i=0;i<this.menu.items.length;i++)
			{
				this.domElement.appendChild(this.convertItem(this.menu.items[i]));
			}
		},
		convertItem:function(item)
		{
			if(!(item instanceof Node))
			{
				var index=this.menu.items.indexOf(item)
				var converted=this.converter(item,index,this.menu.selectedIndexs.indexOf(index)!==-1);
				item=document.createElement("span");
				if(Array.isArray&&typeof converted !=="string")
				{
					converted="<span>"+converted.join("</span><span>")+"</span>";
				}
				item.innerHTML=converted;

			}
			item.classList.add("menuitem");
			if(this.menu.isSelected(item))
			{
				item.classList.add("selected");
			}
			return item;
		},
		addItem:function(item)
		{
			this.menu.addItem(item);
			this.domElement.appendChild(this.convertItem(item));
		},
		removeItem:function(item)
		{
			var index=this.menu.removeItem(item);
			if(index!==-1&&index<this.domElement.children.length)
			{
				this.domElement.children[index].remove();
			}
			return index;
		},
		getItem:function(index)
		{
			var rtn=this.menu.getItem(index);
			rtn.domElement=this.domElement.children[index];
			return rtn;
		}
		
	});
	MENU.Types={
		VERTICAL:1,
		HORIZONTAL:2,
		TABLE:3,
		GRID:4//TODO
	};
	MENU.defaultConverter=function(item,index,selected)
	{
		return ""+item;
	}
	
	var reverseTypes={};
	for(var t in MENU.Types)
	{
		reverseTypes[MENU.Types[t]]=[t];
	}
	
	SMOD("GUI.Menu",MENU);
	
})(Morgas,Morgas.setModule,Morgas.getModule);