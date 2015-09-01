(function(µ,SMOD,GMOD,HMOD,SC){
	
	module("RPGPlayer");
	
	var RPGPlayer=GMOD("RPGPlayer");
	
	test("RPGPlayer",function()
	{
		var board=getBoard("RPGPlayer");
		
		var player=new RPGPlayer({
			board:board,
			gameName:"testGame",
			baseUrl:"RPGPlayer/",
			imageBaseUrl:imagesDir
		});
		
		
		var questlog=document.createElement("textarea");
		questlog.style.width="100%";
		questlog.style.height="80px";
		board.domElement.parentNode.parentNode.appendChild(questlog);
		player.addListener("quest-activate quest-complete",null,function(e){
			questlog.value="";
			player.gameSave.getQuests().forEach(function(q){questlog.value+=JSON.stringify(q,null,"\t")});
		});

		player.addListener("execute",null,function(e)
		{
			alert(e.action.value);
		});
		
        ok(true);
	});

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);