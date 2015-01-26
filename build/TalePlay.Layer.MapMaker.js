(function(t,e,i){var s=i("Layer"),n=t.getModule("shortcut")({rs:"rescope",setIn:"setInputValues",getIn:"getInputValues",Map:"GUI.Map",Menu:"GUI.Menu"}),a=t.Class(s,{init:function(t,e,i,a){this.image=e,this.callback=i,this.scope=a||this,this.image.trigger=this.image.trigger||{value:""},this.superInit(s),n.rs.all(["onClick"],this),this.domElement.classList.add("overlay","imageLayer"),this.domElement.innerHTML='<div class="panel"><table><tr><td>Name</td><td><input type="text" name="name"></td></tr><tr><td>Position</td><td>X</td><td><input type="number" min="0" data-path="rect.position" name="x"></td><td>Y</td><td><input type="number" min="0"  data-path="rect.position" name="y"></td></tr><tr><td>Size</td><td>X</td><td><input type="number" min="0" data-path="rect.size" name="x"></td><td>Y</td><td><input type="number" min="0"  data-path="rect.size" name="y"></td></tr><tr><td>Collision</td><td><input type="checkbox" name="collision"></td></tr><tr><td>Trigger type</td><td><select data-path="trigger" name="type"><option>none</option><option value="activate">activate</option><option value="step">step</option><option value="move" disabled>move</option></select></td></tr><tr><td>Trigger value</td><td><input type="text" data-path="trigger" name="value"></td></tr></table><button data-action="ok">OK</button><button data-action="cancel">cancel</button>'+(e.map?'<button data-action="remove">remove</button>':"")+"</div>",n.setIn(this.domElement.querySelectorAll("[name]"),this.image),this.domElement.addEventListener("click",this.onClick,!1),t.addLayer(this),this.domElement.querySelector('[name="name"]').focus()},onClick:function(t){var e=t.target.dataset.action;if(e){switch(t.stopPropagation(),t.target.dataset.action){case"ok":n.getIn(this.domElement.querySelectorAll("[name]"),this.image);break;case"cancel":break;case"remove":}this.callback.call(this.scope,this.image,t.target.dataset.action),this.destroy()}},destroy:function(){this.image=this.callback=this.scope=void 0,s.prototype.destroy.call(this)}}),o=s.MapMaker=t.Class(s,{init:function(t){t=t||{},this.superInit(s),this.domElement.classList.add("MapMaker"),t.board&&t.board.addLayer(this),this.map=new n.Map({cursors:new n.Map.Cursor("../Images/cursor_target.svg",0,{x:100,y:100},{x:50,y:50})}),this.add(this.map),this.images=new n.Menu({styleClass:["images","panel"],type:n.Menu.Types.VERTICAL,selectionType:n.Menu.SelectionTypes.NONE,columns:1,converter:function(t){return'<img src="'+t.url+'">'},items:t.images}),this.add(this.images),this.images.addListener("select",this,"placeImage"),this.map.setPosition(0)},onController:function(t){var e=Math.min(t.index,1);switch(t.type){case"analogStickChanged":this.GUIElements[e].onAnalogStick(t);break;case"buttonChanged":0===e?this.selectImage(t):this.GUIElements[1].onButton(t)}},addImages:function(t){if(t){var e=[].concat(t).map(function(t){var e={url:void 0};if(t instanceof File){e.url=URL.createObjectURL(t),e.fileType=t.type;var i=new FileReader;i.onload=function(t){e.file=Array.prototype.slice.call(new Uint8Array(t.target.result,0,t.target.result.byteLength))},i.readAsArrayBuffer(t)}else e.url=t;return e});this.images.addAll(e)}},placeImage:function(t){new a(this.board,new n.Map.Image(t.value.url,0,100),function(t,e){"ok"===e&&(this.map.add(t),t.update(),this.map.updateSize()),this.board.focus()},this)},selectImage:function(){var t=this.map.cursors[0].getPosition(),e=this.map.getImages(function(e){return e!==this.map.cursors[0]&&e.rect.contains(t)})[0];e&&new a(this.board,e,function(t,e){"ok"===e?t.update():"remove"===e&&t.remove(),"cancel"!==e&&this.map.updateSize(),this.board.focus()},this)},toJSON:function(){return{map:this.map,images:this.images.menu.items}},fromJSON:function(t){for(var e=0;t.images.length>e;e++)if(t.images[e].file){var i=t.images[e].url;t.images[e].url=URL.createObjectURL(new Blob([new Uint8Array(t.images[e].file)],{type:t.images[e].fileType}));for(var s=t.map.map.images,n=0;s.length>n;n++)s[n].url===i&&(s[n].url=t.images[e].url)}return this.map.fromJSON(t.map),this.images.clear(),this.images.addAll(t.images),this}});e("MapMaker",o)})(Morgas,Morgas.setModule,Morgas.getModule);