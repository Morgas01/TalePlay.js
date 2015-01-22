(function(µ,SMOD,GMOD){
	
	let GUI=GMOD("GUIElement"),
	
	SC=GMOD("shortcut")({
		rs:"rescope"
	});
	
	let BOX=GUI.TextBox=µ.Class(GUI,{
		init:function(param)
		{
			SC.rs.all(["_run"],this);
			
			param=param||{};
			
			this.superInit(GUI,param);
			this.addStyleClass("TextBox");
			this.createListener("complete");
			
			this.parts=[];
			for(let i=0,l=param.parts&&param.parts.length;i<l;i++)
			{
				let p=param.parts[i];
				this.addPart(p.text, p.speed, p.stop, p.styleClass, p.tag);
			}
			
			this._timeout=null;
		},
		addPart:function(text,speed,stop,styleClass,tag)
		{
			this.parts.push({
				text:text||"",
				speed:(1000/speed)||25,
				stop:!!stop,
				styleClass:styleClass,
				tag:tag||"span"
			});
		},
		start:function()
		{
			if(this._timeout===null)
			{
				this.domElement.classList.remove("complete","stop");
				this._run();
			}
		},
		_run:function()
		{
			this._timeout=null;
			if(this.parts.length>0)
			{
				let part=this.parts[0];
				if(!part.domElement)
				{
					part.domElement=document.createElement(part.tag);
					part.styleClass&&part.domElement.classList.add(part.styleClass);
					this.domElement.appendChild(part.domElement);
				}
				part.domElement.textContent+=part.text[part.domElement.textContent.length];
				if(part.domElement.textContent.length===part.text.length)
				{
					this.parts.shift();
					if(part.stop)
					{
						this.domElement.classList.add("stop");
						return;
					}
				}
				this._timeout=setTimeout(this._run, part.speed);
			}
			else
			{
				this.domElement.classList.add("complete");
			}
		},
		show:function(untillStop)
		{
			if(this._timeout!==null)
			{
				clearTimeout(this._timeout);
				this._timeout=null;
			}
			while(this.parts.length>0)
			{
				let part=this.parts[0];
				if(!part.domElement)
				{
					part.domElement=document.createElement(part.tag);
					part.domElement.classList.add(part.styleClass);
					this.domElement.appendChild(part.domElement);
				}
				part.domElement.textContent=part.text;
				this.parts.splice(0,1);
				if(untillStop&&part.stop)
				{
					this.domElement.classList.add("stop");
					return;
				}
			}
			this.domElement.classList.add("complete");
		},
		onButton:function(event)
		{
			if(event.value==1)
			{
				if(this._timeout===null)
				{
					if(this.parts.length===0)
					{
						this.fire("complete");
					}
					else
					{
						this.start();
					}
				}
				else
				{
					this.show(true);
				}
			}
		}
	});
	
	SMOD("GUI.TextBox",BOX);
	
})(Morgas,Morgas.setModule,Morgas.getModule);