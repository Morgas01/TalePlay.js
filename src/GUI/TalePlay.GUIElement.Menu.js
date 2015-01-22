(function(µ,SMOD,GMOD){
	
	let GUI=GMOD("GUIElement");
	
	let SC=GMOD("shortcut")({
		MENU:"Menu",
		rescope:"rescope"
	});
	
	let MENU=GUI.Menu=µ.Class(GUI,{
		init:function(param)
		{
			SC.rescope.all(["_stepActive","onClick"],this);
			
			param=param||{};
			
			this.superInit(GUI,param);
			this.menu=new SC.MENU(param);
			this.addStyleClass("Menu");
			
			this.domElement.addEventListener("click",this.onClick,false);
			
			this.createListener("activeChanged select");

			this.type=param.type||MENU.Types.VERTICAL;
			this.converter=param.converter||MENU.defaultConverter;
			this.converterInfo=param.converterInfo||{};
			this.rows=param.rows||null;
			this.columns=param.columns||null;
			this.header=param.header||null;
			
			this.stepDirection=null;
			this.stepID=null;
			this.stepDelay=param.stepDelay||500;
			this.stepAcceleration=Math.min(1/param.stepAcceleration,param.stepAcceleration)||0.75;
			this.minStepDelay=param.minStepDelay||50;
			this.currentStepDelay=null;
			
			this.domElement.dataset.type = reverseTypes[this.type];
			
			this.update();
		},
		onAnalogStick:function(event)
		{
			let direction=event.analogStick.clonePoint().doMath(Math.round,0);
			if(!direction.equals(this.stepDirection))
			{
				if(this.stepID)
				{
					clearTimeout(this.stepID);
					this.stepID=null;
				}
				this.stepDirection=direction;
				let step=this._stepActive();
			}
		},
		_stepActive:function()
		{
			let step=0;
			switch(this.type)
			{
				case MENU.Types.VERTICAL:
				case MENU.Types.TABLE:
					step=-this.stepDirection.y;
					break;
				case MENU.Types.GRID:
					let gridLayout=this.getGridLayout();
					if(this.stepDirection.y===1)
					{
						step=-gridLayout.columns;
						if(this.menu.active+step<0)
						{
							let r=this.menu.items.length%gridLayout.columns;
							step=(r===0||r>this.menu.active) ? -r : step-r;
						}
					}
					else if (this.stepDirection.y===-1)
					{
						step=gridLayout.columns;
						if(this.menu.active+step>=this.menu.items.length)
						{
							step=this.menu.active%gridLayout.columns;
							step=this.menu.items.length-this.menu.active+step;
						}
					}
					case MENU.Types.HORIZONTAL:
					step+=this.stepDirection.x;
					break;
			}
			if(step!==0)
			{
				this.menu.moveActive(step);
				this._updateActive();
				this.fire("activeChanged");
				
				if(this.stepID===null)
				{
					this.currentStepDelay=this.stepDelay;
				}
				else if (this.currentStepDelay!==this.minStepDelay)
				{
					this.currentStepDelay=Math.max(this.minStepDelay,this.currentStepDelay*this.stepAcceleration);
				}
				this.stepID=setTimeout(this._stepActive, this.currentStepDelay);
			}
			else
			{
				clearTimeout(this.stepID);
				this.stepDirection=this.stepID=null;
			}
		},
		_updateActive:function()
		{
			for(let i=0,actives=this.domElement.querySelectorAll(".menuitem.active");i<actives.length;i++)
			{
				actives[i].classList.remove("active");
			}
			
			if(this.menu.active!==-1)
			{
				this.getItemDomElement(this.menu.active).classList.add("active");
			}
		},
		onClick:function(event)
		{
			let target=event.target,
			index=-1;
			if(target.tagName==="INPUT"||target.tagName==="SELECT"||target.tagName==="TEXTAREA")
			{
				return ;
			}
			while(target&&target!==document&&!target.classList.contains("menuitem"))
			{
				target=target.parentNode;
			}
			if(this.type===MENU.Types.GRID)
			{
				let column=Array.indexOf(target.parentNode.children,target),
				row=Array.indexOf(this.domElement.children,target.parentNode),
				gridLayout=this.getGridLayout();
				index=row*gridLayout.columns+column;
			}
			else if (this.type===MENU.Types.TABLE&&this.header)
			{
				index=Array.indexOf(this.domElement.children,target)-1;
			}
			else
			{
				index=Array.indexOf(this.domElement.children,target);
			}
			if(index>-1)
			{
				event.stopPropagation();
				if(this.layer&&this.layer.board)
				{
					this.layer.board.focus();
				}
				this.setActive(index);
				this.toggleSelect(index);
			}
		},
		onButton:function(event)
		{
			if (event.value===1)
			{
				if(this.menu.active!==-1)
				{
					this.toggleSelect(this.menu.active)
				}
			}
		},
		toggleSelect:function(index)
		{
			let cl=this.getItemDomElement(index).classList;
			if(this.menu.selectionType===SC.MENU.SelectionTypes.SINGLE&&!this.menu.isSelected(index)&&this.menu.selectedIndexs.length>0)
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
			let rtn={rows:this.rows,columns:this.columns};
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
			if(this.type===MENU.Types.TABLE&&this.header)
			{
				this.domElement.innerHTML='<span class="menuheader"><span>'+this.header.join('</span><span>')+'</span></span>'
			}
			if(this.type===MENU.Types.GRID&&this.menu.items.length>0)
			{
				let gridLayout=this.getGridLayout();
				
				for(let r=0,row=document.createElement("span");r<gridLayout.rows;r++,row=document.createElement("span"))
				{
					row.classList.add("row");
					this.domElement.appendChild(row);
					for(let c=0,index=r*gridLayout.columns;c<gridLayout.columns&&index<this.menu.items.length;c++,index=r*gridLayout.columns+c)
					{
						row.appendChild(this.convertItem(this.menu.items[index],index));
					}
				}
			}
			else
			{
				for(let i=0;i<this.menu.items.length;i++)
				{
					this.domElement.appendChild(this.convertItem(this.menu.items[i],i));
				}
			}
		},
		convertItem:function(item,index)
		{
			let converted=this.converter(item,index,this.converterInfo);
			let element=null;
			if(converted instanceof HTMLElement)
			{
				element=converted;
			}
			else
			{
				element=document.createElement("span");
				if(Array.isArray(converted))
				{
					converted="<span>"+converted.join("</span><span>")+"</span>";
				}
				element.innerHTML=converted;
			}
			
			element.classList.add("menuitem");
			if(this.menu.isSelected(item))
			{
				element.classList.add("selected");
			}
			if(this.menu.isDisabled(item))
			{
				element.classList.add("disabled");
			}
			if(this.menu.active===index)
			{
				element.classList.add("active");
			}
			return element;
		},
		addItem:function(item)
		{
			this.menu.addItem(item);
			if(this.type===MENU.Types.GRID) update();
			else this.domElement.appendChild(this.convertItem(item,this.menu.items.length-1));
			return this;
		},
		addAll:function(items)
		{
			for(let i=0;i<items.length;i++)
			{
				this.addItem(items[i]);
			}
			return this;
		},
		removeItem:function(item)
		{
			let index=this.menu.removeItem(item);
			if(index!==-1)
			{
				this.getItemDomElement(index).remove();
			}
			return index;
		},
		getItemDomElement:function(index)
		{
			if(this.type===MENU.Types.GRID)
			{
				let gridLayout=this.getGridLayout(),
				row=Math.floor(index/gridLayout.columns),
				column=index-row*gridLayout.columns;
				return this.domElement.children[row].children[column];
			}
			else if (this.type===MENU.Types.TABLE&&this.header)
			{
				return this.domElement.children[index+1];
			}
			else
			{
				return this.domElement.children[index];
			}
		},
		getItem:function(index)
		{
			let rtn=this.menu.getItem(index);
			rtn.domElement=this.getItemDomElement(index);
			return rtn;
		},
		getSelectedItems:function()
		{
			let rtn=[];
			for(let i=0;i<this.menu.selectedIndexs.length;i++)
			{
				rtn.push(this.getItem(this.menu.selectedIndexs[i]));
			}
			return rtn;
		},
		clear:function()
		{
			this.menu.clear();
			while(!this.header&&this.domElement.lastChild||this.domElement.lastChild!==this.domElement.firstChild)
			{
				this.domElement.lastChild.remove();
			}
			return this;
		},
        getActive:function()
        {
            return this.getItem(this.menu.active);
        },
		setActive:function(index)
		{
			this.menu.setActive(index);
			this._updateActive();
		}
	});
	GMOD("shortcut")({SelectionTypes:()=>GMOD("Menu").SelectionTypes},MENU);
	MENU.Types={
		VERTICAL:1,
		HORIZONTAL:2,
		TABLE:3,
		GRID:4
	};
	MENU.defaultConverter=function(item,index,selected)
	{
		return ""+item;
	};
	
	let reverseTypes={};
	for(let t in MENU.Types)
	{
		reverseTypes[MENU.Types[t]]=[t];
	}
	
	SMOD("GUI.Menu",MENU);
	
})(Morgas,Morgas.setModule,Morgas.getModule);