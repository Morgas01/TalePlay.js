(function(t,e,i){var s=i("GUIElement"),n=t.Class(s,{init:function(t){t=t||{},this.superInit(s,t.styleClass),this.addStyleClass("ButtonStack"),this.createListener("hit miss finish"),this.buttonItems=[],this.addItems(t.buttonItems)},addItems:function(t){if(t){t=[].concat(t);for(var e=0;t.length>e;e++)this.buttonItems.push(t[e]),this.domElement.appendChild(t[e].domElement)}},onButton:function(t){var e=this.buttonItems[0];1===t.value&&e&&(e.button===t.index?(this.fire("hit",{buttonItem:e}),this.buttonItems.splice(0,1),e.domElement.remove(),0===this.buttonItems.length&&this.fire("finish")):this.fire("miss",{buttonItem:null}))}});n.ButtonItem=function(t){this.button=t,this.domElement=document.createElement("span"),this.domElement.classList.add("ButtonItem"),this.domElement.text=t,this.domElement.dataset.button=t},e("Minigames.ButtonStack",n)})(Morgas,Morgas.setModule,Morgas.getModule);