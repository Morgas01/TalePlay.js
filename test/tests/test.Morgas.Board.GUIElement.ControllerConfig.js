(function() {
	
	var name="ControllerConfig";
	var SC=µ.getModule("shortcut")({
		Board:"Board",
		KCon:"Controller.Keyboard",
		Config:"GUI.ControllerConfig",
	});
	module(name);
	test(name, function() {
		var board = getBoard(name),
		layer=new SC.Board.Layer(),
		config=new SC.Config({
			controller:new SC.KCon(),
			buttons:10,
			analogSticks:2
		});
		
		board.addLayer(layer);
		layer.add(config);
		
		config.addListener("submit",function(event)
		{
			document.getElementById("logger").value=JSON.stringify(event,function(key,value){if(key!=="source")return value})+"\n"+JSON.stringify(this.getMapping(),null,"\t");
		});
		
		ok(true);
	});
})();