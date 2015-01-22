(function(µ,SMOD,GMOD){
	
	let GUI=GMOD("GUIElement"),
	SC=GMOD("shortcut")({
		rescope:"rescope"
	});
	
	let TimeStroke=µ.Class(GUI,{
		init:function(param)
		{
			param=param||{};
			
			this.superInit(GUI,param.styleClass);
			this.addStyleClass("TimeStroke");
			SC.rescope.all(["_step"],this);
			this.createListener("hit miss finish");

			this.buttonItems=param.buttonItems||[];
			this.speed=param.speed||30;// %/s
			this.zoneWidth=param.zoneWidth||10;
			
			this.request=null;
			this.lastStep=null;
			this.time=0;
			
			this.domElement.innerHTML='<div class="zone" style="width:'+this.zoneWidth+'%;"></div>'
		},
		start:function(time){
			if(time!==undefined)
			{
				this.time=time;
			}
			if(this.request===null&&this.buttonItems.length>0)
			{
				this._step(Date.now()-performance.timing.navigationStart);
			}
		},
		pause:function(){
			cancelAnimationFrame(this.request);
			this.request=this.lastStep=null;
		},
		stop:function(){
			this.pause();
			for(let i=0;i<this.buttonItems.length;i++)
			{
				this.buttonItems[i].domElement.remove();
			}
			this.buttonItems.length=0;
		},
		onButton:function(event)
		{
			let item=this.buttonItems[0];
			if(event.value===1)
			{
				if(item&&item.active===true&&item.button===event.index)
				{
					this.fire("hit",{buttonItem:item});
					this.buttonItems.splice(0,1);
					item.domElement.remove();
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
			}
		},
		_step:function(stepTime)
		{
			this.request=requestAnimationFrame(this._step);
			if(stepTime&&this.lastStep)
			{
				this.time+=stepTime-this.lastStep;
			}
			let maxTime=this.time+100/this.speed*1000;
			
			for(let i=0;i<this.buttonItems.length&&this.buttonItems[i].time<maxTime;i++)
			{
				let item=this.buttonItems[i],
				distance=(item.time-this.time)*this.speed/1000;
				if(distance>0)
				{
					item.domElement.style.left=distance+"%";
					item.domElement.dataset.active=item.active=(distance<=this.zoneWidth);
					if(Array.prototype.indexOf.call(this.domElement.children,item.domElement)===-1)
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
		this.domElement.classList.add("ButtonItem");
		this.domElement.text=button;
		this.active=false;
	};
	SMOD("Minigames.TimeStroke",TimeStroke);
})(Morgas,Morgas.setModule,Morgas.getModule);