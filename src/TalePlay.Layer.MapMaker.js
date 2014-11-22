(function(µ,SMOD,GMOD){
	
	var Layer=GMOD("Layer");

	var SC=µ.getModule("shortcut")({
		rs:"rescope",
		setIn:"setInputValues",
		getIn:"getInputValues",
		Map:"GUI.Map",
		_map:"Map",
		Menu:"GUI.Menu",
		_menu:"Menu"
	});
	
	var imageLayer=µ.Class(Layer,{
		init:function(board,image,callback,scope)
		{
			this.image=image;
			this.callback=callback;
			this.scope=scope||this;
			this.image.trigger=this.image.trigger||{value:""};
			this.superInit(Layer);
			SC.rs.all(["onClick"],this);
			this.domElement.classList.add("overlay","imageLayer");
			this.domElement.innerHTML='<div class="panel">'+
				'<table>'+
					'<tr><td>Name</td><td><input type="text" name="name"></td></tr>'+
					'<tr><td>Position</td><td>X</td><td><input type="number" min="0" data-path="rect.position" name="x"></td>'+
						'<td>Y</td><td><input type="number" min="0"  data-path="rect.position" name="y"></td></tr>'+
					'<tr><td>Size</td><td>X</td><td><input type="number" min="0" data-path="rect.size" name="x"></td>'+
						'<td>Y</td><td><input type="number" min="0"  data-path="rect.size" name="y"></td></tr>'+
					'<tr><td>Collision</td><td><input type="checkbox" name="collision"></td></tr>'+
					'<tr><td>Trigger type</td><td><select data-path="trigger" name="type"><option>none</option>'+
						'<option value="activate">activate</option><option value="step">step</option><option value="move" disabled>move</option></select></td></tr>'+
					'<tr><td>Trigger value</td><td><input type="text" data-path="trigger" name="value"></td></tr>'+
					'</table>'+
				'<button data-action="ok">OK</button><button data-action="cancel">cancel</button>'+(image.map ? '<button data-action="remove">remove</button>':'')+
			'</div>';
			SC.setIn(this.domElement.querySelectorAll("[name]"),this.image);
			
			this.domElement.addEventListener("click",this.onClick,false);
			board.addLayer(this);
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
						break;
					case "cancel":
						//does nothing
						break;
					case "remove":
						//does nothing
						break;
				}
				this.callback.call(this.scope,this.image,e.target.dataset.action);
				this.destroy();
			}
		},
		destroy:function()
		{
			this.image=this.callback=this.scope=undefined;
			Layer.prototype.destroy.call(this);
		}
	});
	
	var MapMaker=Layer.MapMaker=µ.Class(Layer,{
		init:function(param)
		{
			param=param||{};
			this.superInit(Layer);
			this.domElement.classList.add("MapMaker");
			if(param.board)
			{
				param.board.addLayer(this);
			}
			this.map=new SC.Map({
				cursors:new SC.Map.Cursor("../Images/cursor_target.svg",0,{x:100,y:100},{x:50,y:50})
			});
			this.add(this.map);
			this.images=new SC.Menu({
				styleClass:["images","panel"],
				type:SC.Menu.Types.VERTICAL,
				selectionType:SC._menu.SelectionTypes.none,
				columns:1,
				converter:function(item,index,selected){
					return '<img src="'+item.url+'">';
				},
                items:param.images
			});
			this.add(this.images);
			this.images.addListener("select",this,this.placeImage);
			
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
					else
					{
						rtn.url=val;
					}
					return rtn;
				});
				this.images.addAll(images);
			}
		},
		placeImage:function(e)
        {
			new imageLayer(this.board,new SC._map.Image(e.value.url,0,100),function(image,action){
				if(action==="ok")
				{
					this.map.add(image);
					image.update();
					this.map.updateSize();
				}
				this.board.focus();
			},this);
		},
        selectImage:function()
        {
            var pos=this.map.cursors[0].getPosition();
            var image=this.map.getImages(val => val!==this.map.cursors[0]&&val.rect.contains(pos))[0];
            if(image)
            {
                new imageLayer(this.board,image,function(image,action)
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
                },this);
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