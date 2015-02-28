(function(t,e){var i=this.TalePlay=this.TalePlay||{},s=i.Menu=t.Class({init:function(t){if(t=t||{},this.items=t.items||[],this.selectionType=t.selectionType||s.SelectionTypes.MULTI,this.loop=t.loop!==!1,this.selectedIndexs=[],this.disabledIndexs=[],this.active=-1,void 0!==t.active&&t.active>-1&&this.items.length>t.active&&(this.active=t.active),void 0!==t.selected)for(var e=0;t.selected.length>e;e++)this.addSelect(t.selected[e]);if(void 0!==t.disabled)for(var e=0;t.disabled.length>e;e++)this.setDisabled(t.disabled[e],!0)},addItem:function(t){return this.items.push(t),this},addAll:function(t){for(var e=0;t.length>e;e++)this.addItem(t[e]);return this},removeItem:function(t){var e=this.items.indexOf(t);if(-1!==e){this.items.splice(e,1);var i=this.selectedIndexs.indexOf(e);-1!==i&&this.selectedIndexs.splice(i,1);var s=this.disabledIndexs.indexOf(e);-1!==s&&this.disabledIndexs.splice(i,1),this.active>e?this.active--:this.active===e&&this.setActive(-1)}return e},getItem:function(t){return{index:t,value:this.items[t],active:this.active===t,selected:-1!==this.selectedIndexs.indexOf(t),disabled:-1!==this.disabledIndexs.indexOf(t)}},clearSelect:function(){this.selectedIndexs.length=0},isSelected:function(t){var e=this.items.indexOf(t);return-1===e&&(e=t),-1!==this.selectedIndexs.indexOf(e)},addSelect:function(t){if(this.selectionType===s.SelectionTypes.NONE)return!1;var e=this.items.indexOf(t);return-1===e&&(e=t),this.items.hasOwnProperty(e)&&-1===this.selectedIndexs.indexOf(e)?(this.selectionType===s.SelectionTypes.SINGLE?this.selectedIndexs[0]=e:this.selectedIndexs.push(e),!0):!1},removeSelect:function(t){var e=this.items.indexOf(t);return-1===e&&(e=t),e=this.selectedIndexs.indexOf(e),-1!==e?(this.selectedIndexs.splice(e,1),!0):!1},toggleSelect:function(t,e){if(this.selectionType===s.SelectionTypes.NONE)return!1;var i=e?t:this.items.indexOf(t);if(-1===i&&(i=t),this.items.hasOwnProperty(i)){var n=this.selectedIndexs.indexOf(i);return-1===n?(this.selectionType===s.SelectionTypes.SINGLE?this.selectedIndexs[0]=i:this.selectedIndexs.push(i),!0):(this.selectedIndexs.splice(n,1),!1)}return null},getActive:function(){return this.getItem(this.active)},setActive:function(t){var e=-1,i=this.items.length-1;t=t>=e?t>i?i:t:e,this.active!==t&&(this.active=t)},moveActive:function(t){var e=this.active+t;this.loop?(-1===this.active&&0>t&&e++,e%=this.items.length,0>e&&(e=this.items.length+e)):e=0>e?0:e,this.setActive(e)},toggleActive:function(){return this.toggleSelect(this.active)},getSelectedItems:function(){for(var t=[],e=0;this.selectedIndexs.length>e;e++)t.push(this.getItem(this.selectedIndexs[e]));return t},setDisabled:function(t){var e=this.items.indexOf(t);return-1===e&&(e=t),this.items.hasOwnProperty(e)&&-1===this.disabledIndexs.indexOf(e)?(this.disabledIndexs.push(e),!0):!1},isDisabled:function(t){var e=this.items.indexOf(t);return-1===e&&(e=t),-1!==this.disabledIndexs.indexOf(e)},getType:function(){return this.selectionType},setType:function(t){switch(t){case s.SelectionTypes.NONE:this.selectedIndexs.length=0;break;case s.SelectionTypes.SINGLE:this.selectedIndexs.length=1}this.selectionType=t},clear:function(){return this.items.length=this.selectedIndexs.lengt=this.disabledIndexs.length=0,this.active=-1,this}});s.SelectionTypes={NONE:1,SINGLE:2,MULTI:3},e("Menu",s)})(Morgas,Morgas.setModule,Morgas.getModule);