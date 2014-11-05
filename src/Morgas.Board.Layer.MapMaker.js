(function(µ,SMOD,GMOD){
	
	var Layer=GMOD("Layer");

	var SC=µ.getModule("shortcut")({
		rs:"rescope",
		Map:"GUI.Map",
		_map:"Map",
		Menu:"GUI.Menu",
		_menu:"Menu",
		setIn:"setInputValues",
		getIn:"getInputValues"
	});
	
	var imageLayer=µ.Class(Layer,{
		init:function(board,image,callback,scope)
		{
			this.image=image||{name:"",rect:{position:{x:0,y:0},size:{x:0,y:0}}};
			this.callback=callback;
			this.scope=scope||this;
			this.image.trigger=this.image.trigger||{value:""};
			this.superInit(Layer);
			SC.rs.all(["onClick"],this);
			this.domElement.classList.add("overlay","imageLayer");
			this.domElement.innerHTML='<div class="panel">'+
				'<table>'+
					'<tr><td>Name</td><td><input type="text" data-field="name"></td></tr>'+
					'<tr><td>Position</td><td>X</td><td><input type="number" min="0" data-path="rect.position" data-field="x"></td>'+
						'<td>Y</td><td><input type="number" min="0"  data-path="rect.position" data-field="y"></td></tr>'+
					'<tr><td>Size</td><td>X</td><td><input type="number" min="0" data-path="rect.size" data-field="x"></td>'+
						'<td>Y</td><td><input type="number" min="0"  data-path="rect.size" data-field="y"></td></tr>'+
					'<tr><td>Collision</td><td><input type="checkbox" data-field="collision"></td></tr>'+
					'<tr><td>Trigger type</td><td><select data-path="trigger" data-field="type"><option>none</option>'+
						'<option value="activate">activate</option><option value="step">step</option><option value="move" disabled>move</option></select></td></tr>'+
					'<tr><td>Trigger value</td><td><input type="text" data-path="trigger" data-field="value"></td></tr>'+
					'</table>'+
				'<button data-action="ok">OK</button><button data-action="cancel">cancel</button>'+
			'</div>';
			SC.setIn(this.domElement.querySelectorAll("[data-field]"),this.image);
			
			this.domElement.addEventListener("click",this.onClick,false);
			board.addLayer(this);
			//this.domElement.querySelector('[data-field="name"]').focus();
		},
		onClick:function(e)
		{
			e.stopPropagation();
			switch(e.target.dataset.action)
			{
				case "ok":
					SC.getIn(this.domElement.querySelectorAll("[data-field]"),this.image);
				case "cancel":
					this.board.removeLayer(this);
					this.callback.call(this.scope,this.image,e.target.dataset.action);
					this.image=this.callback=this.scope=undefined;
					break;
			}
		}
	});
	
	var MapMaker=Layer.MapMaker=µ.Class(Layer,{
		init:function(param)
		{
			param=param||{};
			this.superInit(Layer);
			SC.rs.all(["placeImage"],this);
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
				}
			});
			this.add(this.images);
			this.images.addListener("select",this.placeImage);
			
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
					this.GUIElements[i].onButton(event);
					break;
			}
		},
		addImages:function(imageSrc)
		{
			if(imageSrc)
			{
				var images=[].concat(imageSrc).map(function(val)
				{
					return (val instanceof File ? {file:val,url:URL.createObjectURL(val)} : {url:val});
				});
				this.images.addAll(images);
			}
		},
		placeImage:function(e){
			new imageLayer(this.board,new SC._map.Image(e.value.url),function(image,action){
				if(action==="ok")
				{
					this.map.addImages(image);
					image.update();
					this.map.updateSize();
				}
				this.board.focus();
			},this);
		},
		toJSON:function()
		{
			//TODO
		},
		fromJSON:function()
		{
			//TODO
		}
	});
	SMOD("MapMaker",MapMaker);
})(Morgas,Morgas.setModule,Morgas.getModule);