(function(µ,SMOD,GMOD,HMOD,SC){
	
	var name="ControllerConfig";
	var SC=SC({
		Board:"Board",
		Layer:"Layer",
		KCon:"Controller.Keyboard",
		Config:"GUI.ControllerConfig"
	});
	module(name);
	test(name, function() {
		var board = getBoard(name),
		layer=new SC.Layer(),
		config=new SC.Config({
			controller:new SC.KCon(),
			buttons:10,
			analogSticks:2
		});
		
		board.addLayer(layer);
		layer.add(config);
		
		config.addListener("submit",config,function(event)
		{
			document.getElementById("logger").value=JSON.stringify(event,function(key,value){if(key!=="source")return value})+"\n"+JSON.stringify(this.getMapping(),null,"\t");
		});
		
		ok(true);
	});
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);