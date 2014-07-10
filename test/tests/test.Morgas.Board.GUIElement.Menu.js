(function() {
	var name="Menu";
	var SC=µ.getModule("shortcut")({
		Board:"Board",
		gMenu:"GUI.Menu",
		menu:"Menu"
	});
	module(name);
	test(name, function() {
		var board = getBoard(name),
		layer=new SC.Board.Layer(),
		vMenu=new SC.gMenu({
			type:SC.gMenu.Types.VERTICAL,
			items:[
		       "item1",
		       "item2",
		       "item3",
		       "item4",
		       "item5"
			]
		}),
		hMenu=new SC.gMenu({
			type:SC.gMenu.Types.HORIZONTAL,
			selectionType:SC.menu.SelectionTypes.single,
			items:[
				{val:1},
				{val:2},
				{val:3},
				{val:4},
				{val:5}
			],
			converter:function(val,index)
			{
				return "obj"+index+":"+val.val;
			}
		}),
		tMenu=new SC.gMenu({
			type:SC.gMenu.Types.TABLE,
			items:[
				{val:1},
				{val:2},
				{val:3},
				{val:4},
				{val:5}
			],
			converter:function(val,index)
			{
				return [index,val.val,JSON.stringify(val)];
			}
		});

		layer.add(vMenu);
		layer.add(hMenu);
		layer.add(tMenu);

		vMenu.domElement.classList.add("panel");
		hMenu.domElement.classList.add("panel");
		tMenu.domElement.classList.add("panel");
		
		board.addLayer(layer); 

		var height=hMenu.domElement.getBoundingClientRect().height+5+"px",
		width=vMenu.domElement.getBoundingClientRect().width+5+"px";

		vMenu.domElement.style.top=height;
		tMenu.domElement.style.top=height;
		tMenu.domElement.style.left=width;
		
		ok(true);
	});
})();