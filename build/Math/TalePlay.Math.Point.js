(function(t,e,i){var s=this.TalePlay=this.TalePlay||{};s.Math=s.Math||{};var n=i("shortcut")({debug:"debug"}),a=s.Math.Point=t.Class({init:function(t,e){this.x=0,this.y=0,this.set(t,e)},set:function(t,e){return"object"==typeof t&&null!==t?(this.x=1*t.x,this.y=1*t.y):void 0!==t&&(this.x=1*t,void 0===e&&(e=t),this.y=1*e),(isNaN(this.x)||isNaN(this.y))&&n.debug(["Point became NaN",this],n.debug.LEVEL.WARNING),this},clone:function(t){return t||(t=new a),t.set(this.x,this.y),t},equals:function(t,e){return"object"==typeof t&&null!==t?this.x==t.x&&this.y==t.y:void 0!==t?(void 0===e&&(e=t),this.x==t&&this.y==e):!1},add:function(t,e){return"object"==typeof t&&null!==t?(this.x+=1*t.x,this.y+=1*t.y):void 0!==t&&(this.x+=1*t,void 0===e&&(e=t),this.y+=1*e),(isNaN(this.x)||isNaN(this.y))&&n.debug(["Point became NaN",this],n.debug.LEVEL.WARNING),this},sub:function(t,e){return"object"==typeof t&&null!==t?(this.x-=t.x,this.y-=t.y):void 0!==t&&(this.x-=t,void 0===e&&(e=t),this.y-=e),(isNaN(this.x)||isNaN(this.y))&&n.debug(["Point became NaN",this],n.debug.LEVEL.WARNING),this},mul:function(t,e){return"object"==typeof t&&null!==t?(this.x*=t.x,this.y*=t.y):void 0!==t&&(this.x*=t,void 0===e&&(e=t),this.y*=e),(isNaN(this.x)||isNaN(this.y))&&n.debug(["Point became NaN",this],n.debug.LEVEL.WARNING),this},div:function(t,e){return"object"==typeof t&&null!==t?(this.x/=t.x,this.y/=t.y):void 0!==t&&(this.x/=t,void 0===e&&(e=t),this.y/=e),(isNaN(this.x)||isNaN(this.y))&&n.debug(["Point became NaN",this],n.debug.LEVEL.WARNING),this},negate:function(){return this.x=-this.x,this.y=-this.y,this},invert:function(){return this.x=1/this.x,this.y=1/this.y,this},abs:function(){return this.x=Math.abs(this.x),this.y=Math.abs(this.y),this},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y)},normalize:function(){var t=this.length();return t&&this.div(t),this},getAngle:function(){if(0!==this.y||0!==this.x){var t=Math.asin(this.y/this.length());return this.x>=0?t=Math.PI/2-t:t+=1.5*Math.PI,t}return 0},getDirection4:function(){return 0===this.y&&0===this.x?0:Math.abs(this.y)>Math.abs(this.x)?this.y>0?1:3:this.x>0?2:4},getDirection8:function(){return 0===this.y&&0===this.x?0:1+Math.floor((4*(this.getAngle()/Math.PI)+.5)%8)},doMath:function(t,e,i){return"object"==typeof e&&null!==e?(this.x=t(this.x,1*e.x),this.y=t(this.y,1*e.y)):void 0!==e&&(this.x=t(this.x,1*e),void 0===i&&(i=1*e),this.y=t(this.y,i)),(isNaN(this.x)||isNaN(this.y))&&n.debug(["Point became NaN",this],n.debug.LEVEL.WARNING),this}});e("Math.Point",a)})(Morgas,Morgas.setModule,Morgas.getModule);