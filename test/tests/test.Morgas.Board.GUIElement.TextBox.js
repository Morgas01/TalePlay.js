(function() {
	var name="TextBox";
	var SC=µ.getModule("shortcut")({
		Board:"Board",
		Layer:"Layer",
		Tb:"GUI.TextBox"
	});
	module(name);
	test(name, function() {
		var board = getBoard(name),
		layer=new SC.Layer(),
		box=new SC.Tb({
			styleClass:"panel",
			parts:[
				{
					text:"Test text",
					speed:125,
					stop:true
				}
			]
		});

		layer.add(box);
		board.addLayer(layer); 

		box.start();
		
		box.addPart("\nvery fast text",50,true);
		box.addPart("\nbold",undefined,true,undefined,"b");
		box.addPart("\nslow text",4,true);
		box.addPart("\nend.");
		
		ok(true);
	});
})();