(function(µ,SMOD,GMOD){
	
	var Layer=GMOD("Layer")

	var SC=µ.getModule("shortcut")({
		Map:"GUI.Map",
		Menu:"GUI.Menu",
		_menu:"Menu",
	});
	var MapMaker=Layer.MapMaker=µ.Class(Layer,{
		init:function(param)
		{
			param=param||{};
			this.superInit(Layer)
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
				styleClass:"images",
				type:SC.Menu.Types.VERTICAL,
				selectionType:SC._menu.SelectionTypes.none,
				columns:1,
				converter:function(item,index,selected){
					return '<img src="'+item.url+'">';
				}
			});
			this.add(this.images);
			
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