(function(t,e,s){var i=s("Layer"),n=s("shortcut")({rs:"rescope",Menu:"GUI.Menu",debug:"debug",download:"download"}),a=i.Persistance=t.Class(i,{init:function(t){t=t||{},this.superInit(i,{mode:i.Modes.LAST}),n.rs.all(["_update","_fillMenu"],this),this.createListener("load"),this.domElement.classList.add("Persistance"),this.dbConn=t.dbConn,this.saveClass=t.saveClass,this.saveData=t.saveData,this.menu=new n.Menu({type:t.type||n.Menu.Types.TABLE,styleClass:"center",active:t.active||0,loop:t.loop===!0,selectionType:n.Menu.SelectionTypes.NONE,converter:t.saveConverter}),this.add(this.menu),this.menu.addListener("select",this,"_onSelect"),this._update()},onController:function(t){if("buttonChanged"===t.type&&1==t.value)switch(t.index){case 1:this.GUIElements.length>1?this.GUIElements[1].setActive(3):this.destroy();break;case 2:i.prototype.onController.call(this,t)}else i.prototype.onController.call(this,t)},_update:function(){return this.dbConn.load(this.saveClass,{}).then(this._fillMenu),null},_fillMenu:function(t){this.menu.clear();for(var e=[],s=0;t.length>s;s++)e[t[s].getID()]=t[s];return e.push(null),this.menu.addAll(e),-1===this.menu.getActive().index&&this.menu.setActive(0),null},_onSelect:function(t){if(t.value){var e=new n.Menu({styleClass:["panel","center"],items:[this.saveData?"Save":"Load","Export","Delete","Cancel"],active:0,loop:!1,selectionType:n.Menu.SelectionTypes.NONE});e.addListener("select",this,"_onSubSelect"),this.add(e)}else this.saveData&&(this.saveData.setID(t.index),this.dbConn.save([this.saveData]).then(this._update))},_onSubSelect:function(t){switch(t.value){case"Load":this.fire("load",{save:this.menu.getActive().value});break;case"Save":this.saveData.setID(this.menu.getActive().index),this.dbConn.save([this.saveData]).then(this._update);break;case"Export":n.download(JSON.stringify(this.menu.getActive().value),"save.json","application/json");break;case"Delete":this.dbConn["delete"](this.saveClass,[this.menu.getActive().value]).then(this._update);break;case"Cancel":}t.source.destroy()}});e("Layer.Persistance",a)})(Morgas,Morgas.setModule,Morgas.getModule);