(function() {
	let name="Map";
	let SC=µ.getModule("shortcut")({
		Board:"Board",
		Layer:"Layer",
		gMap:"GUI.Map"
	});
	module(name);
	test(name, function() {
		let board = getBoard(name),
		layer=new SC.Layer(),
		map=new SC.gMap({
        	images:[
	            new SC.gMap.Image(imagesDir+"1.png",{x:0,y:0},{x:100,y:100}),
	            new SC.gMap.Image(imagesDir+"2.png",{x:100,y:0},{x:100,y:100}),
	            new SC.gMap.Image(imagesDir+"1.png",{x:200,y:0},{x:100,y:100}),
	            new SC.gMap.Image(imagesDir+"2.png",{x:300,y:0},{x:100,y:100}),
	            
	            new SC.gMap.Image(imagesDir+"2.png",{x:0,y:100},{x:100,y:100}),
	            new SC.gMap.Image(imagesDir+"1.png",{x:100,y:100},{x:100,y:100}),
	            new SC.gMap.Image(imagesDir+"2.png",{x:200,y:100},{x:100,y:100}),
	            new SC.gMap.Image(imagesDir+"1.png",{x:300,y:100},{x:100,y:100}),

	            new SC.gMap.Image(imagesDir+"1.png",{x:0,y:200},{x:100,y:100}),
	            new SC.gMap.Image(imagesDir+"2.png",{x:100,y:200},{x:100,y:100}),
	            new SC.gMap.Image(imagesDir+"1.png",{x:200,y:200},{x:100,y:100}),
	            new SC.gMap.Image(imagesDir+"2.png",{x:300,y:200},{x:100,y:100}),

	            new SC.gMap.Image(imagesDir+"2.png",{x:0,y:300},{x:100,y:100}),
	            new SC.gMap.Image(imagesDir+"1.png",{x:100,y:300},{x:100,y:100}),
	            new SC.gMap.Image(imagesDir+"2.png",{x:200,y:300},{x:100,y:100}),
	            new SC.gMap.Image(imagesDir+"1.png",{x:300,y:300},{x:100,y:100})
	        ],
	        cursors:[
	 	    	new SC.gMap.Cursor(imagesDir+"cursor_target.svg",{x:150,y:200},{x:50,y:50},{x:25,y:25},"crossair"),
		    	new SC.gMap.Cursor([imagesDir+"arrow_down.svg",imagesDir+"arrow_up.svg",null,imagesDir+"arrow_right.svg",null,imagesDir+"arrow_down.svg",null,imagesDir+"arrow_left.svg",null],{x:250,y:200},{x:50,y:50},{x:25,y:25},"arrow 4-steps",true,false,100)
		    ],
		    assignFilter:function(event,cursor,index){return event.type!=="analogStickChanged"||event.index===index;},
            threshold:75
	        
		});
		//"viewport" smaller than map
		map.domElement.style.width=map.domElement.style.height="250px";
		//collision
		let collide=new SC.gMap.Image(imagesDir+"empty.png",{x:25,y:25},{x:50,y:50},"collide",true);
		collide.domElement.style.backgroundColor="black";
		//trigger activate
		let activate=new SC.gMap.Image(imagesDir+"empty.png",{x:325,y:25},{x:50,y:50},"trigger_activate",false,{type:"activate",value:"activate"});
		activate.domElement.style.backgroundColor="orange";
		//trigger step
		let step=new SC.gMap.Image(imagesDir+"empty.png",{x:325,y:325},{x:50,y:50},"trigger_step",false,{type:"step",value:"step"});
		step.domElement.style.backgroundColor="green";
		//trigger move
		let move=new SC.gMap.Image(imagesDir+"empty.png",{x:25,y:325},{x:50,y:50},"trigger_move",true,{type:"move",value:"move"});
		move.domElement.style.backgroundColor="blue";
		
		map.addAll([collide,activate,step,move]);
		
		layer.add(map);
		
		board.addLayer(layer); 

        map.setPosition(200,200);
		map.update();
		
		let eventlog=document.createElement("textarea");
		eventlog.style.width="100%";
		eventlog.style.height="20px";
		board.domElement.parentNode.parentNode.appendChild(eventlog);
		
		map.addListener("trigger",map,function(event)
		{
			eventlog.value="["+event.cursor.name+"]"+event.triggerType+" "+Date.now();
			console.info(event);
		});
		
		let animationButton=document.createElement("button");
		animationButton.textContent="animation";
		animationButton.addEventListener("click",function(e)
		{
			map.playAnimation(new SC.gMap.Cursor.Animation.Key(map.cursors[1],[
				{x:100,y:100},
				{x:350,y:100},
				{x:350,y:326},
				{x:374,y:326},
				{x:374,y:374},
				{x:326,y:374},
				{x:326,y:326},
				{x:374,y:374},
				{x:100,y:250},
				{x:50,y:50}
			]));
		})
		board.domElement.parentNode.parentNode.appendChild(animationButton);
		
		ok(true);
	});
})();