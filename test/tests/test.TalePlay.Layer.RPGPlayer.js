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
			map:"testMap.json",
			position:{x:200,y:350}
		});
		
		var board=getBoard("RPGPlayer");
		board.addLayer(player);
		
		var quest1=new RPGPlayer.Quest({
			name:"Quest 1",
			description:"go to the blue square"
		});
		
		var quest2=new RPGPlayer.Quest({
			name:"Quest 2",
			description:"go to the orange square"
		});
		
		var questlog=document.createElement("textarea");
		questlog.style.width="100%";
		questlog.style.height="80px";
		board.domElement.parentNode.parentNode.appendChild(questlog);
		
		player.addListener("quest-complete",null,function(e){
			if(e.value===quest1)
			{
				player.addQuest(quest2);
			}
			else
			{
				player.addQuest(quest1);
			}
			questlog.value="";
			player.quests.forEach(function(q){questlog.value+=JSON.stringify(q,null," ")});
		});
		player.addQuest(quest1);
		questlog.value="";
		player.quests.forEach(function(q){questlog.value+=JSON.stringify(q,null," ")});
		
        ok(true);
	});
	
})(Morgas,Morgas.setModule,Morgas.getModule);