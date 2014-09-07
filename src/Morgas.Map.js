(function(µ,SMOD,GMOD){

    var RECT=GMOD("Math.Rect"),
    SC=GMOD("shortcut")({
        find:"find",
        point:"Math.Point"
    });
    var MAP=µ.Map=µ.Class(
    {
        init:function(param)
        {
        	param=param||{};
            this.images=[];
            this.domElement=document.createElement("div");
            this.domElement.classList.add("Map");
            this.stage=param.domElement||document.createElement("div");
            this.stage.classList.add("stage");
            this.domElement.appendChild(this.stage);
            this.add(param.images);
            this.position=new SC.point();
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
        move:function(numberOrPoint,y)
        {
            thisl.position.add(numberOrPoint,y);
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
        	var size=new SC.point();
        	for(var i=0;i<this.images.length;i++)
        	{
        		size.doMath(Math.max,this.images[i].position.clone().add(this.images[i].size));
        	}
        	return size;
        }
    });
    MAP.Image= µ.Class(RECT,
    {
        init:function(url,position,size,name)
        {
            this.superInit(RECT,position,size);
            this.domElement=document.createElement("img");
            this.domElement.setAttribute("src",url);
            this.name=name;
        },
        update:function()
        {
            this.domElement.style.top=this.position.y+"px";
            this.domElement.style.left=this.position.x+"px";
            this.domElement.style.height=this.size.y+"px";
            this.domElement.style.width=this.size.x+"px";
        },
        setPosition:function(numberOrPoint,y)
        {
            this.position.set(numberOrPoint,y);
            this.update();
        },
        move:function(numberOrPoint,y)
        {
            thisl.position.add(numberOrPoint,y);
            this.update();
        }
    });
    SMOD("Map",MAP);
})(Morgas,Morgas.setModule,Morgas.getModule);