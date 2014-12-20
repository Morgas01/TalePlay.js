(function(µ,SMOD,GMOD){
	
	module("RPGPlayer");
	
	var RPGPlayer=GMOD("RPGPlayer");
	
	test("RPGPlayer",function()
	{
		var player=new RPGPlayer({
			baseUrl:"RPGPlayer/",
			imageBaseUrl:imagesDir,
			cursor:{
				url:imagesDir+"empty.png",
				name:"arrow",
				size:50,
				offset:25
			},
			map:"testMap",
			position:{x:200,y:350},
			quests:["Quest 1"]
		});
		
		var board=getBoard("RPGPlayer");
		board.addLayer(player);
		
		var questlog=document.createElement("textarea");
		questlog.style.width="100%";
		questlog.style.height="80px";
		board.domElement.parentNode.parentNode.appendChild(questlog);
		
		player.addListener("ready:once quest-activate",null,function(e){
			questlog.value="";
			player.activeQuests.forEach(function(q){questlog.value+=JSON.stringify(q,null,"\t")});
		});
		
        ok(true);
	});
	
})(Morgas,Morgas.setModule,Morgas.getModule);