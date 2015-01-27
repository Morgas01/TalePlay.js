(function(t,e,i){var n=window.TalePlay=window.TalePlay||{},s=i("Listeners"),o=i("Math.Point"),a=t.shortcut({mapping:"Controller.Mapping"}),r=n.Controller=t.Class(s,{init:function(t,e){this.superInit(s),this.disabled=!1,this.analogSticks={},this.buttons={},this.mapping=null,this.setMapping(t,e),this.createListener("changed analogStickChanged buttonChanged")},getMapping:function(){return this.mapping},setMapping:function(t,e){t?(t instanceof a.mapping||(t=new a.mapping({data:t,name:e||"default"})),this.mapping=t):this.mapping=null},getAnalogStick:function(t){return void 0===this.analogSticks[t]&&(this.analogSticks[t]=new r.AnalogStick),this.analogSticks[t]},setButton:function(t){var e=!1,i=void 0;if(this.mapping){var n={};i={};for(var s in t){var o=this.mapping.getButtonAxisMapping(s);void 0!==o?i[Math.abs(o)]=this.mapping.convertAxisValue(o,t[s]):n[this.mapping.getButtonMapping(s)]=t[s]}t=n}for(var a in t){var r=t[a];if(void 0===this.buttons[a]||this.buttons[a]!==r){var l=this.buttons[a]||0;this.buttons[a]=r,this.fire("buttonChanged",{index:1*a,value:r,oldValue:l}),e=!0}}return i&&(e=this.setAxis(i,!0)||e),e&&this.fire("changed"),e},setAxis:function(t,e){var i=!1;if(this.mapping&&!e){var n={};for(var s in t){var o=this.mapping.getAxisMapping(s);n[Math.abs(o)]=this.mapping.convertAxisValue(o,t[s])}t=n}for(var a=Object.keys(t);a.length>0;){var r=a.shift(),l=void 0,h=void 0;o=-1;var d=this.getAnalogStick(r>>1);0==r%2?(l=t[r],h=t[1*r+1]||d.y,o=a.indexOf(1*r+1),-1!==o&&a.splice(o,1)):(l=t[r-1]||d.x,h=t[r],o=a.indexOf(r-1),-1!==o&&a.splice(o,1)),d.set(l,h),d.hasChanged()&&(i=!0,this.fire("analogStickChanged",{index:r>>1,analogStick:d}))}return i&&!e&&this.fire("changed"),i},set:function(t,e){this.setButton(t),this.setAxis(e)},setDisabled:function(t){this.disabled=t===!0;for(var e in this.listeners)this.listeners[e].setDisabled(this.disabled)},destroy:function(){},toString:function(){return JSON.stringify(this)},toJSON:function(){return{buttons:this.buttons,analogSticks:this.analogSticks}}});r.AnalogStick=t.Class(o,{init:function(t,e){this.old={x:0,y:0},this.superInit(o,t,e)},clone:function(t){return t||(t=new r.AnalogStick),o.prototype.clone.call(this,t),t.old.x=this.old.x,t.old.y=this.old.y,t},clonePoint:function(){return o.prototype.clone.call(this)},pushOld:function(){return this.old.x=this.x,this.old.y=this.y,this},hasChanged:function(){return!this.equals(this.old)},getDifference:function(){return new o(this.old).sub(this)},setComponent:function(t,e){return this.pushOld(),0===t%2?this.x=e:this.y=e,this},set:function(t,e){this.pushOld(),o.prototype.set.call(this,t,e)},getDirection4:function(){return 0===this.y&&0===this.x?0:Math.abs(this.y)>Math.abs(this.x)?this.y>0?1:3:this.x>0?2:4},getDirection8:function(){return 0===this.y&&0===this.x?0:1+Math.floor((this.getAngle()+Math.PI/8)/(Math.PI/4))}}),e("Controller",r)})(Morgas,Morgas.setModule,Morgas.getModule);