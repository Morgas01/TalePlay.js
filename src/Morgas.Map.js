(function(µ,SMOD,GMOD){

    var SC=GMOD("shortcut")({
        find:"find",
        point:"Math.Point",
        RECT:"Math.Rect"
    });
    var MAP=µ.Map=µ.Class(
    {
        init:function(param)
        {
        	param=param||{};
            this.images=[];
            this.position=new SC.point();
            this.size=new SC.point(param.size);
            this.domElement=param.domElement||document.createElement("div");
            this.domElement.classList.add("Map");
            this.stage=document.createElement("div");
            this.stage.classList.add("stage");
            this.domElement.appendChild(this.stage);
            this.add(param.images);
            if(this.size.equals(0))
            {
            	this.calcSize();
            }
            this.setPosition(param.position);
        },
        add:function(images)
        {
            images=[].concat(images);
            for(var i=0;i<images.length;i++)
            {
                if(this.images.indexOf(images[i])===-1)
                {
                    this.images.push(images[i]);
                    this.stage.appendChild(images[i].domElement);
                    images[i].update();
                }
            }
        },
        remove:function(image)
        {
        	var index=this.images.indexOf(image);
        	if(index!==-1)
        	{
        		this.domElement.removeChild(image.domElement);
        		this.images.splice(index, 1);
        	}
        },
        setPosition:function(position,y)
        {
            this.position.set(position,y);
            var b=this.domElement.getBoundingClientRect();
            this.position.doMath(Math.max,0).doMath(Math.min,this.getSize());
            this.position.sub(b.width/2,b.height/2);
            this.update(true);
        },
        getPosition:function()
        {
            var b=this.domElement.getBoundingClientRect();
            return this.position.clone().add(b.width/2, b.height/2);
        },
        move:function(numberOrPoint,y)
        {
            this.position.add(numberOrPoint,y);
            var b=this.domElement.getBoundingClientRect(),
            bP={x:-b.width/2,y:-b.height/2};
            this.position.doMath(Math.max,bP).doMath(Math.min,this.getSize().clone().add(bP));
            this.update(true);
        },
        update:function(noimages)
        {
            this.stage.style.top=-this.position.y+"px";
            this.stage.style.left=-this.position.x+"px";
            for(var i=0;!noimages&&i<this.images.length;i++)
            {
                this.images[i].update();
            }
        },
        getImages:function(pattern)
        {
            return SC.find(this.images,pattern,true);
        },
        getSize:function()
        {
        	return this.size;
        },
        setSize:function(numberOrPoint,y)
        {
        	this.size.set(numberOrPoint,y);
        },
        calcSize:function(filter)
        {
        	this.size.set(0);
        	for(var i=0;i<this.images.length;i++)
        	{
        		if(!filter||filter(this.images[i]))
        		{
        			this.size.doMath(Math.max,this.images[i].rect.position.clone().add(this.images[i].rect.size));
        		}
        	}
        },
        collide:function(rect)
        {
        	var rtn=[],
        	cImages=SC.find(this.images,{collision:true},true);
        	for(var i=0;i<cImages.length;i++)
        	{
        		if(cImages[i].rect.collide(rect))
        		{
        			rtn.push(cImages[i]);
        		}
        	}
        	return rtn;
        }
    });
    MAP.Image= µ.Class(
    {
        init:function(url,position,size,name,collision,trigger)
        {
        	this.rect=new SC.RECT(position,size);
            this.domElement=document.createElement("img");
            Object.defineProperty(this,"url",{
            	enumerable:true,
            	get:function(){return this.domElement.src;},
            	set:function(url){this.domElement.src=url;}
            });
            this.url=url;
            Object.defineProperty(this,"name",{
            	enumerable:true,
            	get:function(){return this.domElement.dataset.name;},
            	set:function(name){this.domElement.dataset.name=name;}
            });
            this.name=name||"";
            this.collision=!!collision;
            this.trigger=trigger||null;
        },
        update:function()
        {
            this.domElement.style.top=this.rect.position.y+"px";
            this.domElement.style.left=this.rect.position.x+"px";
            this.domElement.style.height=this.rect.size.y+"px";
            this.domElement.style.width=this.rect.size.x+"px";
            
            this.domElement.style.zIndex=Math.floor(this.rect.position.y);
        },
        setPosition:function(numberOrPoint,y)
        {
        	this.rect.setPosition(numberOrPoint,y);
            this.update();
        },
        move:function(numberOrPoint,y)
        {
            this.rect.position.add(numberOrPoint,y);
            this.update();
        }
    });
    SMOD("Map",MAP);
})(Morgas,Morgas.setModule,Morgas.getModule);