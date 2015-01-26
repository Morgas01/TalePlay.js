(function(e,t,o,r){var s=window.TalePlay=window.TalePlay||{},l=o("Listeners"),n=o("shortcut")({node:"NodePatch"}),a=s.Layer=e.Class(l,{init:function(e){this.superInit(l),e=e||{},this.nodePatch=new n.node(this,{parent:"board",children:"GUIElements",addChild:"add",removeChild:"remove",hasChild:"has"},!0),this.mode=e.mode||a.Modes.ALL,this.domElement=document.createElement("div"),this.domElement.classList.add("Layer"),this.focused=null},onController:function(e){switch(this.mode){case a.Modes.ALL:default:for(var t=0;this.GUIElements.length>t;t++)this.GUIElements[t][a._CONTROLLER_EVENT_MAP[e.type]](e);break;case a.Modes.FIRST:this.GUIElements.length>0&&this.GUIElements[0][a._CONTROLLER_EVENT_MAP[e.type]](e);break;case a.Modes.LAST:this.GUIElements.length>0&&this.GUIElements[this.GUIElements.length-1][a._CONTROLLER_EVENT_MAP[e.type]](e);break;case a.Modes.FOCUSED:this.focused&&this.focused[a._CONTROLLER_EVENT_MAP[e.type]](e)}},add:function(e,t){return r("GUIElement")&&e instanceof o("GUIElement")&&this.nodePatch.addChild(e)?("string"==typeof t&&(t=this.domElement.querySelector(t)),t||(t=this.domElement),t.appendChild(e.domElement),!0):!1},remove:function(e){return this.nodePatch.removeChild(e)?(e.domElement.remove(),e.removeListener("all",this),!0):!1},destroy:function(){this.nodePatch.remove();for(var e=this.GUIElements.slice(),t=0;e.length>t;t++)e[t].destroy();l.prototype.destroy.call(this)}});a.Modes={ALL:0,FIRST:1,LAST:2,FOCUSED:3},a._CONTROLLER_EVENT_MAP={analogStickChanged:"onAnalogStick",buttonChanged:"onButton"},t("Layer",a)})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);