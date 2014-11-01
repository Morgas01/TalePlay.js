(function(µ,SMOD,GMOD){
	
	var GUI=GMOD("GUIElement"),
	
	SC=GMOD("shortcut")({
		MENU:"Menu",
		rescope:"rescope"
	});
	
	var MENU=GUI.Menu=µ.Class(GUI,{
		init:function(param)
		{
			SC.rescope.all(["_stepActive","onClick"],this);
			
			param=param||{};
			
			this.superInit(GUI,param.styleClass);
			this.menu=new SC.MENU(param);
			this.addStyleClass("Menu");
			
			this.domElement.addEventListener("click",this.onClick,false);
			
			this.createListener("activeChanged select")

			this.type=param.type||MENU.Types.VERTICAL;
			this.converter=param.converter||MENU.defaultConverter;
			this.rows=param.rows||null;
			this.columns=param.columns||null;
			
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
						value=-1;
					}
					else if (event.analogStick.y<=-0.5)
					{
						value=1;
					}
					break;
				case MENU.Types.HORIZONTAL:
					if(event.analogStick.x>=0.5)
					{
						value=1;
					}
					else if (event.analogStick.x<=-0.5)
					{
						value=-1;
					}
					break;
				case MENU.Types.GRID:
					var gridLayout=this.getGridLayout();
					if(event.analogStick.x>=0.5)
					{
						value=1;
					}
					else if (event.analogStick.x<=-0.5)
					{
						value=-1;
					}
					else if(event.analogStick.y>=0.5)
					{
						value=-gridLayout.columns;
						if(this.menu.active+value>=this.menu.items.length)
						{
							value=this.menu.active%gridLayout.columns;
							value=this.menu.items.length-this.menu.active+value;
						}
					}
					else if (event.analogStick.y<=-0.5)
					{
						value=gridLayout.columns;
						if(this.menu.active+value>=this.menu.items.length)
						{
							value=this.menu.active%gridLayout.columns;
							value=this.menu.items.length-this.menu.active+value;
						}
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
					this.getItemDomElement(this.menu.active).classList.remove("active");
				}
				
				this.menu.moveActive(this.axisState.value);
				
				if(this.menu.active!==-1)
				{
					this.getItemDomElement(this.menu.active).classList.add("active");
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
			var target=event.target,
			index=-1;
			if(target.tagName==="INPUT"||target.tagName==="SELECT"||target.tagName==="TEXTAREA")
			{
				return ;
			}
			while(target&&!target.classList.contains("menuitem"))
			{
				target=target.parentNode;
			}
			if(this.type===MENU.Types.GRID)
			{
				var column=Array.indexOf(target.parentNode.children,target),
				row=Array.indexOf(this.domElement.children,target.parentNode),
				gridLayout=this.getGridLayout();
				index=row*gridLayout.columns+column;
			}
			else
			{
				index=Array.indexOf(this.domElement.children,target);
			}
			if(index>-1)
			{
				event.stopPropagation();
				this.toggleSelect(index);
				if(this.layer&&this.layer.board)
				{
					this.layer.board.focus();
				}
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
			var cl=this.getItemDomElement(index).classList;
			if(this.menu.selectionType===SC.MENU.SelectionTypes.single&&!this.menu.isSelected(index)&&this.menu.selectedIndexs.length>0)
			{
				this.getItemDomElement(this.menu.selectedIndexs[0]).classList.remove("selected");
			}
			if(this.menu.toggleSelect(index,true))
			{
				cl.add("selected");
			}
			else
			{
				cl.remove("selected");
			}
			this.fire("select",this.menu.getItem(index));
		},
		getGridLayout:function()
		{
			var rtn={rows:this.rows,columns:this.columns}
			if(rtn.rows===null&&rtn.columns===null)
			{
				rtn.columns=Math.ceil(Math.sqrt(this.menu.items.length));
			}
			if(rtn.rows==null)
			{
				rtn.rows=Math.ceil(this.menu.items.length/rtn.columns);
			}
			else if(rtn.columns==null)
			{
				rtn.columns=Math.ceil(this.menu.items.length/rtn.rows);
			}
			return rtn;
		},
		update:function()
		{
			this.domElement.innerHTML="";
			if(this.type===MENU.Types.GRID&&this.menu.items.length>0)
			{
				var gridLayout=this.getGridLayout();
				
				for(var r=0,row=document.createElement("span");r<gridLayout.rows;r++,row=document.createElement("span"))
				{
					row.classList.add("row");
					this.domElement.appendChild(row);
					for(var c=0,index=r*gridLayout.columns;c<gridLayout.columns&&index<this.menu.items.length;c++,index=r*gridLayout.columns+c)
					{
						row.appendChild(this.convertItem(this.menu.items[index],index));
					}
				}
			}
			else
			{
				for(var i=0;i<this.menu.items.length;i++)
				{
					this.domElement.appendChild(this.convertItem(this.menu.items[i],i));
				}
			}
		},
		convertItem:function(item,index)
		{
			var converted=this.converter(item,index,this.menu.selectedIndexs.indexOf(index)!==-1);
			item=document.createElement("span");
			if(Array.isArray(converted))
			{
				converted="<span>"+converted.join("</span><span>")+"</span>";
			}
			item.innerHTML=converted;
			
			item.classList.add("menuitem");
			if(this.menu.isSelected(item))
			{
				item.classList.add("selected");
			}
			if(this.menu.active===index)
			{
				item.classList.add("active");
			}
			return item;
		},
		addItem:function(item)
		{
			this.menu.addItem(item);
			this.domElement.appendChild(this.convertItem(item));
			return this;
		},
		addAll:function(items)
		{
			for(var i=0;i<items.length;i++)
			{
				this.addItem(items[i]);
			}
			return this;
		},
		removeItem:function(item)
		{
			var index=this.menu.removeItem(item);
			if(index!==-1&&index<this.domElement.children.length)
			{
				this.getItemDomElement(index).remove();
			}
			return index;
		},
		getItemDomElement:function(index)
		{
			if(this.type===MENU.Types.GRID)
			{
				var gridLayout=this.getGridLayout(),
				row=Math.floor(index/gridLayout.columns),
				column=index-row*gridLayout.columns;
				return this.domElement.children[row].children[column];
			}
			else
			{
				return this.domElement.children[index];
			}
		},
		getItem:function(index)
		{
			var rtn=this.menu.getItem(index);
			rtn.domElement=this.getItemDomElement(index);
			return rtn;
		},
		getSelectedItems:function()
		{
			var rtn=[];
			for(var i=0;i<this.menu.selectedIndexs.length;i++)
			{
				rtn.push(this.getItem(this.menu.selectedIndexs[i]));
			}
			return rtn;
		},
		clear:function()
		{
			this.menu.clear();
			while(this.domElement.lastChild)
			{
				this.domElement.lastChild.remove();
			}
			return this;
		},
		setActive:function(index)
		{
			this.menu.setActive(index);
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