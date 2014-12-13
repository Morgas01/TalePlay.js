(function(µ,SMOD,GMOD){

    var TALE=window.TalePlay=window.TalePlay||{};

    var SC=GMOD("shortcut")({
        find:"find",
        Node:"NodePatch",
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
                return true;
            }
            return false;
        },
        remove:function(image)
        {
        	if(this.nodePatch.removeChild(image))
        	{
        		this.stage.removeChild(image.domElement);
        		return true;
        	}
        	return false;
        },
        setPosition:function(position,y)
        {
            this.position.set(position,y);
            this.position.doMath(Math.max,0).doMath(Math.min,this.getSize());
            this.update(true);
        },
        getPosition:function()
        {
            return this.position;
        },
        move:function(numberOrPoint,y)
        {
            this.position.add(numberOrPoint,y);
            this.position.doMath(Math.max,0).doMath(Math.min,this.getSize());
            this.update(true);
        },
        update:function(noimages)
        {
        	var pos=this.position.clone();
            var b=this.domElement.getBoundingClientRect();
            
            pos.sub(b.width/2,b.height/2);
            
            this.stage.style.top=-pos.y+"px";
            this.stage.style.left=-pos.x+"px";
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
        empty:function()
        {
        	while(this.images.length>0)
			{
				this.remove(this.images[0]);
			}
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
			this.empty();
			for(var i=0;i<json.images.length;i++)
			{
				var image=json.images[i];
				if(!(image instanceof MAP.Image))
				{
					image=new MAP.Image().fromJSON(image);
				}
				this.add(image);
			}
			this.size.set(json.size);
			if(this.size.equals(0))
            {
            	this.calcSize();
            }
			this.setPosition(json.position);
			return this;
		}
    });
    MAP.Image= µ.Class(
    {
        init:function(url,position,size,name)
        {
        	new SC.Node(this,{
        		parent:"map",
        		remove:"remove"
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
        },
        update:function()
        {
            this.domElement.style.top=this.rect.position.y+"px";
            this.domElement.style.left=this.rect.position.x+"px";
            this.domElement.style.height=this.rect.size.y+"px";
            this.domElement.style.width=this.rect.size.x+"px";
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
				name:this.name
			};
		},
		fromJSON:function(json)
		{
			this.url=json.url;
			this.rect.setPosition(json.position);
			this.rect.setSize(json.size);
			this.name=json.name;
			
			this.update();
			
			return this;
		}
    });
    SMOD("Map",MAP);
})(Morgas,Morgas.setModule,Morgas.getModule);