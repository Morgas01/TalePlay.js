(function(µ,SMOD,GMOD){
	
	let GUI=GMOD("GUIElement"),
	
	SC=GMOD("shortcut")({
		proxy:"proxy",
		tb:"GUI.TextBox",
		menu:"GUI.Menu"
	});
	
	let DIALOG=GUI.Dialog=µ.Class(GUI,{
		init:function(param)
		{
			param=param||{};
			param.element="fieldset";
			
			this.superInit(GUI,param);
			this.createListener("dialogEnd");
			
			this.legend=document.createElement("legend");
			this.domElement.appendChild(this.legend);
			
			this.dialogParts=param.dialogParts?param.dialogParts.slice():[];
			this.actions=param.actions||[];
			this.active=null;
			
			SC.proxy("active",["onAnalogStick","onButton"],this);
			
			this.next();
		},
		next:function(event)
		{
			if(this.active)
			{
				this.active.destroy();
				this.active.domElement.remove();
			}
			
			if(this.dialogParts.length>0)
			{
				let dPart=this.dialogParts.shift();
				
				let styles=["width","height","top","right","bottom","left"];
				for(let s=0;s<styles.length;s++)
				{
					this.domElement.style[styles[s]]=dPart[styles[s]]||"";
				}
				if(dPart.parts)
				{//textBox
					this.legend.textContent=dPart.title;
					this.active=new SC.tb({
						parts:dPart.parts
					});
					this.active.addListener("complete:once",this,"next");
					this.active.start();
				}
				else if (dPart.choices)
				{//choice
					this.active=new SC.menu({
						items:dPart.choices,
						converter:DIALOG.MENU_CONVERTER,
						loop:false,
						active:0,
						selectionType:SC.menu.SelectionTypes.NONE
					});
					this.active.addListener("select:once",this,"next");
				}
				this.domElement.appendChild(this.active.domElement);
			}
			else
			{
				let actions;
				if(event&&event.type==="select"&&event.value.actions)
				{
					actions=this.actions.concat(event.value.actions)
				}
				else
				{
					actions=this.actions;
				}
				this.fire("dialogEnd",{actions:actions});
			}
		}
	});
	DIALOG.MENU_CONVERTER=function(item){return item.name};
	
	SMOD("GUI.Dialog",DIALOG);
	
})(Morgas,Morgas.setModule,Morgas.getModule);