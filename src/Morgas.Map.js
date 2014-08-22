(function(µ,SMOD,GMOD){

    var POINT=GMOD("Math.Point"),
    RECT=GMOD("Math.Rect"),
    SC=GMOD("shortcut")({
        find:"find"
    });
    var MAP=µ.Map=µ.Class(
    {
        init:function(images,position)
        {
            this.images=[];
            this.domElement=document.createElement("div");
            this.domElement.classList.add("Map");
            this.stage=document.createElement("div");
            this.stage.classList.add("stage");
            this.domElement.appendChild(this.stage);
            this.add(images);
            this.position=new POINT();
            this.setPosition(position);
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
        setPosition:function(position,y)
        {
            this.position.set(position,y);
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