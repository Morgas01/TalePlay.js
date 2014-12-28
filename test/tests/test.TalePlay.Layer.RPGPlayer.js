(function(µ,SMOD,GMOD){
	
	module("RPGPlayer");
	
	var RPGPlayer=GMOD("RPGPlayer");
	
	test("RPGPlayer",function()
	{
		var player=new RPGPlayer({
			baseUrl:"RPGPlayer/",
			imageBaseUrl:imagesDir
		});
		
		var board=getBoard("RPGPlayer");
		board.addLayer(player);
		
		var questlog=document.createElement("textarea");
		questlog.style.width="100%";
		questlog.style.height="80px";
		board.domElement.parentNode.parentNode.appendChild(questlog);
		player.addListener("quest-activate quest-complete",null,function(e){
			questlog.value="";
			player.activeQuests.forEach(function(q){questlog.value+=JSON.stringify(q,null,"\t")});
		});
		
        ok(true);
	});
	
})(Morgas,Morgas.setModule,Morgas.getModule);