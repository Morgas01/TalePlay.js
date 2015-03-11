(function(µ,SMOD,GMOD){
	
	var Layer=GMOD("Layer");

	var SC=µ.getModule("shortcut")({
		rs:"rescope",
		setIn:"setInputValues",
		getIn:"getInputValues",
		Map:"GUI.Map",
		Menu:"GUI.Menu"
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
			SC.rs.all(["onClick"],this);
			this.domElement.classList.add("overlay","imageLayer");
			this.domElement.innerHTML='<div class="panel">'+
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
	
	var MapMaker=Layer.MapMaker=µ.Class(Layer,{
		init:function(param)
		{
			param=param||{};
			this.mega();
			this.domElement.classList.add("MapMaker");
			if(param.board)
			{
				param.board.addLayer(this);
			}
			this.imageLayerParam=param.imageLayer||{};
			this.map=new SC.Map({
				cursors:new SC.Map.Cursor(param.cursorImage||"../Images/cursor_target.svg",0,{x:100,y:100},{x:50,y:50})
			});
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
					this.GUIElements[i].onAnalogStick(event);
					break;
				case "buttonChanged":
                    if(i===0)
                    {
                        this.selectImage(event);
                    }
                    else
                    {
                        this.GUIElements[1].onButton(event);
                    }
					break;
			}
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
                onAction:this.imageLayerParam.onAction,
           });
		},
        selectImage:function()
        {
            var pos=this.map.cursors[0].getPosition();
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
	                onAction:this.imageLayerParam.onAction,
	           });
            }
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