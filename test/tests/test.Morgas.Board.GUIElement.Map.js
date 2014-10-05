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
	            new SC.map.Image("Images/1.png",{x:300,y:300},{x:100,y:100})
	        ],
	        cursors:new SC.gMap.Cursor("Images/cursor_target.svg",{x:200,y:200},{x:50,y:50},{x:25,y:25},"cursor",true),
            threshold:25
	        
		});
		//"viewport" smaller than map
		map.domElement.style.width=map.domElement.style.height="150px";
		//collision
		var collide=new SC.map.Image("Images/empty.png",{x:25,y:25},{x:50,y:50},"collide",true);
		collide.domElement.style.backgroundColor="black";
		map.addImages(collide)
		
		layer.add(map);
		
		board.addLayer(layer); 

        map.setPosition(200,200);
		map.update();
		ok(true);
	});
})();