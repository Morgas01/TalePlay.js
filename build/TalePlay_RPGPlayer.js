//Morgas/src/Morgas.js
(function(e){Morgas={version:"0.3"},µ=Morgas,µ.revert=function(){return µ=e},µ.constantFunctions={ndef:function(){return void 0},nul:function(){return null},f:function(){return!1},t:function(){return!0},zero:function(){return 0},"boolean":function(e){return!!e}},function(){var e={};µ.setModule=function(t,n){return e[t]&&µ.debug("module "+t+" is overwritten",2),e[t]=n},µ.hasModule=function(t){return!!e[t]},µ.getModule=function(t){return e[t]||µ.debug("module "+t+" is not defined\n use µ.hasModule to check for existence",0),e[t]}}();var t=µ.setModule,n=µ.getModule,o=µ.hasModule;µ.debug=function(e,t){t||(t=0),µ.debug.verbose!==!1&&µ.debug.verbose>=t&&("function"==typeof e&&(e=e()),µ.debug.out(e,t))},t("debug",µ.debug),µ.debug.LEVEL={OFF:!1,ERROR:0,WARNING:1,INFO:2,DEBUG:3},µ.debug.verbose=µ.debug.LEVEL.WARNING,µ.getDebug=function(e){µ.debug.verbose=e},µ.setDebug=function(e){µ.debug.verbose=e},µ.debug.out=function(e,t){switch(t){case 0:console.error(e);break;case 1:console.warn(e);break;case 2:console.info(e);break;case 3:default:console.log(e)}},µ.shortcut=function(e,t,u,r){t||(t={});for(var i in e)(function(e,i){var s=void 0;Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:function(){return(null==s||r)&&("function"==typeof e?s=e(u):u&&o("goPath")?s=n("goPath")(u,e):o(e)?s=n(e):n("debug")("shortcut: could not evaluate "+e)),s}})})(e[i],i);return t},t("shortcut",µ.shortcut);var u=µ.Class=function(e,t){var u=function(){this.init.apply(this,arguments),o("Listeners")&&this instanceof n("Listeners")&&this.setState(".created")};"function"!=typeof e&&(t=e,e=r),e&&(u.prototype=Object.create(e.prototype),u.prototype.constructor=u);for(var i in t)u.prototype[i]=t[i];return u};t("Class",u);var r=µ.BaseClass=u({init:function(){},superInit:function(e){e.prototype.init.apply(this,[].slice.call(arguments,1))},superInitApply:function(e,t){this.superInit.apply(this,[e].concat([].slice.call(t)))}});t("Base",r)})(this.µ);
//TalePlay.Board.js
(function(e,t,r,l){var o=this.TalePlay=this.TalePlay||{},s=r("shortcut")({rs:"rescope",node:"NodePatch"}),i="analogStickChanged buttonChanged",a=o.Board=e.Class({init:function(e){this.controllers=[],this.nodePatch=new s.node(this,{children:"layers",addChild:"addLayer",removeChild:"removeLayer",hasChild:"hasLayer"}),this.disabled=!1,this.playerDisabled={},s.rs.all(["focus"],this),this.domElement=document.createElement("div"),this.domElement.classList.add("Board"),this.keyTrigger=document.createElement("textarea"),this.domElement.appendChild(this.keyTrigger),this.keyTrigger.classList.add("keyTrigger"),this.keyTrigger.style.position="absolute",this.keyTrigger.style.zIndex="-1",this.keyTrigger.style.height=this.keyTrigger.style.width="0",this.keyTrigger.style.resize="none",this.domElement.addEventListener("click",this.focus,!1),e&&e.appendChild(this.domElement)},setDisabled:function(){},setPlayerDisabled:function(){},addController:function(e,t){this.removeController(e),this.controllers.push({controller:e,player:t||1}),e.addListener(i,this,"_ctrlCallback"),l("Controller.Keyboard")&&e instanceof r("Controller.Keyboard")&&e.setDomElement(this.keyTrigger)},removeController:function(e){for(var t=this.controllers.length-1;t>=0;t--)if(this.controllers[t].controller===e)return e.removeListener(i,this,"_ctrlCallback"),l("Controller.Keyboard")&&e instanceof r("Controller.Keyboard")&&e.setDomElement(),this.controllers.splice(t,1),!0;return!1},setControllerDisabled:function(){},_ctrlCallback:function(e){if(!this.disabled&&this.layers.length>0){Array.prototype.slice.call(arguments,0),e.player=null;for(var t=this.controllers.length-1;t>=0;t--)if(this.controllers[t].controller===e.source){e.player=t;break}this.playerDisabled[e.player]||this.layers[this.layers.length-1].onController(e)}},addLayer:function(e){return l("Layer")&&e instanceof r("Layer")&&this.nodePatch.addChild(e)?(this.domElement.appendChild(e.domElement),!0):!1},removeLayer:function(e){return this.nodePatch.removeChild(e)?(e.domElement.remove(),!0):!1},focus:function(e){(!e||"INPUT"!==e.target.tagName&&"SELECT"!==e.target.tagName&&"TEXTAREA"!==e.target.tagName)&&this.keyTrigger.focus()}});t("Board",a)})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);
//Morgas/src/Morgas.Listeners.js
(function(µ,SMOD,GMOD){
	
	/**Listener Class
	 * Holds Arrays of functions to fire or fire once when "fire" is called
	 * When fired and a listening function returns false firing is aborted
	 * When added a type can be passed:
	 * 		"first" function gets prepended
	 * 		"last" function gets appended (default)
	 * 		"once" function is removed after call 
	 * 			(will only be called when "normal" listeners haven't abort firing.
	 * 			cant abort other "once" listening functions)
	 *  
	 * Can be disabled
	*/
	var LISTENER=µ.Listener=µ.Class(
	{
		init:function ListenerInit()
		{
			this.listeners=new Map(); //TODO use WeakMap when its capable of iterations
			this.disabled=false;
		},
		addListener:function addListener(fn,scope,type)
		{
            var fnType=typeof fn;
			if(fnType==="function"||fnType==="string")
			{
                scope=scope||this;
                var entry=null;
                if(this.listeners.has(scope))
                {
                    entry=this.listeners.get(scope);
                    if(entry.first.has(fn)||entry.normal.has(fn)||entry.last.has(fn)||entry.once.has(fn))
                    {
                        return null;//already listens
                    }
                }
                else
                {
                    entry={first:new Set(),normal:new Set(),last:new Set(),once:new Set()};
                    this.listeners.set(scope,entry);
                }
				if(type)
				{
					type=type.toLowerCase();
				}
				switch(type)
				{
					case "first":
						entry.first.add(fn);
						break;
                    default:
                        entry.normal.add(fn);
                        break;
					case "last":
						entry.last.add(fn);
						break;
					case "once":
						entry.once.add(fn);
                        break;
				}
				return fn;
			}
			return null;//no function
		},
        addListeners:function addListeners(fns,scope,type)
        {
            fns=[].concat(fns);
            var rtn=[];
            for(var i=0;i<fns.length;i++)
            {
                rtn.push(this.addListener(fns[i],scope,type));
            }
            return rtn;
        },
		removeListener:function removeListener(fn,scope)
		{
            //TODO remove fn from all scopes
			var timesFound=0;
            var entry=this.listeners.get(scope);
            if(entry)
            {
                if(typeof fn=="string"&&fn.toLowerCase()=="all")
                {
                    timesFound=entry.first.size+entry.normal.size+entry.last.size+entry.once.size;
                    this.listeners.delete(scope);
                }
                else
                {
                    if(entry.first.delete(fn))
                    {
                        timesFound++;
                    }
                    if(entry.normal.delete(fn))
                    {
                        timesFound++;
                    }
                    if(entry.last.delete(fn))
                    {
                        timesFound++;
                    }
                    if(entry.once.delete(fn))
                    {
                        timesFound++;
                    }
                    if(entry.first.size===0&&entry.normal.size===0&&entry.last.size===0&&entry.once.size===0)
                    {
                        this.listeners.delete(scope);
                    }
                }
                return timesFound;
            }
            else if (typeof fn=="string"&&fn.toLowerCase()=="all"&&scope===undefined)
            {
            	this.listeners.clear();
            	return -1;//unknown count
            }
            return null;
		},
		removeListeners:function removeListeners(fns,scope)
		{
			fns=[].concat(fns);
			var rtn=[];
			if(fns.length==0)fns.push("all");
			for(var i=0;i<fns.length;i++)
			{
				rtn.push(this.removeListener(fns[i],scope));
			}
			return rtn;
		},
		fire:function fire(source,event)
		{
			event=event||{};
			event.source=source;
			if(!this.disabled)
			{
				var run=true;
                for(var [scope,entry] of this.listeners)
                {
                    var it=entry.first.values();
                    var step=undefined;
                    var value=undefined;
                    while(run&&(step=it.next(),value=step.value,!step.done))
                    {
                        if(typeof value==="string")
                        {
                            value=scope[value];
                        }
                        run=false!==value.call(scope,event);
                    }
                    it=entry.normal.values();
                    while(run&&(step=it.next(),value=step.value,!step.done))
                    {
                        if(typeof value==="string")
                        {
                            value=scope[value];
                        }
                        run=false!==value.call(scope,event);
                    }
                    it=entry.last.values();
                    while(run&&(step=it.next(),value=step.value,!step.done))
                    {
                        if(typeof value==="string")
                        {
                            value=scope[value];
                        }
                        run=false!==value.call(scope,event);
                    }
                    it=entry.once.values();
                    while((step=it.next(),value=step.value,!step.done))
                    {
                        if(typeof value==="string")
                        {
                            value=scope[value];
                        }
                        value.call(scope,event);
                    }
                    entry.once.clear();
                    if(entry.first.size===0&&entry.normal.size===0&&entry.last.size===0)
                    {
                        this.listeners["delete"](scope);
                    }
                }
				return run;
			}
			return null;
		},
		setDisabled:function setDisabled(bool){this.disabled=bool===true;},
		isDisabled:function isDisabled(){return this.disabled;}
	});
	SMOD("Listener",LISTENER);
	
	/** StateListener Class
	 * Listener that fires only when "setState" is called
	 * When state is set it fires added listening functions with last arguments immediately
	 * reset trough "resetState";
	 */
	var STATELISTENER=LISTENER.StateListener=µ.Class(LISTENER,
	{
		init:function StateListenerInit(param)
		{
			this.superInit(LISTENER);
			this.state=param.state===true;
			this.stateDisabled=false;
			this.lastEvent=null;
		},
		setDisabled:function setDisabled(bool){this.stateDisabled=bool===true;},
		isDisabled:function isDisabled(){return this.stateDisabled;},
		setState:function setState(source,event)
		{
            event=event||{};
            event.source=source;

			this.state=true;
			this.lastEvent=event;

			var rtn=false;
			if(!this.stateDisabled)
			{
				this.disabled=false;
				rtn=this.fire.apply(this,this.lastEvent);
				this.disabled=true
			}
			return rtn;
		},
		resetState:function resetState(){this.state=false;},
		getState:function getState(){return this.state},
		addListener:function addListener(fn,scope,type)
		{
			var doFire=this.state&&!this.stateDisabled;
			if(doFire)
			{
				fn.apply(scope,this.lastEvent);
			}
			if(!(doFire&&typeof type=="string"&&type.toLowerCase()=="once"))
			{
				return LISTENER.prototype.addListener.apply(this,arguments);
			}
			return null;
		}
	});
	SMOD("StateListener",STATELISTENER);
	
	/** Listeners Class
	 * Manages several Listener instances
	 * provides a "createListener" function:
	 * 		prefix "." indicates a StateListener
	 * 	when adding a listening function the type
	 * 	can be passed followed after the name separated by ":" 
	 */
	var LISTENERS=µ.Listeners=µ.Class(
	{
		rNames:/[\s|,]+/,
		rNameopt:":",
		init:function ListenersInit(dynamic)
		{
			this.listeners={};
			this.createListener(".created");
			this.dynamicListeners=dynamic===true;
		},
		createListener:function createListener(types)
		{
			var typeArr=types.split(this.rNames);
			var fnarr=[].slice.call(arguments,1);
			for(var i=0;i<typeArr.length;i++)
			{
				var name_type=typeArr[i].split(this.rNameopt);
				if(this.listeners[name_type[0]]==null)
				{
					if(name_type[0][0]=='.')
					{
						this.listeners[name_type[0]]=new STATELISTENER({});
					}
					else
					{
						this.listeners[name_type[0]]=new LISTENER({});	
					}
				}
			}
		},
		addListener:function addListener(types,scope/*,functions...*/)
		{
			if(this.dynamicListeners) this.createListener(types);
			var typeArr=types.split(this.rNames);
			var fnarr=[].slice.call(arguments,2);
			for(var i=0;i<typeArr.length;i++)
			{
				var name_type=typeArr[i].split(this.rNameopt);
				if(this.listeners[name_type[0]]!==undefined)
				{
					this.listeners[name_type[0]].addListeners(fnarr,scope,name_type[1]);
				}
			}
		},
		removeListener:function removeListener(names,scope/*,functions...*/)
		{
			var removeCount=0;
			if(names.toLowerCase()=="all")
			{
				for(var i in this.listeners)
				{
					removeCount+=this.listeners[i].removeListeners(names,scope);
				}
			}
			else
			{
				var nameArr=names.split(this.rNames);
				var fnarr=[].slice.call(arguments,2);
				for(var i=0;i<nameArr.length;i++)
				{
					var name=nameArr[i];
					if(this.listeners[name]!==undefined)
					{
						removeCount+=this.listeners[name].removeListeners(fnarr,scope);
					}
				}
			}
			return removeCount;
		},
		fire:function fire(name,event)
		{
			event=event||{};
			event.type=name;
			if(this.listeners[name])
			{
				return this.listeners[name].fire(this,event);
			}
			return undefined
		},
		setDisabled:function setDisabled(names,bool)
		{
			var nameArr=names.split(this.rNames);
			for(var i=0;i<nameArr.length;i++)
			{
				var lstnr=this.listeners[nameArr[i]];
				if(lstnr!=null)
					lstnr.setDisabled(bool);
			}
		},
		isDisabled:function isDisabled(names)
		{
			var rtn=true;
			var nameArr=names.split(this.rNames);
			for(var i=0;rtn&&i<nameArr.length;i++)
			{
				var lstnr=this.listeners[nameArr[i]];
				if(lstnr!=null)
					rtn&=lstnr.isDisabled();
			}
			return rtn;
		},
		setState:function setState(name,event)
		{
			event=event||{};
			event.type=name;
			var lstnr=this.listeners[name];
			if (lstnr&&lstnr instanceof STATELISTENER)
			{
				return lstnr.setState(this,event);
			}
			return undefined;
		},
		resetState:function resetState(names)
		{
			var nameArr=names.split(this.rNames);
			for(var i=0;i<nameArr.length;i++)
			{
				var lstnr=this.listeners[nameArr[i]];
				if(lstnr!=null&&lstnr instanceof STATELISTENER)
					lstnr.resetState();
			}
		},
		getState:function getState(names)
		{
			var rtn=true;
			var nameArr=names.split(this.rNames);
			for(var i=0;rtn&&i<nameArr.length;i++)
			{
				var lstnr=this.listeners[nameArr[i]];
				if(lstnr!=null&&lstnr instanceof STATELISTENER)
					rtn&=lstnr.getState();
			}
			return rtn
		},
		destroy:function()
		{
			this.removeListener("all");
		}
	});
	SMOD("Listeners",LISTENERS);
	LISTENERS.attachListeners=function attachListeners(instance)
	{
		for(var i in LISTENERS.prototype)
		{
			if (i!="init"&&i!="constructor"&&i!="superInit"&&i!="superInitApply")
				instance[i]=LISTENERS.prototype[i];
		}
		LISTENERS.prototype.init.call(instance);
		instance.setState(".created");
	};
	SMOD("attachListeners",LISTENERS.attachListeners);
	
})(Morgas,Morgas.setModule,Morgas.getModule);
//TalePlay.Layer.js
(function(e,t,s,r){var o=this.TalePlay=this.TalePlay||{},l=s("Listeners"),n=s("shortcut")({node:"NodePatch"}),i=o.Layer=e.Class(l,{init:function(e){this.superInit(l),e=e||{},this.nodePatch=new n.node(this,{parent:"board",children:"GUIElements",addChild:"add",removeChild:"remove",hasChild:"has"},!0),this.mode=e.mode||i.Modes.ALL,this.domElement=document.createElement("div"),this.domElement.classList.add("Layer"),this.focused=null},onController:function(e){switch(this.mode){case i.Modes.ALL:default:for(var t=0;this.GUIElements.length>t;t++)this.GUIElements[t][i._CONTROLLER_EVENT_MAP[e.type]](e);break;case i.Modes.FIRST:this.GUIElements.length>0&&this.GUIElements[0][i._CONTROLLER_EVENT_MAP[e.type]](e);break;case i.Modes.LAST:this.GUIElements.length>0&&this.GUIElements[this.GUIElements.length-1][i._CONTROLLER_EVENT_MAP[e.type]](e);break;case i.Modes.FOCUSED:this.focused&&this.focused[i._CONTROLLER_EVENT_MAP[e.type]](e)}},add:function(e,t){return r("GUIElement")&&e instanceof s("GUIElement")&&this.nodePatch.addChild(e)?("string"==typeof t&&(t=this.domElement.querySelector(t)),t||(t=this.domElement),t.appendChild(e.domElement),!0):!1},remove:function(e){return this.nodePatch.removeChild(e)?(e.domElement.remove(),e.removeListener("all",this),!0):!1},destroy:function(){this.nodePatch.remove();for(var e=this.GUIElements.slice(),t=0;e.length>t;t++)e[t].destroy();l.prototype.destroy.call(this)}});i.Modes={ALL:0,FIRST:1,LAST:2,FOCUSED:3},i._CONTROLLER_EVENT_MAP={analogStickChanged:"onAnalogStick",buttonChanged:"onButton"},t("Layer",i)})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);
//GUI/TalePlay.GUIElement.js
(function(t,e,i){var s=this.TalePlay=this.TalePlay||{},n=i("Listeners"),o=i("shortcut")({sc:"shortcut",node:"NodePatch",Layer:"Layer"}),a=s.GUIElement=t.Class(n,{init:function(t){t=t||{},this.superInit(n),this.nodePatch=new o.node(this,{parent:"parent",children:"children",addChild:"addChild",removeChild:"removeChild"},!0),o.sc({layer:function(t){for(var e=t.parent;e&&!(e instanceof o.Layer);)e=e.parent;return e}},this,this.nodePatch,!0),this.domElement=document.createElement(t.element||"div"),this.addStyleClass("GUIElement"),t.styleClass&&this.addStyleClass(t.styleClass)},addStyleClass:function(t){var e=this.domElement.classList;Array.isArray(t)?e.add.apply(e,t):e.add(t)},removeStyleClass:function(t){var e=this.domElement.classList;Array.isArray(t)?e.remove.apply(e,t):e.remove(t)},addChild:function(t,e){return t instanceof a&&this.nodePatch.addChild(t)?("string"==typeof e&&(e=this.domElement.querySelector(e)),e||(e=this.domElement),e.appendChild(t.domElement),!0):!1},removeChild:function(t){return this.nodePatch.removeChild(t)?(t.domElement.remove(),t.removeListener("all",this),!0):!1},onAnalogStick:function(){},onButton:function(){},destroy:function(){this.nodePatch.remove();for(var t=this.children.slice(),e=0;t.length>e;e++)t[e].destroy();n.prototype.destroy.call(this)}});e("GUIElement",a)})(Morgas,Morgas.setModule,Morgas.getModule);
//Math/TalePlay.Math.Point.js
(function(t,e,i){var s=this.TalePlay=this.TalePlay||{};s.Math=s.Math||{};var n=i("shortcut")({debug:"debug"}),o=s.Math.Point=t.Class({init:function(t,e){this.x=0,this.y=0,this.set(t,e)},set:function(t,e){return"object"==typeof t&&null!==t?(this.x=1*t.x,this.y=1*t.y):void 0!==t&&(this.x=1*t,void 0===e&&(e=t),this.y=1*e),(isNaN(this.x)||isNaN(this.y))&&n.debug(["Point became NaN",this],n.debug.LEVEL.WARNING),this},clone:function(t){return t||(t=new o),t.set(this.x,this.y),t},equals:function(t,e){return"object"==typeof t&&null!==t?this.x==t.x&&this.y==t.y:void 0!==t?(void 0===e&&(e=t),this.x==t&&this.y==e):!1},add:function(t,e){return"object"==typeof t&&null!==t?(this.x+=1*t.x,this.y+=1*t.y):void 0!==t&&(this.x+=1*t,void 0===e&&(e=t),this.y+=1*e),(isNaN(this.x)||isNaN(this.y))&&n.debug(["Point became NaN",this],n.debug.LEVEL.WARNING),this},sub:function(t,e){return"object"==typeof t&&null!==t?(this.x-=t.x,this.y-=t.y):void 0!==t&&(this.x-=t,void 0===e&&(e=t),this.y-=e),(isNaN(this.x)||isNaN(this.y))&&n.debug(["Point became NaN",this],n.debug.LEVEL.WARNING),this},mul:function(t,e){return"object"==typeof t&&null!==t?(this.x*=t.x,this.y*=t.y):void 0!==t&&(this.x*=t,void 0===e&&(e=t),this.y*=e),(isNaN(this.x)||isNaN(this.y))&&n.debug(["Point became NaN",this],n.debug.LEVEL.WARNING),this},div:function(t,e){return"object"==typeof t&&null!==t?(this.x/=t.x,this.y/=t.y):void 0!==t&&(this.x/=t,void 0===e&&(e=t),this.y/=e),(isNaN(this.x)||isNaN(this.y))&&n.debug(["Point became NaN",this],n.debug.LEVEL.WARNING),this},negate:function(){return this.x=-this.x,this.y=-this.y,this},invert:function(){return this.x=1/this.x,this.y=1/this.y,this},abs:function(){return this.x=Math.abs(this.x),this.y=Math.abs(this.y),this},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y)},normalize:function(){var t=this.length();return t&&this.div(t),this},getAngle:function(){if(0!==this.y||0!==this.x){var t=Math.asin(this.y/this.length());return this.x>=0?t=Math.PI/2-t:t+=1.5*Math.PI,t}return 0},getDirection4:function(){return 0===this.y&&0===this.x?0:Math.abs(this.y)>Math.abs(this.x)?this.y>0?1:3:this.x>0?2:4},getDirection8:function(){return 0===this.y&&0===this.x?0:1+Math.floor((4*(this.getAngle()/Math.PI)+.5)%8)},doMath:function(t,e,i){return"object"==typeof e&&null!==e?(this.x=t(this.x,1*e.x),this.y=t(this.y,1*e.y)):void 0!==e&&(this.x=t(this.x,1*e),void 0===i&&(i=1*e),this.y=t(this.y,i)),(isNaN(this.x)||isNaN(this.y))&&n.debug(["Point became NaN",this],n.debug.LEVEL.WARNING),this}});e("Math.Point",o)})(Morgas,Morgas.setModule,Morgas.getModule);
//TalePlay.Controller.js
(function(t,e,i){var s=this.TalePlay=this.TalePlay||{},n=i("Listeners"),o=i("Math.Point"),r=t.shortcut({mapping:"Controller.Mapping"}),a=s.Controller=t.Class(n,{init:function(t,e){this.superInit(n),this.disabled=!1,this.analogSticks={},this.buttons={},this.mapping=null,this.setMapping(t,e),this.createListener("changed analogStickChanged buttonChanged")},getMapping:function(){return this.mapping},setMapping:function(t,e){t?(t instanceof r.mapping||(t=new r.mapping({data:t,name:e||"default"})),this.mapping=t):this.mapping=null},getAnalogStick:function(t){return void 0===this.analogSticks[t]&&(this.analogSticks[t]=new a.AnalogStick),this.analogSticks[t]},setButton:function(t){var e=!1,i=void 0;if(this.mapping){var s={};i={};for(var n in t){var o=this.mapping.getButtonAxisMapping(n);void 0!==o?i[Math.abs(o)]=this.mapping.convertAxisValue(o,t[n]):s[this.mapping.getButtonMapping(n)]=t[n]}t=s}for(var r in t){var a=t[r];if(void 0===this.buttons[r]||this.buttons[r]!==a){var l=this.buttons[r]||0;this.buttons[r]=a,this.fire("buttonChanged",{index:1*r,value:a,oldValue:l}),e=!0}}return i&&(e=this.setAxis(i,!0)||e),e&&this.fire("changed"),e},setAxis:function(t,e){var i=!1;if(this.mapping&&!e){var s={};for(var n in t){var o=this.mapping.getAxisMapping(n);s[Math.abs(o)]=this.mapping.convertAxisValue(o,t[n])}t=s}for(var r=Object.keys(t);r.length>0;){var a=r.shift(),l=void 0,h=void 0;o=-1;var d=this.getAnalogStick(a>>1);0==a%2?(l=t[a],h=t[1*a+1]||d.y,o=r.indexOf(1*a+1),-1!==o&&r.splice(o,1)):(l=t[a-1]||d.x,h=t[a],o=r.indexOf(a-1),-1!==o&&r.splice(o,1)),d.set(l,h),d.hasChanged()&&(i=!0,this.fire("analogStickChanged",{index:a>>1,analogStick:d}))}return i&&!e&&this.fire("changed"),i},set:function(t,e){this.setButton(t),this.setAxis(e)},setDisabled:function(t){this.disabled=t===!0;for(var e in this.listeners)this.listeners[e].setDisabled(this.disabled)},destroy:function(){},toString:function(){return JSON.stringify(this)},toJSON:function(){return{buttons:this.buttons,analogSticks:this.analogSticks}}});a.AnalogStick=t.Class(o,{init:function(t,e){this.old={x:0,y:0},this.superInit(o,t,e)},clone:function(t){return t||(t=new a.AnalogStick),o.prototype.clone.call(this,t),t.old.x=this.old.x,t.old.y=this.old.y,t},clonePoint:function(){return o.prototype.clone.call(this)},pushOld:function(){return this.old.x=this.x,this.old.y=this.y,this},hasChanged:function(){return!this.equals(this.old)},getDifference:function(){return new o(this.old).sub(this)},setComponent:function(t,e){return this.pushOld(),0===t%2?this.x=e:this.y=e,this},set:function(t,e){this.pushOld(),o.prototype.set.call(this,t,e)}}),e("Controller",a)})(Morgas,Morgas.setModule,Morgas.getModule);
//TalePlay.Controller.Gamepad.js
(function(µ,SMOD,GMOD){

	var CTRL=GMOD("Controller");

	var SC=GMOD("shortcut")({
		rs:"rescope"
	});
	
	var GP=CTRL.Gamepad=µ.Class(CTRL,{
		init:function(gamepad,map,precision)
		{
			this.superInit(CTRL,map);
			SC.rs.all(["update"],this);
			
			this.gamepad=gamepad;
			this.precision=precision||1;
			this.pollKey=null;
			
			this.addListener(".created:once",this,"update");
		},
		update:function()
		{
			if(!this.gamepad.connected)
			{
				var gamepads=navigator.getGamepads();
				if(gamepads[this.gamepad.index])
				{
					this.gamepad=gamepads[this.gamepad.index];
				}
			}
			if(this.gamepad.connected)
			{
				this.set(this.gamepad.buttons.map(b => b.value),this.gamepad.axes.map(a => a.toFixed(this.precision)*1));
			}
			this.pollKey=requestAnimationFrame(this.update);
		},
		toJSON:function()
		{
			var json=CTRL.prototype.toJSON.call(this);
			json.gpIndex=this.gpIndex;
			return json;
		},
		setDisabled:function(disabled)
		{
			CTRL.prototype.setDisabled.call(this,disabled);
			if(this.disabled)
			{
				cancelAnimationFrame(this.pollKey);
			}
			else
			{
				this.update();
			}
		}
	});
	SMOD("Controller.Gamepad",GP);
})(Morgas,Morgas.setModule,Morgas.getModule);
//TalePlay.Controller.Keyboard.js
(function(t,e,n){var i=n("Controller"),s=t.shortcut({rescope:"rescope"});i.Keyboard=t.Class(i,{init:function(t,e,n){this.superInit(i,void 0!==t?t:i.Keyboard.stdMapping,e),s.rescope.all(["onKeyDown","onKeyUp"],this),this.domElement=null,this.setDomElement(n||window)},setMapping:function(t){i.prototype.setMapping.call(this,t),this.mapping&&this.mapping.setValueOf("type","Keyboard")},setDomElement:function(t){this.domElement&&(this.domElement.removeEventListener("keydown",this.onKeyDown,!1),this.domElement.removeEventListener("keyup",this.onKeyUp,!1),this.domElement=null),t&&(this.domElement=t,t.addEventListener("keydown",this.onKeyDown,!1),t.addEventListener("keyup",this.onKeyUp,!1))},onKeyDown:function(t){this.onKey(t,1)},onKeyUp:function(t){this.onKey(t,0)},onKey:function(t,e){if(!this.disabled&&this.mapping&&(this.mapping.hasButtonMapping(t.code||t.key)||this.mapping.hasButtonAxisMapping(t.code||t.key))){t.preventDefault(),t.stopPropagation();var n={};n[t.code||t.key]=e,this.setButton(n)}},destroy:function(){this.setDomElement(),i.prototype.destroy.call(this)}}),i.Keyboard.stdMapping={buttons:{1:"2",2:"3",3:"4",4:"5",5:"6",6:"7"," ":"0",Shift:"1",Pause:"8",Enter:"9"},buttonAxis:{w:"1",d:"0",s:"-1",a:"-0",Up:"3",Right:"2",Down:"-3",Left:"-2"},axes:{}},e("Controller.Keyboard",i.Keyboard)})(Morgas,Morgas.setModule,Morgas.getModule);
//GUI/TalePlay.GUIElement.ControllerManager.js
(function(t,e,i){var s=i("GUIElement"),n=i("shortcut")({rs:"rescope",bind:"bind",mapping:"Controller.Mapping",ctrlK:"Controller.Keyboard",ctrlG:"Controller.Gamepad",GMenu:"GUI.Menu",config:"GUI.ControllerConfig"}),o='<table><tr><td class="DeviceActions"><select class="devices"></select><button data-action="addDevice">add Device</button><button data-action="removeController">remove Controller</button></td><td class="MappingActions"><button data-action="newMapping">New</button><button data-action="setMapping">Set</button><button data-action="editMapping">Edit</button><button data-action="deleteMapping">Delete</button></td></tr><tr><td class="controllers"></td><td class="mappings"></td></tr></table><button data-action="close">OK</button>',a=s.ControllerManager=t.Class(s,{init:function(t){t=t||{},t.styleClass=t.styleClass||"overlay",this.superInit(s,t),this.addStyleClass("ControllerManager"),n.rs.all(["_Click","_playerChanged","_mappingsLoaded"],this),this.domElement.addEventListener("click",this._Click),this.buttons=void 0!==t.buttons?t.buttons:10,this.analogSticks=void 0!==t.analogSticks?t.analogSticks:2,this.controllers=new n.GMenu({type:n.GMenu.Types.TABLE,header:["No.","Device","Mapping","Player"],selectionType:n.GMenu.SelectionTypes.SINGLE,converter:a.controllerConverter}),this.controllers.addListener("select",this,"_MenuSelect"),t.mappings=t.mappings||[],t.mappings.unshift(null),this.mappings=new n.GMenu({type:n.GMenu.Types.TABLE,header:["Name","Type"],selectionType:n.GMenu.SelectionTypes.SINGLE,converter:a.mappingConverter,items:t.mappings}),this.mappings.addListener("select",this,"_MenuSelect"),this.dbConn=t.dbConn||null,this.dbConn&&this.dbConn.load(n.mapping,{}).complete(this._mappingsLoaded),this.config=null,this.domElement.innerHTML=o,this.domElement.querySelector(".controllers").addEventListener("change",this._playerChanged),this.domElement.querySelector(".controllers").appendChild(this.controllers.domElement),this.domElement.querySelector(".mappings").appendChild(this.mappings.domElement),this.update(),this._gamepadListener=n.bind(this.update,this,"devices"),window.addEventListener("gamepadconnected",this._gamepadListener)},update:function(t){if(void 0===t||"devices"===t){for(var e="<option>Keyboard</option>",i=navigator.getGamepads(),s=0;i.length>s;s++)i[s]&&(e+="<option>"+i[s].id+"</option>");this.domElement.querySelector(".devices").innerHTML=e}if(this.layer&&this.layer.board&&(void 0===t||"controllers"===t)&&this.controllers.clear().addAll(this.layer.board.controllers),void 0===t||"actions"===t){var n=this.controllers.getSelectedItems()[0],o=this.mappings.getSelectedItems()[0];this.domElement.querySelector('[data-action="removeController"]').disabled=this.domElement.querySelector('[data-action="newMapping"]').disabled=!n,this.domElement.querySelector('[data-action="setMapping"]').disabled=!n||!o,this.domElement.querySelector('[data-action="editMapping"]').disabled=!n||!n.value.controller.getMapping(),this.domElement.querySelector('[data-action="deleteMapping"]').disabled=!o}},_mappingsLoaded:function(t){this.mappings.addAll(t)},_Click:function(t){var e=t.target.dataset.action;void 0!==e&&(t.stopPropagation(),this[e]())},addDevice:function(){var t=this.domElement.querySelector(".devices").selectedIndex;if(0===t)this.addController(new n.ctrlK);else{var e=navigator.getGamepads()[--t];this.addController(new n.ctrlG(e))}},removeController:function(){var t=this.controllers.getSelectedItems()[0];t&&(this.layer.board.removeController(t.value.controller),this.update("controllers"))},newMapping:function(){this._openControllerConfig(!0)},setMapping:function(){var t=this.controllers.getSelectedItems()[0],e=this.mappings.getSelectedItems()[0];t&&e&&(t.value.controller.setMapping(e.value),this.update("controllers"))},editMapping:function(){this._openControllerConfig(!1)},deleteMapping:function(){var t=this.mappings.getSelectedItems()[0];t&&null!==t.value&&(this.mappings.removeItem(t.value),this.dbConn&&void 0!==t.value.getID()&&this.dbConn["delete"](n.mapping,t.value))},addController:function(t){this.layer.board.addController(t),this.update("controllers")},_MenuSelect:function(){this.update("actions")},_openControllerConfig:function(t){var e=this.controllers.getSelectedItems()[0];if(e&&!this.config){e=e.value.controller;var i=e.getMapping();if(this.config=new n.config({buttons:this.buttons,analogSticks:this.analogSticks,controller:e,name:!!t}),t)e.setMapping(null);else if(!i)return!1;return this.config.addStyleClass("panel","overlay"),this.layer.add(this.config),this.config.addListener("submit:once",this,function(s){switch(!0){case"ok"===s.value:t?(i=s.source.getMapping(),this.mappings.addItem(i)):i.setValueOf("data",s.source.getData()),this.dbConn&&(t||void 0!==i.getID())&&this.dbConn.save(i);case!!t:e.setMapping(i)}s.source.destroy(),this.config=null,this.update("controllers")}),!0}return!1},close:function(){this.layer&&this.layer.board&&this.layer.board.focus(),this.destroy()},_playerChanged:function(t){void 0!==t.target.dataset.controllerindex&&(this.layer.board.controllers[t.target.dataset.controllerindex].player=1*t.target.value||1)},destroy:function(){s.prototype.destroy.call(this),window.removeEventListener("gamepadconnected",this._gamepadListener)}});a.controllerConverter=function(t,e){return[e,t.controller instanceof n.ctrlK?"Keyboard":t.controller.gamepad.id,t.controller.mapping&&t.controller.mapping.getValueOf("name")||"None",'<input type="number" min="1" value="'+t.player+'" data-controllerindex="'+e+'" >']},a.mappingConverter=function(t){return t?[t.getValueOf("name"),t.getValueOf("type")]:["none",""]},e("GUI.ControllerManager",a)})(Morgas,Morgas.setModule,Morgas.getModule);
//GUI/TalePlay.GUIElement.Menu.js
(function(µ,SMOD,GMOD){
	
	var GUI=GMOD("GUIElement");
	
	var SC=GMOD("shortcut")({
		MENU:"Menu",
		rescope:"rescope"
	});
	
	var MENU=GUI.Menu=µ.Class(GUI,{
		init:function(param)
		{
			SC.rescope.all(["_stepActive","onClick"],this);
			
			param=param||{};
			
			this.superInit(GUI,param);
			this.menu=new SC.MENU(param);
			this.addStyleClass("Menu");
			
			this.domElement.addEventListener("click",this.onClick,false);
			
			this.createListener("activeChanged select");

			this.type=param.type||MENU.Types.VERTICAL;
			this.converter=param.converter||MENU.defaultConverter;
			this.converterInfo=param.converterInfo||{};
			this.rows=param.rows||null;
			this.columns=param.columns||null;
			this.header=param.header||null;
			
			this.stepDirection=null;
			this.stepID=null;
			this.stepDelay=param.stepDelay||500;
			this.stepAcceleration=Math.min(1/param.stepAcceleration,param.stepAcceleration)||0.75;
			this.minStepDelay=param.minStepDelay||50;
			this.currentStepDelay=null;
			
			this.domElement.dataset.type = reverseTypes[this.type];
			
			this.update();
		},
		onAnalogStick:function(event)
		{
			var direction=event.analogStick.clonePoint().doMath(Math.round,0);
			if(!direction.equals(this.stepDirection))
			{
				if(this.stepID)
				{
					clearTimeout(this.stepID);
					this.stepID=null;
				}
				this.stepDirection=direction;
				var step=this._stepActive();
			}
		},
		_stepActive:function()
		{
			var step=0;
			switch(this.type)
			{
				case MENU.Types.VERTICAL:
				case MENU.Types.TABLE:
					step=-this.stepDirection.y;
					break;
				case MENU.Types.GRID:
					var gridLayout=this.getGridLayout();
					if(this.stepDirection.y===1)
					{
						step=-gridLayout.columns;
						if(this.menu.active+step<0)
						{
							var r=this.menu.items.length%gridLayout.columns;
							step=(r===0||r>this.menu.active) ? -r : step-r;
						}
					}
					else if (this.stepDirection.y===-1)
					{
						step=gridLayout.columns;
						if(this.menu.active+step>=this.menu.items.length)
						{
							step=this.menu.active%gridLayout.columns;
							step=this.menu.items.length-this.menu.active+step;
						}
					}
					case MENU.Types.HORIZONTAL:
					step+=this.stepDirection.x;
					break;
			}
			if(step!==0)
			{
				this.menu.moveActive(step);
				this._updateActive();
				this.fire("activeChanged");
				
				if(this.stepID===null)
				{
					this.currentStepDelay=this.stepDelay;
				}
				else if (this.currentStepDelay!==this.minStepDelay)
				{
					this.currentStepDelay=Math.max(this.minStepDelay,this.currentStepDelay*this.stepAcceleration);
				}
				this.stepID=setTimeout(this._stepActive, this.currentStepDelay);
			}
			else
			{
				clearTimeout(this.stepID);
				this.stepDirection=this.stepID=null;
			}
		},
		_updateActive:function()
		{
			for(var i=0,actives=this.domElement.querySelectorAll(".menuitem.active");i<actives.length;i++)
			{
				actives[i].classList.remove("active");
			}
			
			if(this.menu.active!==-1)
			{
				this.getItemDomElement(this.menu.active).classList.add("active");
			}
		},
		onClick:function(event)
		{
			var target=event.target,
			index=-1;
			if(target.tagName==="INPUT"||target.tagName==="SELECT"||target.tagName==="TEXTAREA")
			{
				return ;
			}
			while(target&&target!==document&&!target.classList.contains("menuitem"))
			{
				target=target.parentNode;
			}
			if(this.type===MENU.Types.GRID)
			{
				var column=Array.indexOf(target.parentNode.children,target),
				row=Array.indexOf(this.domElement.children,target.parentNode),
				gridLayout=this.getGridLayout();
				index=row*gridLayout.columns+column;
			}
			else if (this.type===MENU.Types.TABLE&&this.header)
			{
				index=Array.indexOf(this.domElement.children,target)-1;
			}
			else
			{
				index=Array.indexOf(this.domElement.children,target);
			}
			if(index>-1)
			{
				event.stopPropagation();
				if(this.layer&&this.layer.board)
				{
					this.layer.board.focus();
				}
				this.setActive(index);
				this.toggleSelect(index);
			}
		},
		onButton:function(event)
		{
			if (event.value===1)
			{
				if(this.menu.active!==-1)
				{
					this.toggleSelect(this.menu.active)
				}
			}
		},
		toggleSelect:function(index)
		{
			var cl=this.getItemDomElement(index).classList;
			if(this.menu.selectionType===SC.MENU.SelectionTypes.SINGLE&&!this.menu.isSelected(index)&&this.menu.selectedIndexs.length>0)
			{
				this.getItemDomElement(this.menu.selectedIndexs[0]).classList.remove("selected");
			}
			if(this.menu.toggleSelect(index,true))
			{
				cl.add("selected");
			}
			else
			{
				cl.remove("selected");
			}
			this.fire("select",this.menu.getItem(index));
		},
		getGridLayout:function()
		{
			var rtn={rows:this.rows,columns:this.columns};
			if(rtn.rows===null&&rtn.columns===null)
			{
				rtn.columns=Math.ceil(Math.sqrt(this.menu.items.length));
			}
			if(rtn.rows==null)
			{
				rtn.rows=Math.ceil(this.menu.items.length/rtn.columns);
			}
			else if(rtn.columns==null)
			{
				rtn.columns=Math.ceil(this.menu.items.length/rtn.rows);
			}
			return rtn;
		},
		update:function()
		{
			this.domElement.innerHTML="";
			if(this.type===MENU.Types.TABLE&&this.header)
			{
				this.domElement.innerHTML='<span class="menuheader"><span>'+this.header.join('</span><span>')+'</span></span>'
			}
			if(this.type===MENU.Types.GRID&&this.menu.items.length>0)
			{
				var gridLayout=this.getGridLayout();
				
				for(var r=0,row=document.createElement("span");r<gridLayout.rows;r++,row=document.createElement("span"))
				{
					row.classList.add("row");
					this.domElement.appendChild(row);
					for(var c=0,index=r*gridLayout.columns;c<gridLayout.columns&&index<this.menu.items.length;c++,index=r*gridLayout.columns+c)
					{
						row.appendChild(this.convertItem(this.menu.items[index],index));
					}
				}
			}
			else
			{
				for(var i=0;i<this.menu.items.length;i++)
				{
					this.domElement.appendChild(this.convertItem(this.menu.items[i],i));
				}
			}
		},
		convertItem:function(item,index)
		{
			var converted=this.converter(item,index,this.converterInfo);
			var element=null;
			if(converted instanceof HTMLElement)
			{
				element=converted;
			}
			else
			{
				element=document.createElement("span");
				if(Array.isArray(converted))
				{
					converted="<span>"+converted.join("</span><span>")+"</span>";
				}
				element.innerHTML=converted;
			}
			
			element.classList.add("menuitem");
			if(this.menu.isSelected(item))
			{
				element.classList.add("selected");
			}
			if(this.menu.isDisabled(item))
			{
				element.classList.add("disabled");
			}
			if(this.menu.active===index)
			{
				element.classList.add("active");
			}
			return element;
		},
		addItem:function(item)
		{
			this.menu.addItem(item);
			if(this.type===MENU.Types.GRID) update();
			else this.domElement.appendChild(this.convertItem(item,this.menu.items.length-1));
			return this;
		},
		addAll:function(items)
		{
			for(var i=0;i<items.length;i++)
			{
				this.addItem(items[i]);
			}
			return this;
		},
		removeItem:function(item)
		{
			var index=this.menu.removeItem(item);
			if(index!==-1)
			{
				this.getItemDomElement(index).remove();
			}
			return index;
		},
		getItemDomElement:function(index)
		{
			if(this.type===MENU.Types.GRID)
			{
				var gridLayout=this.getGridLayout(),
				row=Math.floor(index/gridLayout.columns),
				column=index-row*gridLayout.columns;
				return this.domElement.children[row].children[column];
			}
			else if (this.type===MENU.Types.TABLE&&this.header)
			{
				return this.domElement.children[index+1];
			}
			else
			{
				return this.domElement.children[index];
			}
		},
		getItem:function(index)
		{
			var rtn=this.menu.getItem(index);
			rtn.domElement=this.getItemDomElement(index);
			return rtn;
		},
		getSelectedItems:function()
		{
			var rtn=[];
			for(var i=0;i<this.menu.selectedIndexs.length;i++)
			{
				rtn.push(this.getItem(this.menu.selectedIndexs[i]));
			}
			return rtn;
		},
		clear:function()
		{
			this.menu.clear();
			while(!this.header&&this.domElement.lastChild||this.domElement.lastChild!==this.domElement.firstChild)
			{
				this.domElement.lastChild.remove();
			}
			return this;
		},
        getActive:function()
        {
            return this.getItem(this.menu.active);
        },
		setActive:function(index)
		{
			this.menu.setActive(index);
			this._updateActive();
		}
	});
	GMOD("shortcut")({SelectionTypes:()=>GMOD("Menu").SelectionTypes},MENU);
	MENU.Types={
		VERTICAL:1,
		HORIZONTAL:2,
		TABLE:3,
		GRID:4
	};
	MENU.defaultConverter=function(item,index,selected)
	{
		return ""+item;
	};
	
	var reverseTypes={};
	for(var t in MENU.Types)
	{
		reverseTypes[MENU.Types[t]]=[t];
	}
	
	SMOD("GUI.Menu",MENU);
	
})(Morgas,Morgas.setModule,Morgas.getModule);
//Math/TalePlay.Math.Rect.js
(function(t,e,i){var s=this.TalePlay=this.TalePlay||{};s.Math=s.Math||{};var n=i("shortcut")({POINT:"Math.Point"}),o=s.Rect=t.Class({init:function(t,e){this.position=new n.POINT,this.size=new n.POINT,this.setPosition(t),this.setSize(e)},clone:function(){return new o(this.position,this.size)},setPosition:function(t,e){return this.position.set(t,e),this},setSize:function(t,e){return this.size.set(t,e),this},set:function(t,e,i,s){return this.position.set(t,e),this.size.set(i,s),this},setAbsolute:function(t,e,i,s){var n=Math.min(t,i),o=Math.min(e,s),a=Math.max(t,i);return Math.max(e,s),this.set(n,o,a-n,_y2-o),this},getAbsolute:function(){return{min:this.position.clone(),max:this.position.clone().add(this.size)}},collide:function(t){if(t===this)return!0;var e=this.getAbsolute(),i=t.getAbsolute();return!(e.min.x>=i.max.x||e.min.y>=i.max.y||i.min.x>=e.max.x||i.min.y>=e.max.y)},contains:function(t,e){var i=new n.POINT(t,e);return i.x>=this.position.x&&this.position.x+this.size.x>i.x&&i.y>=this.position.y&&this.position.y+this.size.y>i.y}});e("Math.Rect",o)})(Morgas,Morgas.setModule,Morgas.getModule);
//RPGPlayer/TalePlay.RPGPlayer.js
(function(µ,SMOD,GMOD){
	
	var Layer=GMOD("Layer");

	var SC=µ.getModule("shortcut")({
		det:"Detached",
		rj:"Request.json",
		debug:"debug",
		idb:"IDBConn",
		
		Map:"GUI.Map",
		Dialog:"GUI.Dialog",
		GameSave:"RPGPlayer.GameSave"
		/* default modules:
		 * StartMenu
		 * RPGPlayer.GameMenu
		 */
	});
	
	var requestCallbacks={
		quests:{
			loaded:function quests_loaded(quests,self)
            {
            	for(var i=0;i<quests.length;i++)
            	{
            		var quest=new RPGPlayer.Quest(quests[i]);
            		self.quests.set(quest.name,quest);
            	}
            	return self;
            },
			error:function quest_load_error(error)
            {
				SC.debug(["Could not load Quests: ",error],0);
				return error;
            }
		},
		dialogs:{
			loaded:function dialogs_loaded(dialogs,self)
            {
            	for(var i=0;i<dialogs.length;i++)
            	{
            		self.dialogs.set(dialogs[i].name,dialogs[i]);
            	}
            	return self;
            },
			error:function dialogs_load_error(error)
            {
            	SC.debug(["Could not load Dialogs: ",error],0);
				return error;
            }
		}
	};

    var RPGPlayer=Layer.RPGPlayer=µ.Class(Layer,{
        init:function(param)
        {
            param=param||{};
            this.superInit(Layer,param);
			this.domElement.classList.add("RPGPlayer");
			
			if(!param.board)
			{
				throw "board is undefined";
			}
			else
			{
				param.board.addLayer(this);
			}
			
			if(!param.gameName)
			{
				throw "gameName is undefined";
			}
			else
			{
				this.gameName=param.gameName;
				this.domElement.dataset.gamename=this.gameName;
				this.dbConn=new SC.idb(this.gameName);
			}
			this.createListener("ready quest-activate quest-complete quest-abort execute");
			
			this.baseUrl=param.baseUrl||"";
			this.imageBaseUrl=param.imageBaseUrl||param.baseUrl||"";
			this.mapBaseUrl=param.mapBaseUrl||param.baseUrl||"";
			this.gameSave=new SC.GameSave({
				cursor:new SC.Map.Cursor()
			});

            this.quests=new Map();
            this.questsReady=SC.rj(this.baseUrl+"quests.json",this).then(requestCallbacks.quests.loaded,requestCallbacks.quests.error);
            
            this.dialogs=new Map();
            SC.rj(this.baseUrl+"dialogs.json",this).then(requestCallbacks.dialogs.loaded,requestCallbacks.dialogs.error);
            
            this.focused=null;
			this.map=new SC.Map();
			this.map.addListener("trigger",this,"_onTrigger");
			
			this._StartMenu=(typeof param.startMenu==="function")?param.startMenu:GMOD(param.startMenu||"StartMenu");
			this._GameMenu=(typeof param.gameMenu==="function")?param.gameMenu:GMOD(param.gameMenu||"RPGPlayer.GameMenu");
			
			this._openStartMenu();
        },
        _openStartMenu:function()
        {
        	this.focused=null;
        	var smenu=new this._StartMenu({
        		dbConn:this.dbConn,
        		saveClass:SC.GameSave,
        		saveConverter:RPGPlayer.saveConverter,
        		newGameUrl:this.baseUrl+"newgame.json"
        	});
        	smenu.addListener("start:once",this,function(event)
			{
				event.source.destroy();
				this.focused=this.map;
				if(!this.has(this.map)) this.add(this.map);
				this.loadSave(event.save);
			});
			this.board.addLayer(smenu);
        },
		_openGameMenu:function(enableSave)
		{
			this.map.movingCursors["delete"](this.gameSave.getCursor());
			this.map.setPaused(true);
			this.focused=null;
			var gmenu=new this._GameMenu({
				dbConn:this.dbConn,
        		saveClass:SC.GameSave,
				saveConverter:RPGPlayer.saveConverter,
				saveData:enableSave?this.getSave():null
			});
			gmenu.addListener("close:once",this,function(event)
			{
				event.source.destroy();
				this.focused=this.map;
				this.map.setPaused(false);
			});
			this.board.addLayer(gmenu);
		},
		onController:function(event)
		{
			if(this.focused)
			{
				if(this.focused===this.map&&event.type==="buttonChanged")
				{
					switch (event.index)
					{
						case 1:
							//TODO speed up?
						case 2:
							this.focused[Layer._CONTROLLER_EVENT_MAP[event.type]](event);
							break;
						case 3:
							if(event.value==1) this._openGameMenu();
							break;
					}
				}
				else
				{
					this.focused[Layer._CONTROLLER_EVENT_MAP[event.type]](event);
				}
			}
		},
		loadSave:function(save)
		{
			this.setCursor(save.getCursor());
			var activeQuests=this.gameSave.getQuests();
			activeQuests.length=0;
			this.questsReady.complete(function (self)
            {
				var saveQuests=save.getQuests();
            	for(var i=0;i<saveQuests.length;i++)
            	{
            		if(self.quests.has(saveQuests[i]))
            		{
            			if(activeQuests.indexOf(saveQuests[i])===-1)activeQuests.push(saveQuests[i]);
            		}
            		else
            		{
            			SC.debug("quest "+saveQuests[i]+" not found",SC.debug.LEVE.ERROR);
            		}
            	}
            	return null;
            });
            this._changeMap(save.getMap(), save.getPosition());
            if(save.getActions())
            {
            	this.doActions(save.getActions());
            }
		},
		setCursor:function(cursor)
		{
			cursor.urls=cursor.urls.map(u => u ? this.imageBaseUrl+u : u);
			cursor.name=cursor.name||"";
			cursor.collision=cursor.collision!==false;
			this.gameSave.getCursor().fromJSON(cursor);
		},
		getSave:function()
		{
			this.gameSave.setTimeStamp(new Date());
			this.gameSave.setPosition(this.gameSave.getCursor().getPosition());
			
			var clone=new SC.GameSave();
			clone.fromJSON(JSON.parse(JSON.stringify(this.gameSave)));
			var cursor=clone.getCursor();
			cursor.urls=cursor.urls.map(u => u ? u.slice(u.lastIndexOf("/")+1) : u);
			
			return clone;
		},
		_changeMap:function(name,position)
		{
			this.map.setPaused(true);
			return SC.rj(this.mapBaseUrl+name+".json",this).then(function changeMap_loaded(json,_self)
			{
				var todo=json.cursors.concat(json.images);
				while(todo.length>0)
				{
					var image=todo.shift();
					image.url=_self.imageBaseUrl+image.url;
				}
				json.position=position;
				var animation=_self.map.movingCursors.get(_self.gameSave.getCursor());
				_self.map.fromJSON(json);
				_self.gameSave.getCursor().setPosition(position);
				_self.map.add(_self.gameSave.getCursor());
				if(animation)
				{
					_self.map.movingCursors.set(_self.gameSave.getCursor(),animation);
				}
				_self.map.setPaused(false);
				_self.gameSave.setMap(name);
            	return name;
			},
			function changeMap_Error(error)
			{
				SC.debug(["Could not load Map: ",name,error],0);
				return error;
			});
		},
		_stopCursor:function()
		{
			if(this.gameSave.getCursor().direction)
			{
				this.gameSave.getCursor().direction.set(0);
			}
		},
		_showDialog:function(dialogName)
		{
			var dialog=this.dialogs.get(dialogName);
			if(dialog)
			{
				dialog.styleClass="panel";
				this.focused=new SC.Dialog(dialog);
				this.focused.addListener("dialogEnd:once",this,function(event)
				{
					this.focused.destroy();
					this.focused=this.map;
					if(event.actions)
					{
						this.doActions(event.actions);
					}
				});
				this.add(this.focused);
				this._stopCursor();
			}
		},
		_onTrigger:function(e)
		{
			this.doActions(e.value);
		},
		doActions:function(actions)
		{
			for(var i=0;i<actions.length;i++)
			{
				var a=actions[i];
				var activeQuests=this.gameSave.getQuests();
				var questIndex=null;
				var quest=null;
				switch (a.type) 
				{
					case "ABORT_QUEST":
						if((questIndex=activeQuests.indexOf(a.questName))!==-1) quest=this.quests.get(a.questName);
						if(quest)
						{
							activeQuests.splice(questIndex,1);
							this.fire("quest-abort",{value:quest});
						}
						break;
					case "RESOLVE_QUEST":
						if((questIndex=activeQuests.indexOf(a.questName))!==-1) quest=this.quests.get(a.questName);
						if(quest)
						{
							activeQuests.splice(questIndex,1);
							this.fire("quest-complete",{value:quest});
							actions=actions.concat(quest.resolve);
						}
						break;
					case "ACTIVATE_QUEST":
						quest=this.quests.get(a.questName);
						if(quest&&activeQuests.indexOf(a.questName)===-1)
						{
							activeQuests.push(a.questName);
							this.fire("quest-activate",{value:quest});
						}
						break;
					case "CHANGE_MAP":
						this._changeMap(a.mapName, a.position);
						break;
					case "SHOW_DIALOG":
						this._showDialog(a.dialogName);
						break;
					case "OPEN_GAMEMENU":
						this._openGameMenu(a.enableSave);
						break;
					case "EXECUTE":
						this.fire("execute",{action:a});
						break;
				}
			}
		}
    });
	RPGPlayer.saveConverter=function(save,index)
	{
		if(!save)
			return [index,"EMPTY","&nbsp;"];
		try
		{
			return [index,save.getTimeStamp().toLocaleString(),save.getMap()];
		}
		catch(error)
		{
			SC.debug([error,save],SC.debug.LEVEL.ERROR);
			return [index,"CORRUPT DATA","&nbsp;"];
		}
	};
	SMOD("RPGPlayer",RPGPlayer);

	RPGPlayer.Quest=µ.Class({
		init:function(param)
		{
			param=param||{};
			
			this.name=param.name||"NO NAME!";
			this.description=param.description||"NO DESCRIPTION!";
			this.resolve=param.resolve||[];
		},
		clone:function(cloning)
		{
			if(!cloning)
			{
				cloning=new RPGPlayer.Quest();
			}
			cloning.name=this.name;
			cloning.description=this.description;
			cloning.resolve=this.resolve.slice();
			
			return cloning;
		},
		toJSON:function(){return this.name}
	});
	SMOD("RPGPlayer.Quest",RPGPlayer.Quest);
})(Morgas,Morgas.setModule,Morgas.getModule);
//Morgas/src/Morgas.util.function.rescope.js
(function(t,e){var n=t.util=t.util||{},o=n.function||{};o.rescope=function(t,e){return function(){return t.apply(e,arguments)}},o.rescope.all=function(t,e){t=t||Object.keys(e);for(var n=0;t.length>n;n++)e[t[n]]=o.rescope(e[t[n]],e)},e("rescope",o.rescope)})(Morgas,Morgas.setModule,Morgas.getModule);
//Morgas/src/Morgas.Patch.js
(function(t,e){var n=function(t){return void 0!==this.getPatch(t)},o=function(t){return this.patches[t.patchID||t.prototype.patchID]},c=function(){this.patch(this._patchParam,!1),delete this._patchParam},s=t.Patch=t.Class({init:function(t,e,s){null==t.patches&&(t.patches={},t.hasPatch=n,t.getPatch=o),t.hasPatch(this)||(this.instance=t,t.patches[this.patchID]=this,"function"==typeof this.instance.addListener?(this._patchParam=e,this.instance.addListener(".created:once",this,c),s&&this.patchNow()):this.patch(e,!0))},patchNow:function(){this.instance.patches[this.patchID]===this&&"function"==typeof this.instance.removeListener&&this.instance.removeListener(".created",this)&&this.patch(this._patchParam,!1)},patch:function(){},superPatch:function(t){t.prototype.patch.apply(this,[].slice.call(arguments,1))},superPatchApply:function(t,e){this.superPatch.apply(this,[t].concat([].slice.call(e)))}});e("Patch",s),s.hasPatch=function(t,e){return t.hasPatch?t.hasPatch(e):!1},s.getPatch=function(t,e){return t&&t.getPatch?t.getPatch(e):null}})(Morgas,Morgas.setModule,Morgas.getModule);
//Morgas/src/Morgas.NodePatch.js
(function(e,t,n){var i=n("Patch"),s=n("shortcut")({p:"proxy",d:"debug"}),r=e.NodePatch=e.Class(i,{patchID:"NodePatch",patch:function(e){this.parent=null,this.children=[],e=e||{},this.aliasMap={};for(var t={},n=0;r.Aliases.length>n;n++){var i=r.Aliases[n];i in e&&(this.aliasMap[i]=e[i],void 0===this.instance[this.aliasMap[i]]&&(t[i]=this.aliasMap[i]))}s.p(a,t,this.instance);for(var n=0;r.Symbols.length>n;n++){var c=r.Symbols[n];c in e&&o(this,c,e[c])}},addChild:function(e,t){var n,i=a(e),r=this.children.indexOf(e);if(!i)return s.d([e," is not a Node"]),!1;if(-1===r){if(void 0!==t?this.children.splice(t,0,e):(t=this.children.length,this.children.push(e)),null!==i.parent&&i.parent!==this.instance)if(n=i.aliasMap.remove){if(!e[n]())return s.d(["rejected remove child ",e," from old parent ",i.parent],s.d.LEVEL.INFO),this.children.splice(t,1),!1}else i.remove();if(n=i.aliasMap.setParent){if(!e[n](this.instance))return s.d(["rejected to set parent",this.instance," of child ",e],s.d.LEVEL.INFO),this.children.splice(t,1),!1}else i.setParent(this.instance)}return!0},removeChild:function(e){var t=this.children.indexOf(e);if(-1!==t){this.children.splice(t,1);var n=a(e);if(n&&n.parent===this.instance){var i=n.aliasMap.remove;if(i){if(!e[i]())return s.d(["rejected remove child ",e," from parent ",this.instance],s.d.LEVEL.INFO),this.children.splice(t,0,e),!1}else n.remove()}}return!0},setParent:function(e){var t,n=a(e);if(!n)return s.d([e," is not a Node"]),!1;if(e&&this.parent!==e){if(null!==this.parent)if(t=childPatch.aliasMap.remove){if(!child[t]())return s.d(["rejected remove child ",child," from old parent ",childPatch.parent],s.d.LEVEL.INFO),this.children.splice(index,1),!1}else childPatch.remove();if(this.parent=e,t=n.aliasMap.addChild,-1===n.children.indexOf(this.instance))if(t){if(!this.parent[t](this.instance))return s.d(["rejected to add child ",this.instance," to parent ",e],s.d.LEVEL.INFO),this.parent=null,!1}else n.addChild(this.instance)}return!0},remove:function(){if(null!==this.parent){var e=this.parent,t=a(e);if(this.parent=null,-1!==t.children.indexOf(this.instance)){var n=t.aliasMap.removeChild;if(n){if(!e[n](this.instance))return this.parent=e,s.d(["rejected to remove child ",this.instance," from parent ",this.parent],s.d.LEVEL.INFO),!1}else t.removeChild(this.instance)}}return!0},hasChild:function(e){return-1!==this.children.indexOf(e)},isChildOf:function(e){return a(e),e&&e.hasChild(this.instance)}});r.Aliases=["addChild","removeChild","remove","setParent","hasChild"],r.Symbols=["parent","children"],r.BasicAliases={parent:"parent",children:"children",addChild:"addChild",removeChild:"removeChild",remove:"remove",setParent:"setParent",hasChild:"hasChild"},r.Basic=e.Class({init:function(e){e=e||{};for(var t={},n=0,i=Object.keys(r.BasicAliases);i.length>n;n++){var s=i[n],a=e[s];void 0===a&&(a=r.BasicAliases[s]),null!==a&&(t[s]=""+a)}new r(this,t)}});var a=function(e){return"string"==typeof e&&(e=this),e instanceof r?e:i.getPatch(e,r)},o=function(e,t,n){"function"!=typeof e[t]?Object.defineProperty(e.instance,n,{get:function(){return e[t]},set:function(n){e[t]=n}}):e.instance[n]=e[t]};t("NodePatch",r)})(Morgas,Morgas.setModule,Morgas.getModule);
//Morgas/src/DB/Morgas.DB.js
(function(t,e,n){var r,s,i,a,o=n("shortcut")({debug:"debug",det:"Detached"}),u=t.DB=t.DB||{};r=u.Connector=t.Class({init:function(){o.det.detacheAll(this,["save","load","delete","destroy"])},save:function(){throw Error("abstract Class DB.Connector")},load:function(){throw Error("abstract Class DB.Connector")},"delete":function(){throw Error("abstract Class DB.Connector")},destroy:function(){throw Error("abstract Class DB.Connector")},saveChildren:function(t,e){return this.save(t.getChildren(e))},saveFriendships:function(t,e){var n=t.relations[e],s=t.friends[e];if(!s)return o.debug("no friends in relation "+e+" found",2),new o.det.complete(!1);var i=s[0].relations[n.targetRelationName],a=t.getID();if(null==a)return o.debug("friend id is null",2),new o.det.complete(!1);for(var u=[],h=0;s.length>h;h++){var c=s[h].getID();null!=c&&u.push(c)}if(0===u.length)return o.debug("no friend with friend id found"),new o.det.complete(!1);var f=r.getFriendTableName(t.objectType,e,s[0].objectType,n.targetRelationName),d=t.objectType+"_ID",p=s[0].objectType+"_ID",g=[];n.relatedClass===i.relatedClass&&(p+=2);for(var h=0;u.length>h;h++)g.push(new l(f,d,a,p,u[h]));return this.save(g)},loadParent:function(t,e){var n=t.relations[e],r=n.relatedClass,s=n.fieldName;return this.load(r,{ID:t.getValueOf(s)}).then(function(n){var r=n[0];r.addChild(e,t),this.complete(r)})},loadChildren:function(t,e,n){var r=t.relations[e],s=rel.relatedClass,i=r.fieldName;return n[i]=this.getID(),this.load(s,n).then(function(e){t.addChildren(e),this.complete(e)})},loadFriends:function(t,e,n){var s=this,i=t.relations[e],a=i.relatedClass,u=(new a).relations[i.targetRelationName],h=t.objectType+"_ID",c=a.prototype.objectType+"_ID",f=r.getFriendTableName(t.objectType,e,a.prototype.objectType,i.targetRelationName),d={};i.relatedClass===u.relatedClass&&(c+=2),d[h]=t.getID();var p=l.Generator(f,h,c),g=this.load(p,d);return i.relatedClass===u.relatedClass&&(g=g.then(function(t){var e=this;d[c]=d[h],delete d[h],s.load(p,d).then(function(n){for(var r=0;n.length>r;r++){var s=n[r].fields[h].value;n[r].fields[h].value=n[r].fields[c].value,n[r].fields[c].value=s}e.complete(t.concat(n))},o.debug)},o.debug)),g.then(function(t){return n.ID=t.map(function(t){return t.fields[c].value}),s.load(a,n)},o.debug)},deleteFriendships:function(t,e){var n=t.relations[e],s=t.friends[e];if(!s)return o.debug("no friends in relation "+e+" found",2),new o.det.complete(!1);var i=s[0].relations[n.targetRelationName],a=t.getID();if(null==a)return o.debug("friend id is null",2),new o.det.complete(!1);for(var u=[],h=0;s.length>h;h++){var c=s[h].getID();null!=c&&u.push(c)}if(0===u.length)return o.debug("no friend with friend id found"),new o.det.complete(!1);var f=r.getFriendTableName(t.objectType,e,s[0].objectType,n.targetRelationName),d=t.objectType+"_ID",p=s[0].objectType+"_ID",g=[];if(n.relatedClass===i.relatedClass){p+=2;var v={};v[d]=u,v[p]=a,g.push(v)}var v={};v[d]=a,v[p]=u,g.push(v);for(var y=[],m=l.Generator(f,d,p),h=0;g.length>h;h++)y.push(this["delete"](m,g[h]));return new o.det(y)}}),r.sortObjs=function(t){for(var e={friend:{},fresh:{},preserved:{}},n=0;t.length>n;n++){var r=t[n],s=r instanceof l?"friend":void 0===r.getID()?"fresh":"preserved",i=r.objectType;void 0===e[s][i]&&(e[s][i]=[]),e[s][i].push(r)}return e},r.getDeletePattern=function(t,e){var n=typeof e;if(("number"===n||e instanceof u.Object)&&(e=[e]),Array.isArray(e)){for(var r=0;e.length>r;r++)e[r]instanceof t&&(e[r]=e[r].getID());e={ID:e}}return e},r.getFriendTableName=function(t,e,n,r){return[t,e,n,r].sort().join("_")},e("DBConn",r),s=u.Object=t.Class({objectType:null,init:function(t){if(t=t||{},null==this.objectType)throw"DB.Object: objectType not defined";this.fields={},this.relations={},this.parents={},this.children={},this.friends={},this.addField("ID",a.TYPES.INT,t.ID,{UNIQUE:!0,AUTOGENERATE:!0})},addRelation:function(t,e,n,r,s){this.relations[t]=new i(e,n,r||t,s)},addField:function(t,e,n,r){this.fields[t]=new a(e,n,r)},getValueOf:function(t){return this.fields[t].getValue()},setValueOf:function(t,e){"ID"!=t&&this.fields[t].setValue(e)},setID:function(t){this.fields.ID.setValue(t);for(var e in this.children)for(var n=this.children[e],r=0;n.length>r;r++)n[r]._setParent(this.relations[e],this)},getID:function(){return this.getValueOf("ID")},getParent:function(t){return this.parents[t]},_setParent:function(t,e){var n=this.relations[t.targetRelationName];this.parents[t.targetRelationName]=e,this.setValueOf(n.fieldName,e.getValueOf(t.fieldName))},_add:function(t,e,n){var r=t[e]=t[e]||[];-1==r.indexOf(n)&&r.push(n)},_get:function(t,e){return(t[e]||[]).slice(0)},addChild:function(t,e){this.relations[t].type==i.TYPES.CHILD&&(this._add(this.children,t,e),e._setParent(this.relations[t],this))},addChildren:function(t,e){for(var n=0;e.length>n;n++)this.addChild(t,e[n])},getChildren:function(t){return this._get(this.children,t)},addFriend:function(t,e){this.relations[t].type==i.TYPES.FRIEND&&(this._add(this.friends,t,e),e._add(e.friends,this.relations[t].targetRelationName,this))},addFriends:function(t,e){for(var n=0;e.length>n;n++)this.addFriend(t,e[n])},getFriends:function(t){return this._get(this.friends,t)},toJSON:function(){var t={};for(var e in this.fields)t[e]=this.fields[e].toJSON();return t},fromJSON:function(t){for(var e in this.fields)void 0!==t[e]&&this.fields[e].fromJSON(t[e]);return this},toString:function(){return JSON.stringify(this)}}),e("DBObj",s);var l=u.Firendship=t.Class({init:function(t,e,n,r,s){this.objectType=t,this.fields={},this.fields[e]=new a(a.TYPES.INT,n),this.fields[r]=new a(a.TYPES.INT,s)},toJSON:s.prototype.toJSON,fromJSON:s.prototype.fromJSON});l.Generator=function(e,n,r){return t.Class(l,{objectType:e,init:function(){this.superInit(l,e,n,null,r,null)}})},e("DBFriend",l),i=u.Relation=t.Class({init:function(t,e,n,r){if(null==r){if(e==i.TYPES.PARENT)throw"DB.Relation: "+e+" relation needs a fieldName";r="ID"}this.type=e,this.relatedClass=t,this.fieldName=r,this.targetRelationName=n}}),i.TYPES={PARENT:-1,FRIEND:0,CHILD:1},e("DBRel",i),a=u.Field=t.Class({init:function(t,e,n){this.type=t,this.value=e,this.options=n||{}},setValue:function(t){this.value=t},getValue:function(){return this.value},toJSON:function(){switch(this.type){case a.TYPES.DATE:var t=this.getValue();if(t instanceof Date)return t.getUTCFullYear()+","+t.getUTCMonth()+","+t.getUTCDate()+","+t.getUTCHours()+","+t.getUTCMinutes()+","+t.getUTCSeconds()+","+t.getUTCMilliseconds();break;default:return this.getValue()}},fromJSON:function(t){switch(this.type){case a.TYPES.DATE:this.value=new Date(Date.UTC.apply(Date,t.split(",")));break;default:this.value=t}},toString:function(){return JSON.stringify(this)},fromString:function(t){switch(this.type){case a.TYPES.BOOL:this.value=!!~~t;break;case a.TYPES.INT:this.value=~~t;break;case a.TYPES.DOUBLE:this.value=1*t;break;case a.TYPES.DATE:this.fromJSON(JSON.parse(t));break;case a.TYPES.STRING:case a.TYPES.JSON:default:this.value=JSON.parse(t)}}}),a.TYPES={BOOL:0,INT:1,DOUBLE:2,STRING:3,DATE:4,JSON:5,BLOB:6},e("DBField",a)})(Morgas,Morgas.setModule,Morgas.getModule);
//TalePlay.Controller.Mapping.js
(function(t,e,i){var n=i("Controller"),s=i("DBObj"),o=i("shortcut")({DBField:"DBField"}),a=n.Mapping=t.Class(s,{objectType:"ControllerMapping",init:function(t){t=t||{},this.superInit(s,t),this.addField("name",o.DBField.TYPES.STRING,t.name||""),this.addField("type",o.DBField.TYPES.STRING,t.type||"");var e={buttons:{},buttonAxis:{},axes:{}};t.data&&(e.buttons=t.data.buttons||e.buttons,e.buttonAxis=t.data.buttonAxis||e.buttonAxis,e.axes=t.data.axes||e.axes),this.addField("data",o.DBField.TYPES.JSON,e)},setMapping:function(t,e,i){var n=this.getValueOf("data")[t];n&&(void 0===i||null===i?delete n[e]:n[e]=i)},getMapping:function(t,e){return this.getValueOf("data")[t][e]},removeMapping:function(t,e){this.setMapping(t,e)},hasMapping:function(t,e){var i=this.getValueOf("data")[t];return i?e in i:!1},setMappingAll:function(t,e){for(var i in e)this.setMapping(t,i,e[i])},setButtonMapping:function(t,e){this.setMapping("buttons",t,e)},getButtonMapping:function(t){var e=this.getMapping("buttons",t);return void 0===e&&(e=t),e},removeButtonMapping:function(t){this.removeMapping("buttons",t)},hasButtonMapping:function(t){return this.hasMapping("buttons",t)},setButtonAxisMapping:function(t,e){this.setMapping("buttonAxis",t,e)},getButtonAxisMapping:function(t){return this.getMapping("buttonAxis",t)},removeButtonAxisMapping:function(t){this.removeMapping("buttonAxis",t)},hasButtonAxisMapping:function(t){return this.hasMapping("buttonAxis",t)},setAxisMapping:function(t,e){this.setMapping("axes",t,e)},getAxisMapping:function(t){var e=this.getMapping("axes",t);return void 0===e&&(e=t),e},removeAxisMapping:function(t){this.removeMapping("axes",t)},hasAxisMapping:function(t){return this.hasMapping("axes",t)},convertAxisValue:function(t,e){return Math.sign(1/t)*e},getReverseMapping:function(){var t=this.getValueOf("data"),e={buttons:{},buttonAxis:{},axes:{}};for(var i in t)for(var n in t[i]){var s=t[i][n];"axes"===i&&0>1/s?(s=-s,n="-"+n):0===s&&0>1/s&&(s="-0"),e[i][s]=n}return e}});e("Controller.Mapping",a)})(Morgas,Morgas.setModule,Morgas.getModule);
//Morgas/src/Morgas.util.function.bind.js
(function(t,e){var n=t.util=t.util||{},o=n.function||{};o.bind=Function.bind.call.bind(Function.bind),e("bind",o.bind)})(Morgas,Morgas.setModule,Morgas.getModule);
//TalePlay.Menu.js
(function(t,e){var i=this.TalePlay=this.TalePlay||{},s=i.Menu=t.Class({init:function(t){if(t=t||{},this.items=t.items||[],this.selectionType=t.selectionType||s.SelectionTypes.MULTI,this.loop=t.loop!==!1,this.selectedIndexs=[],this.disabledIndexs=[],this.active=-1,void 0!==t.active&&t.active>-1&&this.items.length>t.active&&(this.active=t.active),void 0!==t.selected)for(var e=0;t.selected.length>e;e++)this.addSelect(t.selected[e]);if(void 0!==t.disabled)for(var e=0;t.disabled.length>e;e++)this.setDisabled(t.disabled[e],!0)},addItem:function(t){return this.items.push(t),this},addAll:function(t){for(var e=0;t.length>e;e++)this.addItem(t[e]);return this},removeItem:function(t){var e=this.items.indexOf(t);if(-1!==e){this.items.splice(e,1);var i=this.selectedIndexs.indexOf(e);-1!==i&&this.selectedIndexs.splice(i,1);var s=this.disabledIndexs.indexOf(e);-1!==s&&this.disabledIndexs.splice(i,1),this.active>e?this.active--:this.active===e&&this.setActive(-1)}return e},getItem:function(t){return{index:t,value:this.items[t],active:this.active===t,selected:-1!==this.selectedIndexs.indexOf(t),disabled:-1!==this.disabledIndexs.indexOf(t)}},clearSelect:function(){this.selectedIndexs.length=0},isSelected:function(t){var e=this.items.indexOf(t);return-1===e&&(e=t),-1!==this.selectedIndexs.indexOf(e)},addSelect:function(t){if(this.selectionType===s.SelectionTypes.NONE)return!1;var e=this.items.indexOf(t);return-1===e&&(e=t),this.items.hasOwnProperty(e)&&-1===this.selectedIndexs.indexOf(e)?(this.selectionType===s.SelectionTypes.SINGLE?this.selectedIndexs[0]=e:this.selectedIndexs.push(e),!0):!1},removeSelect:function(t){var e=this.items.indexOf(t);return-1===e&&(e=t),e=this.selectedIndexs.indexOf(e),-1!==e?(this.selectedIndexs.splice(e,1),!0):!1},toggleSelect:function(t,e){if(this.selectionType===s.SelectionTypes.NONE)return!1;var i=e?t:this.items.indexOf(t);if(-1===i&&(i=t),this.items.hasOwnProperty(i)){var n=this.selectedIndexs.indexOf(i);return-1===n?(this.selectionType===s.SelectionTypes.SINGLE?this.selectedIndexs[0]=i:this.selectedIndexs.push(i),!0):(this.selectedIndexs.splice(n,1),!1)}return null},getActive:function(){return this.getItem(this.active)},setActive:function(t){var e=-1,i=this.items.length-1;t=t>=e?t>i?i:t:e,this.active!==t&&(this.active=t)},moveActive:function(t){var e=this.active+t;this.loop?(-1===this.active&&0>t&&e++,e%=this.items.length,0>e&&(e=this.items.length+e)):e=0>e?0:e,this.setActive(e)},toggleActive:function(){return this.toggleSelect(this.active)},getSelectedItems:function(){for(var t=[],e=0;this.selectedIndexs.length>e;e++)t.push(this.getItem(this.selectedIndexs[e]));return t},setDisabled:function(t){var e=this.items.indexOf(t);return-1===e&&(e=t),this.items.hasOwnProperty(e)&&-1===this.disabledIndexs.indexOf(e)?(this.disabledIndexs.push(e),!0):!1},isDisabled:function(t){var e=this.items.indexOf(t);return-1===e&&(e=t),-1!==this.disabledIndexs.indexOf(e)},getType:function(){return this.selectionType},setType:function(t){switch(t){case s.SelectionTypes.NONE:this.selectedIndexs.length=0;break;case s.SelectionTypes.SINGLE:this.selectedIndexs.length=1}this.selectionType=t},clear:function(){return this.items.length=this.selectedIndexs.lengt=this.disabledIndexs.length=0,this.active=-1,this}});s.SelectionTypes={NONE:1,SINGLE:2,MULTI:3},e("Menu",s)})(Morgas,Morgas.setModule,Morgas.getModule);
//GUI/TalePlay.GUIElement.ControllerConfig.js
(function(t,e,i,s){var n=i("shortcut")({rs:"rescope",mapping:"Controller.Mapping"}),o={Keyboard:1,Gamepad:2},a=i("GUIElement"),r=function(t){var e="";switch(t){case 32:case" ":e="space";break;case 16:e="shift";break;case 19:e="pause";break;case 13:e="enter";break;case 37:e="left";break;case 38:e="up";break;case 39:e="right";break;case 40:e="down";break;case 96:e="num 0";break;case 97:e="num 1";break;case 98:e="num 2";break;case 99:e="num 3";break;case 100:e="num 4";break;case 101:e="num 5";break;case 102:e="num 6";break;case 103:e="num 7";break;case 104:e="num 8";break;case 105:e="num 9";break;default:e="string"==typeof t?t:String.fromCharCode(t)}return e},h=function(t,e,i){var s="";i&&(s+='<input type="text" data-field="name"',"string"==typeof i&&(s+=' value="'+i+'"'),s+=">"),s+='<div class="buttons">';for(var n=0;t>n;n++)s+='<span class="button"><span>'+n+"</span>"+'<input type="text" size="3" data-button="'+n+'">'+"</span>";s+='</div><div class="analogSticks">';for(var n=0;2*e>n;n+=2)s+='<span class="analogStick"><span>'+n/2+"</span>"+'<label class="axisButton" for="axisButton'+n/2+'"> buttons </label><input class="axisButton" type="checkbox" id="axisButton'+n/2+'">'+"<span>"+'<input type="text" size="3" class="axis-y pos" data-axis="'+(n+1)+'">'+'<input type="text" size="3" class="axis-x pos" data-axis="'+n+'">'+'<input type="text" size="3" class="axis-y neg" data-axis="-'+(n+1)+'">'+'<input type="text" size="3" class="axis-x neg" data-axis="-'+n+'">'+"</span>"+"</span>";return s+='</div><button data-value="ok">OK</button><button data-value="cancel">Cancel</button>'},l=a.ControllerConfig=t.Class(a,{init:function(t){t=t||{},this.superInit(a,t),n.rs.all(["onInputChange","onClick"],this),this.createListener("submit"),this.addStyleClass("ControllerConfig"),this.domElement.addEventListener("keydown",this.onInputChange,!0),this.domElement.addEventListener("click",this.onClick,!0),this.domElement.innerHTML=h(t.buttons,t.analogSticks,t.name),this.controllerType=0,this.controller=null,this.setController(t.controller)},setController:function(t){if(this.controller!==t&&(this.controller&&(this.controller.setMapping(this.oldMapping),this.controller.removeListener("analogStickChanged buttonChanged",this,this.controllerChanged),this.controllerType=0,this.domElement.classList.remove("Keyboard"),this.domElement.classList.remove("Gamepad"),this.controller=null),this.controller=t||null),this.controller&&(s("Controller.Keyboard")&&this.controller instanceof i("Controller.Keyboard")?(this.controllerType=o.Keyboard,this.domElement.classList.add("Keyboard")):(this.controllerType=o.Gamepad,this.domElement.classList.add("Gamepad"),this.controller.addListener("analogStickChanged buttonChanged",this,"controllerChanged")),this.oldMapping=this.controller.getMapping(),this.controller.setMapping(null),this.oldMapping)){for(var e=this.oldMapping.getReverseMapping(),n=this.getButtons(),a=0;n.length>a;a++){var h=n[a];h.value=e.buttons[h.dataset.button],t===o.Keyboard&&(h.title=r(e.buttons[h.dataset.button]))}for(var l=this.getAxes(),a=0;l.length>a;a++){var d=l[a];d.value=e.axes[d.dataset.axis],t===o.Keyboard&&(d.title=r(e.axes[d.dataset.axis]))}for(var c=this.getAxisButtons(),a=0;c.length>a;a++){var u=c[a];u.value=e.buttonAxis[u.dataset.axis],t===o.Keyboard&&(u.title=r(e.buttonAxis[u.dataset.axis]))}}},getButtons:function(){return this.domElement.querySelectorAll("input[data-button]")},getAxisButtons:function(){return this.controllerType===o.Keyboard?this.domElement.querySelectorAll(".analogStick [data-axis]"):this.domElement.querySelectorAll(".axisButton:checked+* > input")},getAxes:function(){return this.controllerType!==o.Keyboard?this.domElement.querySelectorAll(".axisButton:not(:checked)+* > .pos"):[]},onInputChange:function(t){if("INPUT"===t.target.tagName&&"name"!==t.target.dataset.field&&"Backspace"!==t.key&&this.controllerType===o.Keyboard){t.preventDefault(),t.stopPropagation();var e=t.target;e.value=t.code||t.key,e.title=r(t.code||t.key)}},onClick:function(t){"BUTTON"===t.target.tagName&&this.fire("submit",{value:t.target.dataset.value})},controllerChanged:function(t){if("buttonChanged"!==t.type||void 0===document.activeElement.dataset.button&&(void 0===document.activeElement.dataset.axis||document.activeElement.parentNode.previousSibling.checked!==!0&&this.controllerType!==o.Keyboard)){if("analogStickChanged"===t.type&&void 0!==document.activeElement.dataset.axis&&document.activeElement.parentNode.previousSibling.checked===!1){var e=Math.abs(t.analogStick.x),i=Math.abs(t.analogStick.y);if(e>.5||i>.5)if(e>i){var s="";0>t.analogStick.x&&(s="-"),document.activeElement.value=s+2*t.index}else{var s="";0>t.analogStick.y&&(s="-"),document.activeElement.value=s+(2*t.index+1)}}}else document.activeElement.value=t.index},getData:function(){for(var t={buttons:{},buttonAxis:{},axes:{}},e=this.getButtons(),i=0;e.length>i;i++){var s=e[i];t.buttons[s.value]=s.dataset.button}for(var n=this.getAxisButtons(),i=0;n.length>i;i++)t.buttonAxis[n[i].value]=n[i].dataset.axis;for(var o=this.getAxes(),i=0;o.length>i;i++){var a=o[i],r=a.value,h=a.dataset.axis;0>1/r&&(r=-r,h="-"+h),t.axes[r]=h}return t},getMapping:function(){var t="";switch(this.controllerType){case o.Keyboard:t="KEYBOARD";break;case o.Gamepad:t="GAMEPAD"}var e=this.domElement.querySelector('[data-field="name"]');return e&&(e=e.value),new n.mapping({data:this.getData(),type:t,name:e})},destroy:function(){this.setController(null),a.prototype.destroy.call(this)}});e("GUI.ControllerConfig",l)})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);
//Morgas/src/Morgas.Detached.js
(function(t,e,n){var s=n("shortcut")({debug:"debug"}),r=function(t,e){return function(n,r){try{var i=t.apply({complete:n,error:r},e);i&&"function"==typeof i.then?i.then(n,r):void 0!==i&&n(i)}catch(a){s.debug(a,1),r(a)}}},i=t.Detached=t.Class({init:function(t,e){var n=t===i.WAIT;n&&(t=arguments[1]),this.fn=[].concat(t||[]),this.onError=[],this.onComplete=[],this.onAlways=[],this.onPropagate=[],this.status=0,this.args=void 0,n||(0===this.fn.length?this.status=1:this._start(e))},_start:function(t){for(var e=0;this.fn.length>e;e++)"function"==typeof this.fn[e]&&(this.fn[e]=new Promise(r(this.fn[e],t)));var n=this;Promise.all(this.fn).then(function(t){n._setStatus(1,t)},function(){n._setStatus(-1,Array.slice(arguments,0))})},_setStatus:function(t,e){if(this.status=t,this.args=e,1===t)for(;this.onComplete.length>0;)this.onComplete.shift()._start(this.args);else if(-1===t){for(;this.onError.length>0;)this.onError.shift()._start(this.args);for(;this.onPropagate.length>0;)this.onPropagate.shift()._setStatus(t,this.args)}for(var n=[1===this.status].concat(this.args);this.onAlways.length>0;)this.onAlways.shift()._start(n);this.onComplete.length=this.onError.length=this.onPropagate.length=this.onAlways.length=this.fn.length=0},error:function(t){t=[].concat(t);for(var e=0;t.length>e;e++)t[e]=new i(i.WAIT,t[e]),-1==this.status&&this.finished>=this.fn.length?t[e]._start(this.args):0===this.status&&this.onError.push(t[e]);return t[t.length-1]},complete:function(t){t=[].concat(t);for(var e=0;t.length>e;e++)t[e]=new i(i.WAIT,t[e]),1==this.status?t[e]._start(this.args):0==this.status&&this.onComplete.push(t[e]);return t[t.length-1]},then:function(t,e){var n=this.complete(t);return e===!0?this.propagateError(n):this.error(e),n},always:function(t){t=[].concat(t);for(var e=0;t.length>e;e++)if(t[e]=new i(i.WAIT,t[e]),0!==this.status){var n=[1===this.status].concat(this.args);t[e]._start(n)}else 0===this.status&&this.onAlways.push(t[e]);return t[t.length-1]},propagateError:function(t){0===this.status?this.onPropagate.push(t):-1===this.status&&0===t.status&&t._setStatus(-1,this.args)}});i.WAIT={},e("Detached",i),i.complete=function(){var t=new i;return t.args=arguments,t},i.error=function(){var t=new i;return t.status=-1,t.args=arguments,t},i.detache=function(t,e){return e=e||window,function(){var n=Array.slice(arguments,0);return new i(function(){n.unshift(this);try{return t.apply(e,n)}catch(r){s.debug(r,1),this.error(r)}})}},i.detacheAll=function(t,e){e=[].concat(e);for(var n=0;e.length>n;n++){var s=t[e[n]];t[e[n]]=i.detache(s,t)}}})(Morgas,Morgas.setModule,Morgas.getModule);
//Morgas/src/Morgas.util.Request.js
(function(e,t,n){e.util=e.util||{};var r=n("shortcut")({det:"Detached"});REQ=e.util.Request=function(e,t){return"string"==typeof e&&(e={url:e}),e={url:e.url,method:e.data?"POST":"GET",async:!0,user:e.user,password:e.password,responseType:e.responseType||"",upload:e.upload,withCredentials:e.withCredentials===!0,contentType:e.contentType,data:e.data},new r.det([function(){var t=this,n=new XMLHttpRequest;n.open(e.method,e.url,e.async,e.user,e.password),n.responseType=e.responseType,e.contentType?n.setRequestHeader("contentType",value):e.data&&(e.contentType="application/x-www-form-urlencoded;charset=UTF-8",e.data.consctuctor===Object&&(e.contentType="application/json;charset=UTF-8",e.data=JSON.stringify(data)),n.setRequestHeader("contentType",e.contentType)),e.upload&&(n.upload=e.upload),n.onload=function(){200==n.status?t.complete(n):t.error(n.statusText)},n.onerror=function(){t.error("Network Error")},e.progress&&(n.onprogress=e.progress),n.send(e.data)},t])},t("Request",REQ),REQ.json=function(e,t){"string"==typeof e&&(e={url:e}),e.responseType="json";var n=REQ(e),r=n.then(function(e){return e.response},!0);return r.fn.push(t),r},t("Request.json",REQ.json)})(Morgas,Morgas.setModule,Morgas.getModule);
//Morgas/src/DB/Morgas.DB.IndexedDBConnector.js
(function(e,t,n){var r=n("DBConn"),s=n("shortcut")({det:"Detached",it:"iterate",eq:"equals",find:"find",DBObj:"DBObj",DBFriend:"DBFriend"}),i=e.Class(r,{init:function(e){this.superInit(r),this.name=e,s.det.detacheAll(this,["_open"])},save:function(t,n){n=[].concat(n);var r=i.sortObjs(n),o=Object.keys(r);this._open(o).then(function(n){var i=s.it(r,s.det.detache(function(t,r,i){var o=n.transaction(i,"readwrite");o.onerror=function(n){e.debug(n,0),t.complete(n)},o.oncomplete=function(n){e.debug(n,2),t.complete()};var a=o.objectStore(i);s.it(r,function(t){var n=t.toJSON(),r="put";void 0===n.ID&&(delete n.ID,r="add");var s=a[r](n);s.onerror=function(t){e.debug(t,0)},s.onsuccess=function(n){e.debug(n,3),t.setID&&t.setID(s.result)}})}),!1,!0);n.close(),t.complete(new s.det(i)),this.complete()},t.error)},load:function(t,n,r){this._open().then(function(i){if(i.objectStoreNames.contains(n.prototype.objectType)){var o=i.transaction(n.prototype.objectType,"readonly"),a=[];o.onerror=function(n){e.debug(n,0),i.close(),t.error(n)},o.oncomplete=function(){i.close(),t.complete(a)};var u=o.objectStore(n.prototype.objectType);if("number"==typeof r.ID||Array.isArray(r.ID))s.it([].concat(r.ID),function(t){var i=u.get(t);i.onerror=function(t){e.debug(t,0)},i.onsuccess=function(t){if(e.debug(t,3),s.eq(i.result,r)){var o=new n;o.fromJSON(i.result),a.push(o)}}});else{var l=u.openCursor();l.onerror=function(n){e.debug(n,0),i.close(),t.error(n)},l.onsuccess=function(){if(l.result){if(s.eq(l.result.value,r)){var e=new n;e.fromJSON(l.result.value),a.push(e)}l.result["continue"]()}}}}else i.close(),t.complete([]);this.complete()},t.error)},"delete":function(t,n,i){var o=this,a=n.prototype.objectType,u=null;if("number"==typeof i||i instanceof s.DBObj||i instanceof s.DBFriend||Array.isArray(i)){var l=r.getDeletePattern(n,i).ID;u=s.det.complete(l)}else u=this._open().then(function(n){var r=this,o=[],u=n.transaction(a,"readonly");u.onerror=function(s){e.debug(s,0),n.close(),t.error(s),r.error(s)},u.oncomplete=function(){n.close(),r.complete(o)};var l=u.objectStore(a),c=l.openCursor();c.onerror=function(s){e.debug(s,0),n.close(),t.error(s),r.error(s)},c.onsuccess=function(){c.result&&(s.eq(c.result.value,i)&&o.push(c.result.key),c.result["continue"]())}},t.error);u.then(function(r){return r.length>0?o._open().then(function(i){var o=i.transaction(n.prototype.objectType,"readwrite");o.onerror=function(n){e.debug(n,0),i.close(),t.error(n)};var u=o.objectStore(a),l=s.it(r,s.det.detache(function(t,n){var r=u["delete"](n);r.onerror=function(r){e.debug(r,0),t.complete(n)},r.onsuccess=function(n){e.debug(n,3),t.complete()}}));return new s.det(l).then(function(){i.close(),t.complete(Array.slice(arguments)),this.complete()},e.debug)}):(t.complete(!1),this.complete(),void 0)},function(e){db.close(),t.error(e,0),this.complete()})},destroy:function(){},_open:function(e,t){var n=this,r=indexedDB.open(this.name);r.onerror=function(t){e.error(t,0)},r.onsuccess=function(){for(var s=[],i=r.result,o=r.result.version,a=0;t&&t.length>a;a++)i.objectStoreNames.contains(t[a])||s.push(t[a]);if(0===s.length)e.complete(i);else{var u=indexedDB.open(n.name,o+1);u.onerror=function(t){e.error(t,0)},u.onupgradeneeded=function(){for(var e=0;s.length>e;e++)u.result.createObjectStore(s[e],{keyPath:"ID",autoIncrement:!0})},u.onsuccess=function(){n.version=u.result.version,e.complete(u.result)},i.close()}}}});i.sortObjs=function(e){for(var t={},n=0;e.length>n;n++){var r=e[n],s=r.objectType;void 0===t[s]&&(t[s]=[]),t[s].push(r)}return t},t("IndexedDBConnector",i),t("IDBConn",i)})(Morgas,Morgas.setModule,Morgas.getModule);
//TalePlay.Map.js
(function(t,e,i){var n=this.TalePlay=this.TalePlay||{},s=i("shortcut")({find:"find",Node:"NodePatch",point:"Math.Point",RECT:"Math.Rect"}),o=n.Map=t.Class({init:function(t){this.nodePatch=new s.Node(this,{children:"images",addChild:"add",removeChild:"remove"}),t=t||{},this.position=new s.point,this.size=new s.point(t.size),this.domElement=t.domElement||document.createElement("div"),this.domElement.classList.add("Map"),this.stage=document.createElement("div"),this.stage.classList.add("stage"),this.domElement.appendChild(this.stage),t.images&&this.addAll(t.images),this.size.equals(0)&&this.calcSize(),this.setPosition(t.position)},addAll:function(t){t=[].concat(t);for(var e=0;t.length>e;e++)this.add(t[e])},add:function(t){return this.nodePatch.addChild(t)?(this.stage.appendChild(t.domElement),t.update(),!0):!1},remove:function(t){return this.nodePatch.removeChild(t)?(this.stage.removeChild(t.domElement),!0):!1},setPosition:function(t,e){this.position.set(t,e),this.position.doMath(Math.max,0).doMath(Math.min,this.getSize()),this.update(!0)},getPosition:function(){return this.position},move:function(t,e){this.position.add(t,e),this.position.doMath(Math.max,0).doMath(Math.min,this.getSize()),this.update(!0)},update:function(t){var e=this.position.clone(),i=this.domElement.getBoundingClientRect();e.sub(i.width/2,i.height/2),this.stage.style.top=-e.y+"px",this.stage.style.left=-e.x+"px";for(var n=0;!t&&this.images.length>n;n++)this.images[n].update()},getImages:function(t){return s.find(this.images,t,!0)},getSize:function(){return this.size},setSize:function(t,e){this.size.set(t,e)},calcSize:function(t){this.size.set(0);for(var e=0;this.images.length>e;e++)(!t||t(this.images[e]))&&this.size.doMath(Math.max,this.images[e].rect.position.clone().add(this.images[e].rect.size))},empty:function(){for(;this.images.length>0;)this.remove(this.images[0])},toJSON:function(){return{images:this.images.slice(),position:this.position.clone(),size:this.size.clone()}},fromJSON:function(t){this.empty();for(var e=0;t.images.length>e;e++){var i=t.images[e];i instanceof o.Image||(i=(new o.Image).fromJSON(i)),this.add(i)}return this.size.set(t.size),this.size.equals(0)&&this.calcSize(),this.setPosition(t.position),this}});o.Image=t.Class({init:function(t,e,i,n){new s.Node(this,{parent:"map",remove:"remove"}),this.rect=new s.RECT(e,i),this.domElement=document.createElement("img"),Object.defineProperty(this,"url",{enumerable:!0,get:function(){return this.domElement.src},set:function(t){this.domElement.src=t}}),this.url=t,Object.defineProperty(this,"name",{enumerable:!0,get:function(){return this.domElement.dataset.name},set:function(t){this.domElement.dataset.name=t}}),this.name=n||""},update:function(){this.domElement.style.top=this.rect.position.y+"px",this.domElement.style.left=this.rect.position.x+"px",this.domElement.style.height=this.rect.size.y+"px",this.domElement.style.width=this.rect.size.x+"px"},getPosition:function(){return this.rect.position.clone()},setPosition:function(t,e){this.move(this.getPosition().negate().add(t,e)),this.update()},move:function(t,e){this.rect.position.add(t,e),this.update()},toJSON:function(){return{url:this.url,position:this.rect.position,size:this.rect.size,name:this.name}},fromJSON:function(t){return this.url=t.url,this.rect.setPosition(t.position),this.rect.setSize(t.size),this.name=t.name,this.update(),this}}),e("Map",o)})(Morgas,Morgas.setModule,Morgas.getModule);
//GUI/TalePlay.GUIElement.Map.js
(function(µ,SMOD,GMOD){

	var GUI=GMOD("GUIElement"),
	MAP=GMOD("Map"),
	SC=GMOD("shortcut")({
		find:"find",
		rescope:"rescope",
		proxy:"proxy",
        Org:"Organizer",
		point:"Math.Point"
	});
	
	var cursorFilter= image => image instanceof GUI.Map.Cursor;
	var cursorGetter= GuiMap => GuiMap.organizer.getFilter("cursors");
	
	GUI.Map=µ.Class(GUI,{
		init:function(param)
		{
			param=param||{};
			
			this.superInit(GUI,param);
			this.createListener("trigger");
			SC.rescope.all(["_animateCursor"],this);
			
			this.map=new MAP({
				domElement:this.domElement,
				images:param.images,
				position:param.position
			}); //note: sets class "map" to domElement
			this.map.gui=this;
			SC.proxy("map",[
				"setPosition",
				"move",
				"getImages",
				"getSize",
				"update"
			],this);
			
        	this.organizer=new SC.Org()
        	.filter("cursors",cursorFilter)
        	.filter("collision","collision")
        	.group("trigger","trigger.type");
			
            this.threshold=new SC.point();
            GMOD("shortcut")({cursors:cursorGetter},this,this,true);
            this.movingCursors=new Map();
            this.setThreshold(param.threshold);
            param.cursors&&this.addAll(param.cursors);
            this.assignFilter=param.assignFilter||null;
            this.animationRquest=null;
            this.paused=param.paused===true;
		},
        addAll:function(images)
        {
        	images=[].concat(images);
            for(var i=0;i<images.length;i++)
            {
                this.add(images[i]);
            }
        },
        add:function(image)
        {
            if(this.map.add(image))
            {
                this.organizer.add([image]);
            }
        },
        remove:function(image)
        {
        	if(this.map.remove(image))
        	{
        		this.organizer.remove(image);
        		this.movingCursors["delete"](image);
        	}
        },
		getCursors:function(pattern)
		{
			return SC.find(this.cursors,pattern,true);
		},
		updateSize:function()
		{
			this.map.calcSize(img => !(img instanceof GUI.Map.Cursor));
		},
		setThreshold:function(numberOrPoint,y)
		{
			this.threshold.set(numberOrPoint,y);
		},
		setPaused:function(paused)
		{
			this.paused=!!paused;
			if(this.animationRquest!==null&&this.paused)
			{
				cancelAnimationFrame(this.animationRquest);
				this.animationRquest=null;
			}
			else if(!this.paused)
			{
				var now=Date.now();
				for(var [cursor, data] of this.movingCursors)
				{
					data.lastTime=now-performance.timing.navigationStart;
				}
				this.animationRquest=requestAnimationFrame(this._animateCursor);
			}
		},
		isPaused:function()
		{
			return this.paused;
		},
        collide:function(rect)
        {
        	var rtn=[],
        	cImages=this.organizer.getFilter("collision");
        	for(var i=0;i<cImages.length;i++)
        	{
        		if(cImages[i].rect.collide(rect))
        		{
        			rtn.push(cImages[i]);
        		}
        	}
        	return rtn;
        },
        trigger:function(type,numberOrPoint,y)
        {
        	var rtn=[],
        	tImages=this.organizer.getGroupValue("trigger",type);
        	for(var i=0;i<tImages.length;i++)
        	{
        		if(tImages[i].rect.contains(numberOrPoint,y))
        		{
        			rtn.push(tImages[i]);
        		}
        	}
        	return rtn;
        },
		onAnalogStick:function(event)
		{
			for(var i=0;i<this.cursors.length;i++)
			{
				if(!this.assignFilter||this.assignFilter(event,this.cursors[i],i))
				{
					var data=this.movingCursors.get(this.cursors[i]);
					if(!data)
					{
						data={
							direction:null,
							lastTime:Date.now()-performance.timing.navigationStart
						};
						this.movingCursors.set(this.cursors[i],data);
					}
					data.direction=event.analogStick.clonePoint()
					.mul(1,-1);//negate y for screen coordinates;
				}
			}
			if(this.animationRquest===null&&!this.paused)
			{
				this.animationRquest=requestAnimationFrame(this._animateCursor);
			}
		},
		_animateCursor:function(time)
		{
			for(var [cursor, data] of this.movingCursors)
			{
				var timeDiff=Math.min(time-data.lastTime,GUI.Map.MAX_TIME_DELAY);
	            if(data.animation)
	            {
	            	data.direction=data.animation.step(timeDiff);
	            }
				if(!data.direction.equals(0)&&cursor)
				{
		            cursor.domElement.classList.add("moving");
		            var distance=cursor.move(data.direction,timeDiff);

					//step trigger
		            //TODO step in/over/out
					var stepTrigger=this.trigger("step",cursor.getPosition());
					for(var i=0;i<stepTrigger.length;i++)
					{
						this.fire("trigger",{
							triggerType:"step",
							image:stepTrigger[i],
							cursor:cursor,
							value:stepTrigger[i].trigger.value,
							distance:distance
						});
					}
					
					data.lastTime=time;
					
					//move map
					var pos=cursor.getPosition();
					var mapPos=this.map.getPosition();
					if(pos.x<mapPos.x-this.threshold.x)
					{
						this.move(pos.x-mapPos.x+this.threshold.x,0);
					}
					else if(pos.x>mapPos.x+this.threshold.x)
					{
						this.move(pos.x-mapPos.x-this.threshold.x,0);
					}
					if(pos.y<mapPos.y-this.threshold.y)
					{
						this.move(0,pos.y-mapPos.y+this.threshold.y);
					}
					else if(pos.y>mapPos.y+this.threshold.y)
					{
						this.move(0,pos.y-mapPos.y-this.threshold.y);
					}
				}
	            else
	            {
	                cursor.domElement.classList.remove("moving");
	                this.movingCursors["delete"](cursor);
	            }
			}
			if(this.movingCursors.size>0&&!this.paused)
			{
				this.animationRquest=requestAnimationFrame(this._animateCursor);
			}
			else
			{
				this.animationRquest=null;
			}
		},
		onButton:function(event)
		{
			if(event.value===1&&!this.paused)
			{
				for(var i=0;i<this.cursors.length;i++)
				{
					var cursor=this.cursors[i];
					if(!this.assignFilter||this.assignFilter(event,cursor,i))
					{
						var activateTrigger=this.trigger("activate",cursor.getPosition());
						if(activateTrigger.length===0&&cursor.direction)
						{
							var dir=cursor.direction;
							var pos=new SC.point(
								cursor.rect.position.x+(dir.x===0 ? cursor.offset.x : dir.x>0 ? cursor.rect.size.x : 0),
								cursor.rect.position.y+(dir.y===0 ? cursor.offset.y : dir.y<0 ? cursor.rect.size.y : 0)
							);
							activateTrigger=this.trigger("activate",pos);
						}
						for(var t=0;t<activateTrigger.length;t++)
						{
							if(activateTrigger[t].trigger.type==="activate")
							{
								this.fire("trigger",{
									triggerType:"activate",
									image:activateTrigger[t],
									cursor:this.cursors[i],
									value:activateTrigger[t].trigger.value,
									controllerEvent:event
								});
							}
						}
					}
				}
			}
		},
		playAnimation:function(animation)
		{
			var data=this.movingCursors.get(animation.cursor);
			if(!data)
			{
				data={
					direction:null,
					animation:null,
					lastTime:Date.now()-performance.timing.navigationStart
				};
				this.movingCursors.set(animation.cursor,data);
			}
			data.animation=animation;

			if(this.animationRquest===null&&!this.paused)
			{
				this.animationRquest=requestAnimationFrame(this._animateCursor);
			}
		},
		toJSON:function()
		{
			var json=this.map.toJSON();
			json.cursors=this.cursors.slice();
			json.threshold=this.threshold.clone;
			for(var i=0;i<this.cursors.length;i++)
			{
				json.images.splice(json.images.indexOf(this.cursors[i]),1);
			}
			return json;
		},
		fromJSON:function(json)
		{
			this.movingCursors.clear();
			for(var i=0;i<json.images.length;i++)
			{
				json.images[i]=new GUI.Map.Image().fromJSON(json.images[i]);
			}
			for(var i=0;i<json.cursors.length;i++)
			{
				json.images.push(new GUI.Map.Cursor().fromJSON(json.cursors[i]));
			}
			this.map.fromJSON(json);
			this.organizer.clear().add(json.images);
			this.threshold.set(json.threshold);
		}
	});
	GUI.Map.MAX_TIME_DELAY=250;
    GUI.Map.Image=µ.Class(MAP.Image,{
    	init:function(url,position,size,name,collision,trigger){
    		this.superInit(MAP.Image,url,position,size,name);

            this.collision=!!collision;
            this.trigger={
            	type:null,
            	value:null
            };
            if(trigger)
            {
            	this.trigger.type=trigger.type||null;
            	this.trigger.value=trigger.value||null;
            }
    	},
		toJSON:function()
		{
			var json=MAP.Image.prototype.toJSON.call(this);
			json.collision=this.collision;
			json.trigger=this.trigger;
			return json;
		},
		fromJSON:function(json)
		{
			MAP.Image.prototype.fromJSON.call(this,json);
			this.collision=json.collision;
			this.trigger=json.trigger;
			
			return this;
		}
    });
	GUI.Map.Cursor=µ.Class(GUI.Map.Image,{
    	init:function(urls,position,size,offset,name,colision,trigger,speed)
    	{
    		this.superInit(GUI.Map.Image,GUI.Map.Cursor.emptyImage,position,size,name,colision,trigger);
    		this.domElement.classList.add("cursor");
            this.domElement.style.zIndex=GUI.Map.Cursor.zIndexOffset;
            
            Object.defineProperty(this,"backUrl",{
            	enumerable:true,
            	get:function(){return this.domElement.style.backgroundImage;},
            	set:function(url){this.domElement.style.backgroundImage='url("'+url+'")';}
            });
    		this.urls=null;
    		this.setUrls(urls);
    		
    		this.offset=new SC.point(this.rect.size).div(2);
    		this.setOffset(offset);
    		
    		this.speed=new SC.point(200);
    		this.setSpeed(speed);
    		
    		this.direction=null;
    		this.updateDirection();
    	},
        update:function()
        {
        	GUI.Map.Image.prototype.update.call(this);
        },
        updateDirection:function()
        {
        	this.domElement.classList.remove("up","right","down","left");
        	if(this.direction)
        	{
        		// y axis is inverted on screen
	            var direction8=this.direction.clone().mul(1,-1).getDirection8();
	            if(this.urls[direction8]) this.backUrl=this.urls[direction8];
	            else if (direction8!==0&&direction8%2===0&&this.urls[direction8-1]) this.backUrl=this.urls[direction8-1];
	            else this.backUrl=this.urls[0];
	            
	            if(direction8>=1&&(direction8<=2||direction8===8))
	            {
	                this.domElement.classList.add("up");
	            }
	            if(direction8>=2&&direction8<=4)
	            {
	            	this.domElement.classList.add("right");
	            }
	            if(direction8>=4&&direction8<=6)
	            {
	            	this.domElement.classList.add("down");
	            }
	            if(direction8>=6&&direction8<=8)
	            {
	            	this.domElement.classList.add("left");
	            }
            }
        },
    	setOffset:function(numberOrPoint,y)
    	{
    		this.rect.position.add(this.offset);
    		this.offset.set(numberOrPoint,y);
    		this.rect.position.sub(this.offset);
    		this.update();
    	},
    	setPosition:function(numberOrPoint,y)
    	{
            this.rect.position.set(numberOrPoint,y).sub(this.offset);
            this.update();
    	},
    	getPosition:function()
    	{
    		return this.rect.position.clone().add(this.offset);
    	},
    	setSpeed:function(numberOrPoint,y)
    	{
            this.speed.set(numberOrPoint,y);
    	},
    	setUrls:function(urls)
    	{
    		this.urls=[].concat(urls);
    		this.backUrl=this.urls[0];
    		if(this.domElement)this.updateDirection();
    	},
    	move:function(direction,timediff)
    	{
    		this.direction=direction;
    		var distance=new SC.point();
			if(this.map)
			{
				var size=this.map.getSize();
				distance.set(this.direction).mul(this.speed).mul(timediff/1000);
				
				//map boundary
				var pos=this.rect.position.clone().add(this.offset);
				if(pos.x+distance.x<0)
				{
					distance.x=-pos.x;
				}
				else if (pos.x+distance.x>size.x)
				{
					distance.x=size.x-pos.x;
				}
				if(pos.y+distance.y<0)
				{
					distance.y=-pos.y;
				}
				else if (pos.y+distance.y>size.y)
				{
					distance.y=size.y-pos.y;
				}
				//collision
				if(this.collision)
				{
					var progress=1;
					var rect=this.rect.clone();
					rect.position.add(distance);
					var collisions=this.map.gui.collide(rect);
					for(var i=0;i<collisions.length;i++)
					{
						var cImage=collisions[i];
						var p=null;
						if(cImage===this||this.rect.contains(cImage.rect)||cImage.rect.contains(this.rect))
						{//is self or inside
							continue;
						}
						
						if(distance.x>0&&this.rect.position.x+this.rect.size.x<=cImage.rect.position.x)
						{
							p=Math.max(p,(cImage.rect.position.x-this.rect.position.x-this.rect.size.x)/distance.x);
						}
						else if (distance.x<0&&this.rect.position.x>=cImage.rect.position.x+cImage.rect.size.x)
						{
							p=Math.max(p,(cImage.rect.position.x+cImage.rect.size.x-this.rect.position.x)/distance.x);
						}
						
						if(distance.y>0&&this.rect.position.y+this.rect.size.y<=cImage.rect.position.y)
						{
							p=Math.max(p,(cImage.rect.position.y-this.rect.position.y-this.rect.size.y)/distance.y);
						}
						else if (distance.y<0&&this.rect.position.y>=cImage.rect.position.y+cImage.rect.size.y)
						{
							p=Math.max(p,(cImage.rect.position.y+cImage.rect.size.y-this.rect.position.y)/distance.y);
						}
						
						if(p!==null)
						{
							progress=Math.min(progress,p);
						}
					}
					distance.mul(progress);
				}
				GUI.Map.Image.prototype.move.call(this,distance);
			}
			this.updateDirection();
			return distance;
    	},
		toJSON:function()
		{
			var json=GUI.Map.Image.prototype.toJSON.call(this);
			json.offset=this.offset;
			json.speed=this.speed;
			delete json.url;
			json.urls=this.urls.slice();
			return json;
		},
		fromJSON:function(json)
		{
			json.url=GUI.Map.Cursor.emptyImage;
			GUI.Map.Image.prototype.fromJSON.call(this,json);
			this.offset.set(json.offset);
			this.speed.set(json.speed);
			this.setUrls(json.urls);
			
			return this;
		}
    });
	GUI.Map.Cursor.emptyImage="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    GUI.Map.Cursor.zIndexOffset=100;
    GUI.Map.Cursor.Animation=µ.Class({
    	init:function(cursor)
    	{
    		this.cursor=cursor;
    		this.progress=0;
    	},
    	step:function(timeDiff)
    	{
    		SC.debug("Abstract GUI.Map.Cursor.Animation used",SC.debug.LEVEL.WARNING);
    	}
    });
    GUI.Map.Cursor.Animation.Key=µ.Class(GUI.Map.Cursor.Animation,{ //key animation
    	init:function(cursor,keys)
    	{
    		this.superInit(GUI.Map.Cursor.Animation,cursor);
    		this.keys=keys;
    		
    		this.cursor.setPosition(this.keys[0]);
    		this.progress=1;//next key
    	},
    	step:function(timediff)
    	{
    		if(this.keys[this.progress])
    		{
    			var dir=this.cursor.getPosition().negate().add(this.keys[this.progress]);
    			var dist=this.cursor.speed.clone().mul(timediff/1000);
    			if( (dist.x>Math.abs(dir.x)&&dist.y>Math.abs(dir.y)) && (this.keys.length>this.progress+1))
    			{
    				var remaining=dist.clone().sub(dir.abs()).div(dist);
    				dir=new SC.point(this.keys[this.progress+1]).sub(this.keys[this.progress]).mul(remaining).add(this.keys[this.progress]);
    				dir=this.cursor.getPosition().negate().add(dir);
    				this.progress++;
    			}
    			dir.div(dist);
    			var absX=Math.abs(dir.x),absY=Math.abs(dir.y)
    			if(absX>1||absY>1) dir.mul(1/(absX>absY ? absX : absY));
    			else
    			{
    				dir.set(0);
    			}
    			return dir;
    		}
    		else
    		{
    			return new SC.point();
    		}
    	}
    });
	SMOD("GUI.Map",GUI.Map);
	
})(Morgas,Morgas.setModule,Morgas.getModule);
//RPGPlayer/TalePlay.GUIElement.Dialog.js
(function(t,e,i){var s=i("GUIElement"),n=i("shortcut")({proxy:"proxy",tb:"GUI.TextBox",menu:"GUI.Menu"}),o=s.Dialog=t.Class(s,{init:function(t){t=t||{},t.element="fieldset",this.superInit(s,t),this.createListener("dialogEnd"),this.legend=document.createElement("legend"),this.domElement.appendChild(this.legend),this.dialogParts=t.dialogParts?t.dialogParts.slice():[],this.actions=t.actions||[],this.active=null,n.proxy("active",["onAnalogStick","onButton"],this),this.next()},next:function(t){if(this.active&&(this.active.destroy(),this.active.domElement.remove()),this.dialogParts.length>0){for(var e=this.dialogParts.shift(),i=["width","height","top","right","bottom","left"],s=0;i.length>s;s++)this.domElement.style[i[s]]=e[i[s]]||"";e.parts?(this.legend.textContent=e.title,this.active=new n.tb({parts:e.parts}),this.active.addListener("complete:once",this,"next"),this.active.start()):e.choices&&(this.active=new n.menu({items:e.choices,converter:o.MENU_CONVERTER,loop:!1,active:0,selectionType:n.menu.SelectionTypes.NONE}),this.active.addListener("select:once",this,"next")),this.domElement.appendChild(this.active.domElement)}else{var a;a=t&&"select"===t.type&&t.value.actions?this.actions.concat(t.value.actions):this.actions,this.fire("dialogEnd",{actions:a})}}});o.MENU_CONVERTER=function(t){return t.name},e("GUI.Dialog",o)})(Morgas,Morgas.setModule,Morgas.getModule);
//RPGPlayer/TalePlay.RPGPlayer.GameSave.js
(function(t,e,i){var s=i("RPGPlayer"),n=i("DBObj"),o=i("shortcut")({field:"DBField"}),a=s.GameSave=t.Class(n,{objectType:"GameSave",init:function(t){t=t||{},this.superInit(n,t),this.addField("map",o.field.TYPES.String,t.map),this.addField("position",o.field.TYPES.JSON,t.position),this.addField("cursor",o.field.TYPES.JSON,t.cursor),this.addField("quests",o.field.TYPES.JSON,t.quests||[]),this.addField("actions",o.field.TYPES.JSON,t.actions||[]),this.addField("info",o.field.TYPES.String,t.info),this.addField("timeStamp",o.field.TYPES.DATE,t.timeStamp||new Date),this.addField("customData",o.field.TYPES.JSON,t.customData||{})},getMap:function(){return this.getValueOf("map")},setMap:function(t){return this.setValueOf("map",t)},getPosition:function(){return this.getValueOf("position")},setPosition:function(t){return this.setValueOf("position",t)},getCursor:function(){return this.getValueOf("cursor")},setCursor:function(t){return this.setValueOf("cursor",t)},getQuests:function(){return this.getValueOf("quests")},setQuests:function(t){return this.setValueOf("quests",t)},getActions:function(){return this.getValueOf("actions")},setActions:function(t){return this.setValueOf("actions",t)},getInfo:function(){return this.getValueOf("info")},setInfo:function(t){return this.setValueOf("info",t)},getTimeStamp:function(){return this.getValueOf("timeStamp")},setTimeStamp:function(t){return this.setValueOf("timeStamp",t)},getCustomData:function(){return this.getValueOf("customData")},setCustomData:function(t){return this.setValueOf("customData",t)}});e("RPGPlayer.GameSave",a)})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);
//TalePlay.Layer.ActionMenu.js
(function(t,e,i){var s=i("Layer"),n=i("shortcut")({Menu:"GUI.Menu",debug:"debug"}),o=s.ActionMenu=t.Class(s,{init:function(t){t=t||{},this.superInit(s,{mode:s.Modes.LAST}),this.domElement.classList.add("ActionMenu"),this.menu=new n.Menu({styleClass:t.styleClass,items:t.actions,active:t.active||0,loop:t.loop===!0,selectionType:n.Menu.SelectionTypes.NONE,converter:t.converter||o.defaultConverter,disabled:t.disabled}),this.add(this.menu),this.menu.addListener("select",this,"_onSelect")},_onSelect:function(t){"function"==typeof this[t.value.action]?this[t.value.action](t.value):n.debug(t.value.action+" is not a function",n.debug.LEVEL.ERROR)}});o.defaultConverter=function(t){return t.text},e("Layer.ActionMenu",o)})(Morgas,Morgas.setModule,Morgas.getModule);
//TalePlay.Layer.ActionMenu.StartMenu.js
(function(t,e,i){var s=i("Layer.ActionMenu"),n=i("shortcut")({manager:"GUI.ControllerManager",rj:"Request.json",debug:"debug"}),o=s.StartMenu=t.Class(s,{init:function(t){t=t||{},this.superInit(s,{styleClass:["panel","center"],actions:[{text:"New Game",action:"newGame",url:t.newGameUrl},{text:"Controllers",action:"openControllerManager",controllerLayout:t.controllerLayout||{}},{text:"Load",action:"loadSave"},{text:"import from File",action:"fileImport"}]}),this.domElement.classList.add("StartMenu"),this.createListener("start"),this.persistanceLayer="function"==typeof t.persistanceLayer?t.persistanceLayer:i(t.persistanceLayer||"Layer.Persistance"),this.dbConn=t.dbConn,this.saveClass=t.saveClass,this.saveConverter=t.saveConverter},onController:function(t){if("buttonChanged"===t.type&&1==t.value)switch(t.index){case 1:this.menu.setActive(0);break;case 2:s.prototype.onController.call(this,t)}else s.prototype.onController.call(this,t)},newGame:function(t){n.rj(t.url,this).then(function(t,e){var i=new e.saveClass;i.fromJSON(t),e.fire("start",{save:i})},function(t){n.debug(["could not load new game: ",t],n.debug.LEVEL.ERROR)})},openControllerManager:function(t){var e={styleClass:["panel","overlay"],buttons:t.controllerLayout.buttons,analogSticks:t.controllerLayout.analogSticks,dbConn:this.dbConn},i=new n.manager(e);this.add(i),i.update("controllers")},loadSave:function(){var t=new this.persistanceLayer({dbConn:this.dbConn,saveClass:this.saveClass,saveConverter:this.saveConverter});t.addListener("load:once",this,function(t){this.fire("start",{save:t.save}),t.source.destroy()}),this.board.addLayer(t)},fileImport:function(){}});e("StartMenu",o)})(Morgas,Morgas.setModule,Morgas.getModule);
//RPGPlayer/TalePlay.Layer.ActionMenu.GameMenu.js
(function(t,e,i){var s=i("Layer.ActionMenu"),n=i("shortcut")({manager:"GUI.ControllerManager",debug:"debug"}),o=s.GameMenu=t.Class(s,{init:function(t){t=t||{};var e={styleClass:["panel"],actions:[{text:"Controllers",action:"openControllerManager",controllerLayout:t.controllerLayout||{}},{text:"save",action:"saveGame",data:t.saveData},{text:"close",action:"close"}]};t.saveData||(e.disabled=[1]),this.superInit(s,e),this.domElement.classList.add("GameMenu"),this.createListener("start close"),this.persistanceLayer="function"==typeof t.persistanceLayer?t.persistanceLayer:i(t.persistanceLayer||"Layer.Persistance"),this.dbConn=t.dbConn,this.saveClass=t.saveClass,this.saveConverter=t.saveConverter},onController:function(t){if("buttonChanged"===t.type&&1==t.value)switch(t.index){case 1:this.menu.setActive(2);break;case 2:s.prototype.onController.call(this,t)}else s.prototype.onController.call(this,t)},openControllerManager:function(t){var e={styleClass:["panel","overlay"],buttons:t.controllerLayout.buttons,analogSticks:t.controllerLayout.analogSticks,dbConn:this.dbConn},i=new n.manager(e);this.add(i),i.update("controllers")},saveGame:function(t){if(t.data){var e=new this.persistanceLayer({dbConn:this.dbConn,saveClass:this.saveClass,saveConverter:this.saveConverter,saveData:t.data});this.board.addLayer(e)}},close:function(){this.fire("close")}});e("RPGPlayer.GameMenu",o)})(Morgas,Morgas.setModule,Morgas.getModule);
//Morgas/src/Morgas.util.function.proxy.js
(function(t,e,n){var o=t.util=t.util||{},i=o["function"]||{},r=n("shortcut")({it:"iterate"});i.proxy=function(t,e,n){var o=!1,i=!1;switch(typeof t){case"string":o=!0;break;case"function":i=!0}r.it(e,function(e,r,u,c){var s=c?r:e,a=e,h=null;h=o?function(){return this[t][s].apply(this[t],arguments)}:i?function(){var e=t.call(this,s);return e[s].apply(e,arguments)}:function(){return t[s].apply(t,arguments)},n[a]=h})},e("proxy",i.proxy)})(Morgas,Morgas.setModule,Morgas.getModule);
//Morgas/src/Morgas.util.object.equals.js
(function(e,t){var n=e.util=e.util||{},i=n.object||{};i.equals=function(e,t){if(e===t)return!0;if(void 0===e||null===e)return!1;if(t instanceof RegExp)return t.test(e);if("function"==typeof t)return"function"==typeof e?!1:t(e);if("function"==typeof e.equals)return e.equals(t);if("object"==typeof t){if("object"!=typeof e&&Array.isArray(t))return-1!==t.indexOf(e);for(var n in t)if(!i.equals(e[n],t[n]))return!1;return!0}return!1},t("equals",i.equals)})(Morgas,Morgas.setModule,Morgas.getModule);
//Morgas/src/Morgas.util.object.find.js
(function(e,t,n){var i=e.util=e.util||{},r=i.object||{},s=n("shortcut")({eq:"equals",it:"iterate"});r.find=function(e,t,n){var i=[];return s.it(e,function(e,r){s.eq(e,t)&&i.push(n?e:{value:e,index:r})}),i},t("find",r.find)})(Morgas,Morgas.setModule,Morgas.getModule);
//Morgas/src/Morgas.util.object.iterate.js
(function(µ,SMOD,GMOD){

	var util=µ.util=µ.util||{};
	var obj=util.object||{};
	
	/** createIterator
	 * Creates an iterator for {any} in {backward} order.
	 * {isObject} declares {any} as a Map or Array. 
	 */
	//TODO iterator & Set & Map
	obj.createIterator=function* (any,backward,isObject)
	{
		if(any.length>=0&&!isObject)
		{
			for(var i=(backward?any.length-1:0);i>=0&&i<any.length;i+=(backward?-1:1))
			{
				yield [any[i],i];
			}
		}
		else if (typeof any.next==="function"||typeof any.entries==="function")
		{
			if(typeof any.entries==="function")
			{
				any=any.entries();
			}
			var step=null;
			while(step=any.next(),!step.done)
			{
				yield step.value.reverse();
			}
		}
		else
		{
			var k=Object.keys(any);
			if(backward)
			{
				k.revert();
			}
			for(var i=0;i<k.length;i++)
			{
				yield [any[k[i]],k[i]];
			}
		}
		
	};
	/** iterate
	 * Iterates over {any} calling {func} with {scope} in {backward} order.
	 * {isObject} declares {any} as an Object with a length property.
	 * 
	 * returns Array of {func} results
	 */
	//TODO iterator & Set & Map
	obj.iterate=function(any,func,backward,isObject,scope)
	{
		var rtn=[];
		if(!scope)
		{
			scope=window;
		}
		if(any.length>=0&&!isObject)
		{
			for(var i=(backward?any.length-1:0);i>=0&&i<any.length;i+=(backward?-1:1))
			{
				rtn.push(func.call(scope,any[i],i,i,false));
			}
		}
		else if (typeof any.next==="function"||typeof any.entries==="function")
		{
			if(typeof any.entries==="function")
			{
				any=any.entries();
			}
			var step=null,index=0;
			while(step=any.next(),!step.done)
			{
                isObject=step.value[1]!==step.value[0]&&step.value[0]!==index;
				rtn.push(func.call(scope,step.value[1],step.value[0],index,isObject));
                index++;
			}
		}
		else
		{
			var k=Object.keys(any);
			if(backward)
			{
				k.revert();
			}
			for(var i=0;i<k.length;i++)
			{
				rtn.push(func.call(scope,any[k[i]],k[i],i,true));
			}
		}
		return rtn;
	};
	SMOD("Iterator",obj.createIterator);
	SMOD("iterate",obj.iterate);
	
})(Morgas,Morgas.setModule,Morgas.getModule);
//Morgas/src/Morgas.Organizer.js
(function(t,e,n){var r=n("shortcut")({it:"iterate",eq:"equals",path:"goPath"}),s=t.Organizer=t.Class({init:function(t){this.values=[],this.filters={},this.maps={},this.groups={},t&&this.add(t)},add:function(t,e,n){return e&&n&&(this.group(e),this.groups[e].values[n]=[]),r.it(t,function(t){var r=this.values.length;this.values.push(t);for(var s in this.maps)this._map(this.maps[s],r);for(var i in this.filters)this._filter(this.filters[i],r);for(var a in this.groups)this._group(this.groups[a],r);e&&n&&this.groups[e].values[n].push(r)},!1,!1,this),this},remove:function(t){var e=this.values.indexOf(t);if(-1!==e){for(var n in this.filters){var r=this.filters[n].values.indexOf(e);-1!==r&&this.filters[n].values.splice(r,1)}for(var n in this.maps)for(var s=this.maps[n].values,i=Object.keys(s),n=0;i.length>n;n++)if(s[i[n]]===t){delete s[i[n]];break}for(var n in this.groups)for(var a=this.groups[n].values,i=Object.keys(a),n=0;i.length>n;n++){var r=a[i[n]].indexOf(e);if(-1!==r){a[i[n]].splice(r,1);break}}delete this.values[e]}return this},_removeType:function(t,e){delete this[t][e]},clear:function(){for(var t in this.filters)this.filters[t].values.length=0;for(var t in this.maps)this.maps[t].values={};for(var t in this.groups)this.groups[t].values={};return this.values.length=0,this},map:function(t,e){"string"==typeof e&&(e=s._pathWrapper(e)),this.maps[t]={fn:e,values:{}};for(var n=0;this.values.length>n;n++)this._map(this.maps[t],n);return this},_map:function(t,e){var n=""+t.fn(this.values[e]);t.values[n]=e},getMap:function(t){var e={};return null!=this.maps[t]&&r.it(this.maps[t].values,function(t,n){e[n]=this.values[t]},!1,!0,this),e},hasMap:function(t){return!!this.maps[t]},hasMapKey:function(t,e){return this.maps[t]&&e in this.maps[t].values},getMapValue:function(t,e){return this.hasMapKey(t,e)?this.values[this.maps[t].values[e]]:void 0},getMapKeys:function(t){return this.hasMap(t)?Object.keys(this.maps[t].values):[]},removeMap:function(t){return this._removeType("maps",t),this},filter:function(t,e,n){switch(typeof e){case"string":e=s._pathWrapper(e);break;case"object":e=s.filterPattern(e)}"string"==typeof n&&(n=s.pathSort(n)),this.filters[t]={filterFn:e,sortFn:n,values:[]};for(var r=0;this.values.length>r;r++)this._filter(this.filters[t],r);return this},_filter:function(t,e){if(!t.filterFn||t.filterFn(this.values[e]))if(t.sortFn){var n=s.getOrderIndex(this.values[e],this.values,t.sortFn,t.values);t.values.splice(n,0,e)}else t.values.push(e)},hasFilter:function(t){return!!this.filters[t]},getFilter:function(t){var e=[];return null!=this.filters[t]&&r.it(this.filters[t].values,function(t,n){e[n]=this.values[t]},!1,!1,this),e},getFilterValue:function(t,e){return this.filters[t]&&this.filters[t].values[e]?this.values[this.filters[t].values[e]]:void 0},getFilterLength:function(t){return this.filters[t]?this.filters[t].values.length:0},removeFilter:function(t){return this._removeType("filters",t),this},group:function(t,e){if("string"==typeof e&&(e=s._pathWrapper(e)),this.groups[t]={values:{},fn:e},e)for(var n=0;this.values.length>n;n++)this._group(this.groups[t],n);return this},_group:function(t,e){if(t.fn){var n=t.fn(this.values[e]);t.values[n]=t.values[n]||[],t.values[n].push(e)}},hasGroup:function(t){return!!this.groups[t]},getGroup:function(t){var e={};if(this.hasGroup(t))for(var n in this.groups[t].values)e[n]=this.getGroupValue(t,n);return e},getGroupValue:function(t,e){var n=[];if(this.hasGroup(t)&&this.groups[t].values[e])for(var r=this.groups[t].values[e],s=0;r.length>s;s++)n.push(this.values[r[s]]);return n},hasGroupKey:function(t,e){return this.hasGroup(t)&&e in this.groups[t].values},getGroupKeys:function(t){return this.hasGroup(t)?Object.keys(this.groups[t].values):[]},removeGroup:function(t){return this._removeType("groups",t),this},destroy:function(){this.values=this.filters=this.maps=this.groups=null,this.add=this.filter=this.map=this.group=t.constantFunctions.ndef}});s._pathWrapper=function(t){return function(e){return r.path(e,t)}},s.sort=function(t,e,n){return(n?-1:1)*(t>e)?1:e>t?-1:0},s.pathSort=function(t,e){return t=t.split(","),function(n,i){for(var a=0,o=0;t.length>o&&0===a;o++)a=s.sort(r.path(n,t[o]),r.path(i,t[o]),e);return a}},s.filterPattern=function(t){return function(e){return r.eq(e,t)}},s.getOrderIndex=function(t,e,n,r){for(var s=(r?r:e).length,i=Math.ceil(s/2),a=i,o=null;i&&a>0&&s>=a&&(1!==i||-1!==o);){o=i;var u=r?e[r[a-1]]:e[a-1];i=Math.ceil(Math.abs(i)/2)*Math.sign(n(t,u))||1,a+=i}return a=Math.min(Math.max(a-1,0),s)},s.getSortedOrder=function(t,e){var n=[];return r.it(t,function(r,i){var a=s.getOrderIndex(r,t,e,n);n.splice(a,0,i)}),n},e("Organizer",s)})(Morgas,Morgas.setModule,Morgas.getModule);
//GUI/TalePlay.GUIElement.TextBox.js
(function(t,e,i){var s=i("GUIElement"),n=i("shortcut")({rs:"rescope"}),o=s.TextBox=t.Class(s,{init:function(t){n.rs.all(["_run"],this),t=t||{},this.superInit(s,t),this.addStyleClass("TextBox"),this.createListener("complete"),this.parts=[];for(var e=0,i=t.parts&&t.parts.length;i>e;e++){var o=t.parts[e];this.addPart(o.text,o.speed,o.stop,o.styleClass,o.tag)}this._timeout=null},addPart:function(t,e,i,s,n){this.parts.push({text:t||"",speed:1e3/e||25,stop:!!i,styleClass:s,tag:n||"span"})},start:function(){null===this._timeout&&(this.domElement.classList.remove("complete","stop"),this._run())},_run:function(){if(this._timeout=null,this.parts.length>0){var t=this.parts[0];if(t.domElement||(t.domElement=document.createElement(t.tag),t.styleClass&&t.domElement.classList.add(t.styleClass),this.domElement.appendChild(t.domElement)),t.domElement.textContent+=t.text[t.domElement.textContent.length],t.domElement.textContent.length===t.text.length&&(this.parts.shift(),t.stop))return this.domElement.classList.add("stop"),void 0;this._timeout=setTimeout(this._run,t.speed)}else this.domElement.classList.add("complete")},show:function(t){for(null!==this._timeout&&(clearTimeout(this._timeout),this._timeout=null);this.parts.length>0;){var e=this.parts[0];if(e.domElement||(e.domElement=document.createElement(e.tag),e.domElement.classList.add(e.styleClass),this.domElement.appendChild(e.domElement)),e.domElement.textContent=e.text,this.parts.splice(0,1),t&&e.stop)return this.domElement.classList.add("stop"),void 0}this.domElement.classList.add("complete")},onButton:function(t){1==t.value&&(null===this._timeout?0===this.parts.length?this.fire("complete"):this.start():this.show(!0))}});e("GUI.TextBox",o)})(Morgas,Morgas.setModule,Morgas.getModule);
//TalePlay.Layer.Persistance.js
(function(t,e,s){var i=s("Layer"),n=s("shortcut")({rs:"rescope",Menu:"GUI.Menu",debug:"debug",download:"download"}),o=i.Persistance=t.Class(i,{init:function(t){t=t||{},this.superInit(i,{mode:i.Modes.LAST}),n.rs.all(["_update","_fillMenu"],this),this.createListener("load"),this.domElement.classList.add("Persistance"),this.dbConn=t.dbConn,this.saveClass=t.saveClass,this.saveData=t.saveData,this.menu=new n.Menu({type:t.type||n.Menu.Types.TABLE,styleClass:"center",active:t.active||0,loop:t.loop===!0,selectionType:n.Menu.SelectionTypes.NONE,converter:t.saveConverter}),this.add(this.menu),this.menu.addListener("select",this,"_onSelect"),this._update()},onController:function(t){if("buttonChanged"===t.type&&1==t.value)switch(t.index){case 1:this.GUIElements.length>1?this.GUIElements[1].setActive(3):this.destroy();break;case 2:i.prototype.onController.call(this,t)}else i.prototype.onController.call(this,t)},_update:function(){return this.dbConn.load(this.saveClass,{}).then(this._fillMenu),null},_fillMenu:function(t){this.menu.clear();for(var e=[],s=0;t.length>s;s++)e[t[s].getID()]=t[s];return e.push(null),this.menu.addAll(e),-1===this.menu.getActive().index&&this.menu.setActive(0),null},_onSelect:function(t){if(t.value){var e=new n.Menu({styleClass:["panel","center"],items:[this.saveData?"Save":"Load","Export","Delete","Cancel"],active:0,loop:!1,selectionType:n.Menu.SelectionTypes.NONE});e.addListener("select",this,"_onSubSelect"),this.add(e)}else this.saveData&&(this.saveData.setID(t.index),this.dbConn.save([this.saveData]).then(this._update))},_onSubSelect:function(t){switch(t.value){case"Load":this.fire("load",{save:this.menu.getActive().value});break;case"Save":this.saveData.setID(this.menu.getActive().index),this.dbConn.save([this.saveData]).then(this._update);break;case"Export":n.download(JSON.stringify(this.menu.getActive().value),"save.json","application/json");break;case"Delete":this.dbConn["delete"](this.saveClass,[this.menu.getActive().value]).then(this._update);break;case"Cancel":}t.source.destroy()}});e("Layer.Persistance",o)})(Morgas,Morgas.setModule,Morgas.getModule);
//Morgas/src/Morgas.util.object.goPath.js
(function(e,t){var n=e.util=e.util||{},i=n.object||{};i.goPath=function(e,t,n){var i=t;for("string"==typeof i&&(i=i.split("."));i.length>0&&e;)!n||i[0]in e||(e[i[0]]={}),e=e[i.shift()];return i.length>0?void 0:e},t("goPath",i.goPath)})(Morgas,Morgas.setModule,Morgas.getModule);
//Morgas/src/Morgas.util.download.js
(function(e,t){var n=e.util=e.util||{};n.download=function(e,t,i){e instanceof Blob&&(e=URL.createObjectURL(e)),t=t||"file",i=i||"",n.download.el.download=t,n.download.el.href=e.startsWith("data:")||e.startsWith("blob:")?e:"data:"+i+";base64,"+btoa(unescape(encodeURIComponent(e))),document.body.appendChild(n.download.el),n.download.el.click(),n.download.el.remove()},n.download.el=document.createElement("a"),t("download",n.download)})(Morgas,Morgas.setModule,Morgas.getModule);