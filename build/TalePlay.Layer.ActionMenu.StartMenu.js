(function(t,e,i){var s=i("Layer.ActionMenu"),n=i("shortcut")({manager:"GUI.ControllerManager",rj:"Request.json",debug:"debug"}),a=s.StartMenu=t.Class(s,{init:function(t){t=t||{},this.superInit(s,{styleClass:["panel","center"],actions:[{text:"New Game",action:"newGame",url:t.newGameUrl},{text:"Controllers",action:"openControllerManager",controllerLayout:t.controllerLayout||{}},{text:"Load",action:"loadSave"},{text:"import from File",action:"fileImport"}]}),this.domElement.classList.add("StartMenu"),this.createListener("start"),this.persistanceLayer="function"==typeof t.persistanceLayer?t.persistanceLayer:i(t.persistanceLayer||"Layer.Persistance"),this.dbConn=t.dbConn,this.saveClass=t.saveClass,this.saveConverter=t.saveConverter},onController:function(t){if("buttonChanged"===t.type&&1==t.value)switch(t.index){case 1:this.menu.setActive(0);break;case 2:s.prototype.onController.call(this,t)}else s.prototype.onController.call(this,t)},newGame:function(t){n.rj(t.url,this).then(function(t,e){var i=new e.saveClass;i.fromJSON(t),e.fire("start",{save:i})},function(t){n.debug(["could not load new game: ",t],n.debug.LEVEL.ERROR)})},openControllerManager:function(t){var e={styleClass:["panel","overlay"],buttons:t.controllerLayout.buttons,analogSticks:t.controllerLayout.analogSticks,dbConn:this.dbConn},i=new n.manager(e);this.add(i),i.update("controllers")},loadSave:function(){var t=new this.persistanceLayer({dbConn:this.dbConn,saveClass:this.saveClass,saveConverter:this.saveConverter});t.addListener("load:once",this,function(t){this.fire("start",{save:t.save}),t.source.destroy()}),this.board.addLayer(t)},fileImport:function(){}});e("StartMenu",a)})(Morgas,Morgas.setModule,Morgas.getModule);