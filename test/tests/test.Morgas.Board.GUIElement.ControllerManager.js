(function() {
	
	var name="ControllerManager";
	var SC=µ.getModule("shortcut")({
		Board:"Board",
		Layer:"Layer",
		Manager:"GUI.ControllerManager"
	});
	module(name);
	test(name, function() {
		var board = getBoard(name),
		layer=new SC.Layer(),
		manager=new SC.Manager({styleClass:"panel"});
		
		board.addLayer(layer);
		layer.add(manager);
		manager.update();
		ok(true);
	});
})();