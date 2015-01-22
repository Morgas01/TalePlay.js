(function() {
	
	let name="ControllerManager";
	let SC=µ.getModule("shortcut")({
		Board:"Board",
		Layer:"Layer",
		Manager:"GUI.ControllerManager"
	});
	module(name);
	test(name, function() {
		let board = getBoard(name),
		layer=new SC.Layer(),
		manager=new SC.Manager({styleClass:"panel"});
		
		board.addLayer(layer);
		layer.add(manager);
		manager.update();
		ok(true);
	});
})();