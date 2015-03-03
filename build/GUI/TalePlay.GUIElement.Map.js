(function(t,e,i){var s=i("GUIElement"),n=i("Map"),o=i("shortcut")({find:"find",rescope:"rescope",proxy:"proxy",Org:"Organizer",point:"Math.Point"}),a=function(t){return t instanceof s.Map.Cursor},r=function(t){return t.organizer.getFilter("cursors")};s.Map=t.Class(s,{init:function(t){t=t||{},this.superInit(s,t),this.createListener("trigger"),o.rescope.all(["_animateCursor"],this),this.map=new n({domElement:this.domElement,images:t.images,position:t.position}),this.map.gui=this,o.proxy("map",["setPosition","move","getImages","getSize","update"],this),this.organizer=(new o.Org).filter("cursors",a).filter("collision","collision").group("trigger","trigger.type"),this.threshold=new o.point,i("shortcut")({cursors:r},this,this,!0),this.movingCursors=new Map,this.setThreshold(t.threshold),t.cursors&&this.addAll(t.cursors),this.assignFilter=t.assignFilter||null,this.animationRquest=null,this.paused=t.paused===!0},addAll:function(t){t=[].concat(t);for(var e=0;t.length>e;e++)this.add(t[e])},add:function(t){this.map.add(t)&&this.organizer.add([t])},remove:function(t){this.map.remove(t)&&(this.organizer.remove(t),this.movingCursors["delete"](t))},getCursors:function(t){return o.find(this.cursors,t,!0)},updateSize:function(){this.map.calcSize(function(t){return!(t instanceof s.Map.Cursor)})},setThreshold:function(t,e){this.threshold.set(t,e)},setPaused:function(t){if(this.paused=!!t,null!==this.animationRquest&&this.paused)cancelAnimationFrame(this.animationRquest),this.animationRquest=null;else if(!this.paused){for(var e=Date.now(),i=this.movingCursors.entries(),s=i.next();!s.done;s=i.next()){var n=s.value[1];n.lastTime=e-performance.timing.navigationStart}this.animationRquest=requestAnimationFrame(this._animateCursor)}},isPaused:function(){return this.paused},collide:function(t){for(var e=[],i=this.organizer.getFilter("collision"),s=0;i.length>s;s++)i[s].rect.collide(t)&&e.push(i[s]);return e},trigger:function(t,e,i){for(var s=[],n=this.organizer.getGroupValue("trigger",t),o=0;n.length>o;o++)n[o].rect.contains(e,i)&&s.push(n[o]);return s},onAnalogStick:function(t){for(var e=0;this.cursors.length>e;e++)if(!this.assignFilter||this.assignFilter(t,this.cursors[e],e)){var i=this.movingCursors.get(this.cursors[e]);i||(i={direction:null,lastTime:Date.now()-performance.timing.navigationStart},this.movingCursors.set(this.cursors[e],i)),i.direction=t.analogStick.clonePoint().mul(1,-1)}null!==this.animationRquest||this.paused||(this.animationRquest=requestAnimationFrame(this._animateCursor))},_animateCursor:function(t){for(var e=this.movingCursors.entries(),i=e.next();!i.done;i=e.next()){var n=i.value[0],o=i.value[1],a=Math.min(t-o.lastTime,s.Map.MAX_TIME_DELAY);if(o.animation&&(o.direction=o.animation.step(a)),!o.direction.equals(0)&&n){n.domElement.classList.add("moving");for(var r=n.move(o.direction,a),l=this.trigger("step",n.getPosition()),h=0;l.length>h;h++)this.fire("trigger",{triggerType:"step",image:l[h],cursor:n,value:l[h].trigger.value,distance:r});o.lastTime=t;var d=n.getPosition(),c=this.map.getPosition();c.x-this.threshold.x>d.x?this.move(d.x-c.x+this.threshold.x,0):d.x>c.x+this.threshold.x&&this.move(d.x-c.x-this.threshold.x,0),c.y-this.threshold.y>d.y?this.move(0,d.y-c.y+this.threshold.y):d.y>c.y+this.threshold.y&&this.move(0,d.y-c.y-this.threshold.y)}else n.domElement.classList.remove("moving"),this.movingCursors["delete"](n)}this.animationRquest=this.movingCursors.size>0&&!this.paused?requestAnimationFrame(this._animateCursor):null},onButton:function(t){if(1===t.value&&!this.paused)for(var e=0;this.cursors.length>e;e++){var i=this.cursors[e];if(!this.assignFilter||this.assignFilter(t,i,e)){var s=this.trigger("activate",i.getPosition());if(0===s.length&&i.direction){var n=i.direction,a=new o.point(i.rect.position.x+(0===n.x?i.offset.x:n.x>0?i.rect.size.x:0),i.rect.position.y+(0===n.y?i.offset.y:0>n.y?i.rect.size.y:0));s=this.trigger("activate",a)}for(var r=0;s.length>r;r++)"activate"===s[r].trigger.type&&this.fire("trigger",{triggerType:"activate",image:s[r],cursor:this.cursors[e],value:s[r].trigger.value,controllerEvent:t})}}},playAnimation:function(t){var e=this.movingCursors.get(t.cursor);e||(e={direction:null,animation:null,lastTime:Date.now()-performance.timing.navigationStart},this.movingCursors.set(t.cursor,e)),e.animation=t,null!==this.animationRquest||this.paused||(this.animationRquest=requestAnimationFrame(this._animateCursor))},toJSON:function(){var t=this.map.toJSON();t.cursors=this.cursors.slice(),t.threshold=this.threshold.clone;for(var e=0;this.cursors.length>e;e++)t.images.splice(t.images.indexOf(this.cursors[e]),1);return t},fromJSON:function(t){this.movingCursors.clear();for(var e=0;t.images.length>e;e++)t.images[e]=(new s.Map.Image).fromJSON(t.images[e]);for(var e=0;t.cursors.length>e;e++)t.images.push((new s.Map.Cursor).fromJSON(t.cursors[e]));this.map.fromJSON(t),this.organizer.clear().add(t.images),this.threshold.set(t.threshold)}}),s.Map.MAX_TIME_DELAY=250,s.Map.Image=t.Class(n.Image,{init:function(t,e,i,s,o,a){this.superInit(n.Image,t,e,i,s),this.collision=!!o,this.trigger={type:null,value:null},a&&(this.trigger.type=a.type||null,this.trigger.value=a.value||null)},toJSON:function(){var t=n.Image.prototype.toJSON.call(this);return t.collision=this.collision,t.trigger=this.trigger,t},fromJSON:function(t){return n.Image.prototype.fromJSON.call(this,t),this.collision=t.collision,this.trigger=t.trigger,this}}),s.Map.Cursor=t.Class(s.Map.Image,{init:function(t,e,i,n,a,r,l,h){this.superInit(s.Map.Image,s.Map.Cursor.emptyImage,e,i,a,r,l),this.domElement.classList.add("cursor"),this.domElement.style.zIndex=s.Map.Cursor.zIndexOffset,Object.defineProperty(this,"backUrl",{enumerable:!0,get:function(){return this.domElement.style.backgroundImage},set:function(t){this.domElement.style.backgroundImage='url("'+t+'")'}}),this.urls=null,this.setUrls(t),this.offset=new o.point(this.rect.size).div(2),this.setOffset(n),this.speed=new o.point(200),this.setSpeed(h),this.direction=null,this.updateDirection()},update:function(){s.Map.Image.prototype.update.call(this)},updateDirection:function(){if(this.domElement.classList.remove("up","right","down","left"),this.direction){var t=this.direction.clone().mul(1,-1).getDirection8();this.backUrl=this.urls[t]?this.urls[t]:0!==t&&0===t%2&&this.urls[t-1]?this.urls[t-1]:this.urls[0],t>=1&&(2>=t||8===t)&&this.domElement.classList.add("up"),t>=2&&4>=t&&this.domElement.classList.add("right"),t>=4&&6>=t&&this.domElement.classList.add("down"),t>=6&&8>=t&&this.domElement.classList.add("left")}},setOffset:function(t,e){this.rect.position.add(this.offset),this.offset.set(t,e),this.rect.position.sub(this.offset),this.update()},setPosition:function(t,e){this.rect.position.set(t,e).sub(this.offset),this.update()},getPosition:function(){return this.rect.position.clone().add(this.offset)},setSpeed:function(t,e){this.speed.set(t,e)},setUrls:function(t){this.urls=[].concat(t),this.backUrl=this.urls[0],this.domElement&&this.updateDirection()},move:function(t,e){this.direction=t;var i=new o.point;if(this.map){var n=this.map.getSize();i.set(this.direction).mul(this.speed).mul(e/1e3);var a=this.rect.position.clone().add(this.offset);if(0>a.x+i.x?i.x=-a.x:a.x+i.x>n.x&&(i.x=n.x-a.x),0>a.y+i.y?i.y=-a.y:a.y+i.y>n.y&&(i.y=n.y-a.y),this.collision){var r=1,l=this.rect.clone();l.position.add(i);for(var h=this.map.gui.collide(l),d=0;h.length>d;d++){var c=h[d],u=null;c===this||this.rect.contains(c.rect)||c.rect.contains(this.rect)||(i.x>0&&c.rect.position.x>=this.rect.position.x+this.rect.size.x?u=Math.max(u,(c.rect.position.x-this.rect.position.x-this.rect.size.x)/i.x):0>i.x&&this.rect.position.x>=c.rect.position.x+c.rect.size.x&&(u=Math.max(u,(c.rect.position.x+c.rect.size.x-this.rect.position.x)/i.x)),i.y>0&&c.rect.position.y>=this.rect.position.y+this.rect.size.y?u=Math.max(u,(c.rect.position.y-this.rect.position.y-this.rect.size.y)/i.y):0>i.y&&this.rect.position.y>=c.rect.position.y+c.rect.size.y&&(u=Math.max(u,(c.rect.position.y+c.rect.size.y-this.rect.position.y)/i.y)),null!==u&&(r=Math.min(r,u)))}i.mul(r)}s.Map.Image.prototype.move.call(this,i)}return this.updateDirection(),i},toJSON:function(){var t=s.Map.Image.prototype.toJSON.call(this);return t.offset=this.offset,t.speed=this.speed,delete t.url,t.urls=this.urls.slice(),t},fromJSON:function(t){return t.url=s.Map.Cursor.emptyImage,s.Map.Image.prototype.fromJSON.call(this,t),this.offset.set(t.offset),this.speed.set(t.speed),this.setUrls(t.urls),this}}),s.Map.Cursor.emptyImage="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",s.Map.Cursor.zIndexOffset=100,s.Map.Cursor.Animation=t.Class({init:function(t){this.cursor=t,this.progress=0},step:function(){o.debug("Abstract GUI.Map.Cursor.Animation used",o.debug.LEVEL.WARNING)}}),s.Map.Cursor.Animation.Key=t.Class(s.Map.Cursor.Animation,{init:function(t,e){this.superInit(s.Map.Cursor.Animation,t),this.keys=e,this.cursor.setPosition(this.keys[0]),this.progress=1},step:function(t){if(this.keys[this.progress]){var e=this.cursor.getPosition().negate().add(this.keys[this.progress]),i=this.cursor.speed.clone().mul(t/1e3);if(i.x>Math.abs(e.x)&&i.y>Math.abs(e.y)&&this.keys.length>this.progress+1){var s=i.clone().sub(e.abs()).div(i);e=new o.point(this.keys[this.progress+1]).sub(this.keys[this.progress]).mul(s).add(this.keys[this.progress]),e=this.cursor.getPosition().negate().add(e),this.progress++}e.div(i);var n=Math.abs(e.x),a=Math.abs(e.y);return n>1||a>1?e.mul(1/(n>a?n:a)):e.set(0),e}return new o.point}}),e("GUI.Map",s.Map)})(Morgas,Morgas.setModule,Morgas.getModule);