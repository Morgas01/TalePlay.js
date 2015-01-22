(function(µ,SMOD,GMOD){

    let GUI=GMOD("GUIElement");

    let ButtonStack=µ.Class(GUI,{
        init:function(param)
        {
            param=param||{};

            this.superInit(GUI,param.styleClass);
            this.addStyleClass("ButtonStack");
            this.createListener("hit miss finish");

            this.buttonItems=[];
            this.addItems(param.buttonItems);
        },
        addItems:function(items)
        {
            if(items)
            {
                items=[].concat(items);
                for (let i = 0; i < items.length; i++)
                {
                    this.buttonItems.push(items[i]);
                    this.domElement.appendChild(items[i].domElement);
                }
            }
        },
        onButton:function(event)
        {
            let item=this.buttonItems[0];
            if(event.value===1&&item)
            {
                if(item.button===event.index)
                {
                    this.fire("hit",{buttonItem:item});
                    this.buttonItems.splice(0,1);
                    item.domElement.remove();
                    if(this.buttonItems.length===0)
                    {
                        this.fire("finish");
                    }
                }
                else
                {
                    this.fire("miss",{buttonItem:null});
                }
            }
        }
    });
    ButtonStack.ButtonItem=function(button)
    {
        this.button=button;
        this.domElement=document.createElement("span");
        this.domElement.classList.add("ButtonItem");
        this.domElement.text=button;
        this.domElement.dataset.button=button;
    };
    SMOD("Minigames.ButtonStack",ButtonStack);
})(Morgas,Morgas.setModule,Morgas.getModule);