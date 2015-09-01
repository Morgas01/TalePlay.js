(function(µ,SMOD,GMOD,HMOD,SC){
	
	var name="ControllerManager";
	var SC=SC({
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
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);