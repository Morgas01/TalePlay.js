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
            threshold:75
	        
		});
		//"viewport" smaller than map
		map.domElement.style.width=map.domElement.style.height="250px";
		//collision
		var collide=new SC.map.Image("Images/empty.png",{x:25,y:25},{x:50,y:50},"collide",true);
		collide.domElement.style.backgroundColor="black";
		//trigger activate
		var activate=new SC.map.Image("Images/empty.png",{x:325,y:25},{x:50,y:50},"trigger_activate",false,{type:"activate",value:"activate"});
		activate.domElement.style.backgroundColor="orange";
		//trigger step
		var step=new SC.map.Image("Images/empty.png",{x:325,y:325},{x:50,y:50},"trigger_step",false,{type:"step",value:"step"});
		step.domElement.style.backgroundColor="green";
		//trigger move
		var move=new SC.map.Image("Images/empty.png",{x:25,y:325},{x:50,y:50},"trigger_move",true,{type:"move",value:"move"});
		move.domElement.style.backgroundColor="blue";
		
		map.addImages([collide,activate,step,move]);
		
		layer.add(map);
		
		board.addLayer(layer); 

        map.setPosition(200,200);
		map.update();
		var eventlog=document.createElement("textarea");
		board.domElement.parentNode.appendChild(eventlog)
		
		map.addListener("trigger",function(event)
		{
			eventlog.value=event.triggerType+" "+Date.now();
			console.info(event);
		})
		ok(true);
	});
})();