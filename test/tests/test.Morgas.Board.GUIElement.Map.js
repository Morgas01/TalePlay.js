(function() {
	var name="Map";
	var SC=µ.getModule("shortcut")({
		Board:"Board",
		gMap:"GUI.Map",
		map:"Map"
	});
	module(name);
	test(name, function() {
		var board = getBoard(name),
		layer=new SC.Board.Layer(),
		map=new SC.gMap({
        	images:[
	            new SC.map.Image("Images/1.png",{x:0,y:0},{x:100,y:100}),
	            new SC.map.Image("Images/2.png",{x:100,y:0},{x:100,y:100}),
	            new SC.map.Image("Images/1.png",{x:200,y:0},{x:100,y:100}),
	            new SC.map.Image("Images/2.png",{x:300,y:0},{x:100,y:100}),
	            
	            new SC.map.Image("Images/2.png",{x:0,y:100},{x:100,y:100}),
	            new SC.map.Image("Images/1.png",{x:100,y:100},{x:100,y:100}),
	            new SC.map.Image("Images/2.png",{x:200,y:100},{x:100,y:100}),
	            new SC.map.Image("Images/1.png",{x:300,y:100},{x:100,y:100}),

	            new SC.map.Image("Images/1.png",{x:0,y:200},{x:100,y:100}),
	            new SC.map.Image("Images/2.png",{x:100,y:200},{x:100,y:100}),
	            new SC.map.Image("Images/1.png",{x:200,y:200},{x:100,y:100}),
	            new SC.map.Image("Images/2.png",{x:300,y:200},{x:100,y:100}),

	            new SC.map.Image("Images/2.png",{x:0,y:300},{x:100,y:100}),
	            new SC.map.Image("Images/1.png",{x:100,y:300},{x:100,y:100}),
	            new SC.map.Image("Images/2.png",{x:200,y:300},{x:100,y:100}),
	            new SC.map.Image("Images/1.png",{x:300,y:300},{x:100,y:100}),
	        ],
	        cursor:new SC.map.Image("Images/cursor_target.svg",{x:150,y:150},{x:50,y:50}),
	        offset:{x:25,y:25}
	        
		});
		map.domElement.style.width=map.domElement.style.height="150px";
		layer.add(map);
		
		board.addLayer(layer); 
		
		map.update();
		ok(true);
	});
})();