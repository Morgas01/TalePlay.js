(function(µ,SMOD,GMOD){
	
	var Layer=GMOD("Layer");

	var SC=µ.getModule("shortcut")({
		rs:"rescope",
		setIn:"setInputValues",
		getIn:"getInputValues",
		Map:"GUI.Map",
		Menu:"GUI.Menu",
		Point:"Math.Point",
		Rect:"Math.Rect"
	});
	
	//inner class
	var imageLayer=µ.Class(Layer,{
		init:function(param)
		{
			this.image=param.image;
			this.callback=param.callback;
			this.scope=param.scope||this;
			this.image.trigger=this.image.trigger||{value:""};
			
			this.getTriggerValueHTML=param.getTriggerValueHTML||this.getTriggerValueHTML;
			this.getTriggerValue=param.getTriggerValue||this.getTriggerValue;
			this.onAction=param.onAction||this.onAction;
			
			this.mega();
			SC.rs.all(this,["onClick"]);
			this.domElement.classList.add("overlay","imageLayer");
			this.domElement.innerHTML='<div class="panel center">'+
				'<table>'+
					'<tr><td>Name</td><td colspan="100%"><input type="text" name="name"></td></tr>'+
					'<tr><td>Position</td><td>X</td><td><input type="number" min="0" data-path="rect.position" name="x"></td>'+
						'<td>Y</td><td colspan="100%"><input type="number" min="0"  data-path="rect.position" name="y"></td></tr>'+
					'<tr><td>Size</td><td>X</td><td><input type="number" min="0" data-path="rect.size" name="x"></td>'+
						'<td>Y</td><td colspan="100%"><input type="number" min="0"  data-path="rect.size" name="y"></td></tr>'+
					'<tr><td>Collision</td><td colspan="100%"><input type="checkbox" name="collision"></td></tr>'+
					'<tr><td>Trigger type</td><td colspan="100%"><select data-path="trigger" name="type"><option>none</option>'+
						'<option value="activate">activate</option><option value="step">step</option><option value="move" disabled>move</option></select></td></tr>'+
					'<tr class="triggerValue"><td>'+this.getTriggerValueHTML(this.image)+'</td></tr>'+
					'</table>'+
				'<button data-action="ok">OK</button><button data-action="cancel">cancel</button>'+(this.image.map ? '<button data-action="remove">remove</button>':'')+
			'</div>';
			SC.setIn(this.domElement.querySelectorAll("[name]"),this.image);
			
			this.domElement.addEventListener("click",this.onClick,false);
			this.domElement.addEventListener("change",this.onClick,false);
			param.board.addLayer(this);
			this.domElement.querySelector('[name="name"]').focus();
		},
		onClick:function(e)
		{
			var action=e.target.dataset.action;
			if(action)
			{
				e.stopPropagation();
				switch(e.target.dataset.action)
				{
					case "ok":
						SC.getIn(this.domElement.querySelectorAll("[name]"),this.image);
						this.image.trigger.value=this.getTriggerValue(this.domElement.querySelector(".triggerValue"));
						break;
					case "cancel":
						//does nothing
						break;
					case "remove":
						//does nothing
						break;
					default:
						this.onAction(this.image,e.target.dataset.action,e);
						return; //do not close layer on other actions
				}
				this.callback.call(this.scope,this.image,e.target.dataset.action);
				this.destroy();
			}
		},
		destroy:function()
		{
			this.image=this.callback=this.scope=undefined;
			this.mega();
		},
		
		getTriggerValueHTML:function(image)
		{
			return 'Trigger value</td><td colspan="100%"><input type="text" data-path="trigger" name="value">';
		},
		getTriggerValue:function(tr)
		{
			tr.childNodes[1].childNodes[0].value;
		},
		onAction:function(image,action,event){}//dummy
	});
	//inner class
	var cloneLayer=µ.Class(Layer,{
		init:function(param)
		{
			this.mega();
			this.image=param.image;
			this.map=param.map;
			SC.rs.all(this,["onClick"]);
			this.domElement.classList.add("overlay","cloneLayer");
			this.domElement.innerHTML='<form class="panel center" onsubmit="return false">'+
				'<table>'+
					'<tr>'+
						'<td>Position</td><td>X</td><td><input type="number" min="0" name="x" value="'+(this.image.rect.position.x+this.image.rect.size.x)+'" required="required"></td>'+
						'<td>Y</td><td><input type="number" min="0" name="y" value="'+(this.image.rect.position.y)+'" required="required"></td>'+
					'</tr>'+
					'<tr>'+
						'<td></td>'+
						'<td>Rows</td><td><input type="number" min="1" name="rows" value="1" required="required"></td>'+
						'<td>Cols</td><td><input type="number" min="1" name="cols" value="1" required="required"></td>'+
					'</tr>'+
				'</table>'+
				'<button data-action="ok">OK</button><button data-action="cancel">cancel</button>'+
			'</form>';
			SC.setIn(this.domElement.querySelectorAll("[name]"),this.image);
			
			this.domElement.addEventListener("click",this.onClick,false);
			this.domElement.addEventListener("change",this.onClick,false);
			param.board.addLayer(this);
			this.domElement.querySelector('[name="rows"]').focus();
		},
		onClick:function(e)
		{
			var action=e.target.dataset.action;
			if(action)
			{
				e.stopPropagation();
				switch(e.target.dataset.action)
				{
					case "ok":
						var form=this.domElement.children[0];
						if(form.checkValidity())
						{
							var data=SC.getIn(this.domElement.querySelectorAll("[name]"));
							var imageJSON=this.image.toJSON();
							var pos=new SC.Point(data.x,data.y);
							for(var r=0;r<data.rows;r++)
							{
								for(var c=0;c<data.cols;c++)
								{
									var img=new SC.Map.Image();
									img.fromJSON(imageJSON);
									img.rect.position.set(pos).add(img.rect.size.x*c,img.rect.size.y*r);
									this.map.add(img);
								}
							}
							this.map.updateSize();
						}
						else return;
						break;
					case "cancel":
						//does nothing
						break;
				}
				this.board.focus();
				this.destroy();
			}
		}
	});//inner class
	var moveLayer=µ.Class(Layer,{
		init:function(param)
		{
			this.mega();
			this.images=param.images;
			SC.rs.all(this,["onClick"]);
			this.move=new SC.Point();
			this.domElement.classList.add("overlay","moveLayer");
			this.domElement.innerHTML='<form class="panel center" onsubmit="return false">'+
				'<table>'+
					'<tr>'+
						'<td>Position</td><td>X</td><td><input type="number" name="x" required="required"></td>'+
						'<td>Y</td><td><input type="number" name="y" required="required"></td>'+
					'</tr>'+
				'</table>'+
				'<button data-action="ok">OK</button><button data-action="cancel">cancel</button>'+
			'</form>';
			SC.setIn(this.domElement.querySelectorAll("[name]"),this.move);

			this.domElement.addEventListener("click",this.onClick,false);
			param.board.addLayer(this);
			this.domElement.querySelector('input').focus();
		},
		onClick:function(e)
		{
			var action=e.target.dataset.action;
			if(action)
			{
				e.stopPropagation();
				switch(e.target.dataset.action)
				{
					case "ok":
						var form=this.domElement.children[0];
						if(form.checkValidity())
						{
							SC.getIn(this.domElement.querySelectorAll("[name]"),this.move);
							if(!this.move.equals(0))
							{
								for(var image of this.images)
								{
									image.rect.position.add(this.move);
									image.update();
								}
							}
							else break;
						}
						else return;
						break;
					case "cancel":
						//does nothing
						break;
				}
				this.board.focus();
				this.destroy();
			}
		}
	});
	
	var MapMaker=Layer.MapMaker=µ.Class(Layer,{
		init:function(param)
		{
			param=param||{};
			this.mega();
			SC.rs.all(this,["onClick","onMouseDown"]);
			this.domElement.classList.add("MapMaker");
			if(param.board)
			{
				param.board.addLayer(this);
			}
			this.imageLayerParam=param.imageLayer||{};
			this.map=new SC.Map({
				cursors:new SC.Map.Cursor(param.cursorImage||"../Images/cursor_target.svg",0,{x:100,y:100},{x:50,y:50})
			});
			this.map.domElement.addEventListener("click",this.onClick,false);
			this.map.domElement.addEventListener("mousedown",this.onMouseDown,false);
			this.add(this.map);
			this.images=new SC.Menu({
				styleClass:["images","panel"],
				type:SC.Menu.Types.VERTICAL,
				selectionType:SC.Menu.SelectionTypes.NONE,
				columns:1,
				converter:function(item,index,selected){
					return '<img src="'+item.url+'">';
				}
			});
			if(param.images) this.addImages(param.images);
			this.add(this.images);
			this.images.addListener("select",this,"placeImage");
			
			this.map.setPosition(0);
		},
		onController:function(event)
		{
			var i=Math.min(event.index,1);
			switch(event.type)
			{
				case "analogStickChanged":
					if(this.GUIElements[event.index]) this.GUIElements[event.index].onAnalogStick(event);
					break;
				case "buttonChanged":
                    switch(event.index)
                    {
                    	case 0:
                    		this.selectImage();
                    		break;
                    	case 1:
                    		this.GUIElements[1].onButton(event);
                    		break;
                    	case 2:
                    		this.cloneImage(event);
                    }
			}
		},
		onClick:function(event)
		{
			this.selectImage(event);
		},
		addImages:function(imageSrc)
		{
			if(imageSrc)
			{
				var images=[].concat(imageSrc).map(function(val)
				{
					var rtn={url:undefined};
					if(val instanceof File)
					{
						rtn.url=URL.createObjectURL(val);
						rtn.fileType=val.type;
						var reader=new FileReader();
						reader.onload=function(e)
						{
							rtn.file=Array.slice(new Uint8Array(e.target.result,0,e.target.result.byteLength));
						};
						reader.readAsArrayBuffer(val);
					}
					else if(typeof val==="string")
					{
						rtn.url=val;
					}
					else
					{
						rtn=val;
					}
					return rtn;
				});
				this.images.addAll(images);
			}
		},
		placeImage:function(e)
        {
            new imageLayer({
            	board:this.board,
            	image:new SC.Map.Image(e.value.url,this.map.cursors[0].getPosition(),100),
            	callback:function(image,action)
            	{
    				if(action==="ok")
    				{
    					this.map.add(image);
    					image.update();
    					this.map.updateSize();
    				}
    				this.board.focus();
    			},
                scope:this,
                
                getTriggerValueHTML:this.imageLayerParam.getTriggerValueHTML,
                getTriggerValue:this.imageLayerParam.getTriggerValue,
                onAction:this.imageLayerParam.onAction
           });
		},
        selectImage:function(clickEvent)
        {
            var pos=null;
            if (clickEvent)
            {
            	pos=this.map.getPositionOnMap(new SC.Point(clickEvent.clientX,clickEvent.clientY).sub(this.map.domElement.getBoundingClientRect()));
            }
            else pos=this.map.cursors[0].getPosition();
            var image=this.map.getImages(val => val!==this.map.cursors[0]&&val.rect.contains(pos))[0];
            if(image)
            {
                new imageLayer({
                	board:this.board,
                	image:image,
                	callback:function(image,action)
	                {
	                	if(action==="ok")
	                	{
		                    image.update();
	                	}
	                    else if(action==="remove")
	    				{
	    					image.remove();
	    				}
	                	if(action!=="cancel")
	                	{
	    					this.map.updateSize();
	                	}
	                    this.board.focus();
	                },
	                scope:this,
	                
	                getTriggerValueHTML:this.imageLayerParam.getTriggerValueHTML,
	                getTriggerValue:this.imageLayerParam.getTriggerValue,
	                onAction:this.imageLayerParam.onAction
	           });
            }
        },
        cloneImage:function()
        {
        	var cursor=this.map.cursors[0];
            var pos=cursor.getPosition();
            var image=this.map.getImages(val => val!==cursor&&val.rect.contains(pos))[0];
            if(image)
            {
            	new cloneLayer({
            		board:this.board,
            		map:this.map,
            		image:image
            	});
            }
        },
        onMouseDown:function(downEvent)
        {
        	var map=this.map, el=map.domElement, dragging=false, box=null, cursor=map.cursors[0], cr=el.getBoundingClientRect(),area=new SC.Rect();
        	el.setCapture();
			downEvent.preventDefault();
			var onMove = function (moveEvent)
			{
				moveEvent.preventDefault();
				if(!dragging)
				{
					var x=downEvent.clientX-moveEvent.clientX,y=downEvent.clientY-moveEvent.clientY;
					if(x*x+y*y>20*20)
					{
						dragging=true;
						box=document.createElement("div");
						box.classList.add("marker");
						el.appendChild(box);
					}
				}
				else
				{
					area.setAbsolute(downEvent.clientX,downEvent.clientY,moveEvent.clientX,moveEvent.clientY);
					area.position.sub(cr);
					box.style.top=area.position.y+"px";
					box.style.left=area.position.x+"px";
					box.style.height=area.size.y+"px";
					box.style.width=area.size.x+"px";
				}
			};
			var onUp=(upEvent)=>
			{
				el.removeEventListener("mousemove",onMove,false);
				el.removeEventListener("mouseup",onUp,false);
				if(dragging)
				{
					upEvent.preventDefault();
					box.remove();

					area.setPosition(map.getPositionOnMap(area.position));
					var selectedImages=map.getImages(val => val!==cursor&&area.containsRect(val.rect));
					if(selectedImages.length>0) new moveLayer({
						board:this.board,
						images:selectedImages
					});
				}
			};
			el.addEventListener("mousemove",onMove,false);
			el.addEventListener("mouseup",onUp,false);
        },
		toJSON:function()
		{
			return {
				map:this.map,
				images:this.images.menu.items
			};
		},
		fromJSON:function(json)
		{
			for(var i=0;i<json.images.length;i++)
			{
				if(json.images[i].file)
				{
					var oldUrl=json.images[i].url;
					json.images[i].url=URL.createObjectURL(new Blob([new Uint8Array(json.images[i].file)],{type:json.images[i].fileType}));
					var mapImages=json.map.map.images;
					for(var l=0;l<mapImages.length;l++)
					{
						if(mapImages[l].url===oldUrl)
						{
							mapImages[l].url=json.images[i].url;
						}
					}
				}
			}
			this.map.fromJSON(json.map);
			this.images.clear();
			this.images.addAll(json.images);
			return this;
		}
	});
	SMOD("MapMaker",MapMaker);
})(Morgas,Morgas.setModule,Morgas.getModule);