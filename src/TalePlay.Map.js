(function(µ,SMOD,GMOD){

    var TALE=window.TalePlay=window.TalePlay||{};

    var SC=GMOD("shortcut")({
        find:"find",
        Node:"NodePatch",
        Org:"Organizer",
        point:"Math.Point",
        RECT:"Math.Rect"
    });
    var MAP=TALE.Map=µ.Class(
    {
        init:function(param)
        {
        	this.nodePatch=new SC.Node(this,{
        		children:"images",
        		addChild:"add",
        		removeChild:"remove",
        	});
        	this.organizer=new SC.Org()
        	.filter("collision","collision")
        	.group("trigger","trigger.type");
        	
        	param=param||{};
        	
            this.position=new SC.point();
            this.size=new SC.point(param.size);
            this.domElement=param.domElement||document.createElement("div");
            this.domElement.classList.add("Map");
            this.stage=document.createElement("div");
            this.stage.classList.add("stage");
            this.domElement.appendChild(this.stage);
            param.images&&this.addAll(param.images);
            if(this.size.equals(0))
            {
            	this.calcSize();
            }
            this.setPosition(param.position);
        },
        addAll:function(images)
        {
        	images=[].concat(images);
            for(var i=0;i<images.length;i++)
            {
                this.add(images[i]);
            }
        },
        add:function(image)
        {
            if(this.nodePatch.addChild(image))
            {
                this.stage.appendChild(image.domElement);
                image.update();
                this.organizer.add([image]);
            }
        },
        remove:function(image)
        {
        	if(this.nodePatch.removeChild(image))
        	{
        		this.stage.removeChild(image.domElement);
        		this.organizer.remove(image);
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
        	cImages=this.organizer.getFilter("collision");
        	for(var i=0;i<cImages.length;i++)
        	{
        		if(cImages[i].rect.collide(rect))
        		{
        			rtn.push(cImages[i]);
        		}
        	}
        	return rtn;
        },
        trigger:function(type,numberOrPoint,y)
        {
        	var rtn=[],
        	tImages=this.organizer.getGroupValue("trigger",type);
        	for(var i=0;i<tImages.length;i++)
        	{
        		if(tImages[i].rect.contains(numberOrPoint,y))
        		{
        			rtn.push(tImages[i]);
        		}
        	}
        	return rtn;
        },
		toJSON:function()
		{
			return {
				images:this.images.slice(),
				position:this.position.clone(),
				size:this.size.clone()
			};
		},
		fromJSON:function(json)
		{
			while(this.images.length>0)
			{
				this.remove(this.images[0]);
			}
			for(var i=0;i<json.images.length;i++)
			{
				this.add(new MAP.Image().fromJSON(json.images[i]));
			}
			this.position.set(json.position);
			this.size.set(json.size);
			if(this.size.equals(0))
            {
            	this.calcSize();
            }
			return this;
		}
    });
    MAP.Image= µ.Class(
    {
        init:function(url,position,size,name,collision,trigger)
        {
        	new SC.Node(this,{
        		parent:"map"
        	});
        	
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
    	getPosition:function()
    	{
    		return this.rect.position.clone();
    	},
        setPosition:function(numberOrPoint,y)
        {
        	this.move(this.getPosition().negate().add(numberOrPoint,y));
            this.update();
        },
        move:function(numberOrPoint,y)
        {
            this.rect.position.add(numberOrPoint,y);
            this.update();
        },
		toJSON:function()
		{
			return {
				url:this.url,
				position:this.rect.position,
				size:this.rect.size,
				name:this.name,
				collision:this.collision,
				trigger:this.trigger
			};
		},
		fromJSON:function(json)
		{
			this.url=json.url;
			this.rect.setPosition(json.position);
			this.rect.setSize(json.size);
			this.name=json.name;
			this.collision=json.collision;
			this.trigger=json.trigger;
			
			return this;
		}
    });
    SMOD("Map",MAP);
})(Morgas,Morgas.setModule,Morgas.getModule);