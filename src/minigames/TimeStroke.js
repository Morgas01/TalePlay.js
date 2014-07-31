(function(µ,SMOD,GMOD){
	
	var GUI=GMOD("GUIElement"),
	SC=GMOD("shortcut")({
		rescope:"rescope",
	});
	
	var TimeStroke=µ.Class(GUI,{
		init:function(param)
		{
			param=param||{};
			
			this.superInit(GUI,param.styleClass);
			this.addStyleClass("TimeStroke");
			SC.rescope.all(["_step"],this);
			this.createListener("hit miss finish");

			this.buttonItems=param.buttonItems||[];
			this.speed=param.speed||30;// %/s
			this.acceleration=param.acceleration||1; // %/s²
			this.zoneWidth=param.zoneWidth||10;
			
			this.request=null;
			this.lastStep=null;
			
			this.domElement.innerHtml='<div clas="zone" style="width:'+this.zoneWidth+'%;></div>'
		},
		start:function(){
			if(this.request!==null&&this.buttonItems.length>0)
			{
				this._step();
			}
		},
		pause:function(){
			cancelAnimationFrame(this.request);
			this.request=null;
		},
		stop:function(){
			this.pause();
			for(var i=0;i<this.buttonItems.length;i++)
			{
				this.buttonItems[i].domElement.remove();
			}
			this.buttonItems.length=0;
		},
		onButton:function(event)
		{
			var item=this.buttonItems[0]
			if(event.value===1&&item.active===true&&item.button===event.index)
			{
				this.fire("hit",{buttonItem:item});
				this.buttonItems.splice(0,1);
				if(this.buttonItems.length===0)
				{
					this.stop();
					this.fire("finish");
				}
			}
			else
			{
				this.fire("miss",{buttonItem:null});
			}
		},
		_step:function(stepTime)
		{
			this.request=requestAnimationFrame(this._step);
			var time=0;
			if(stepTime&&this.lastStep)
			{
				time=this.lastStep-stepTime;
			}
			var maxTime=time+100/this.speed*1000;
			
			for(var i=0;i<this.buttonItems.length&&this.buttonItems[0].time<maxTime;i++);
			{
				var item=this.buttonItems[i],
				distance=(maxTime-item.time)*this.speed/1000;
				if(distance>0)
				{
					item.domElement.style.left=distance+"%";
					item.domElement.dataset.active=item.active=(distance<=this.zoneWidth);
					if(Array.indexOf(this.domElement.children,item.domElement)===-1)
					{
						this.domElement.appendChild(item.domElement);
					}
				}
				else
				{
					this.fire("miss",{buttonItem:item});
					item.domElement.remove();
					this.buttonItems.splice(i, 1);
					i--;
					if(this.buttonItems.length===0)
					{
						this.stop();
						this.fire("finish");
					}
				}
			}
			
			this.lastStep=stepTime;
		}
	});
	TimeStroke.ButtonItem=function(button,time)
	{
		this.button=button;
		this.time=time;
		this.domElement=document.createElement("span");
		this.domElement.classlist.add("ButtonItem");
		this.domElement.text=button;
		this.active=false;
	};
	SMOD("Minigames.TimeStroke",TimeStroke);
})(Morgas,Morgas.setModule,Morgas.getModule);