(function(µ,SMOD,GMOD){
	
	module("RPGPlayer");
	
	let RPGPlayer=GMOD("RPGPlayer");
	
	test("RPGPlayer",function()
	{
		let board=getBoard("RPGPlayer");
		
		let player=new RPGPlayer({
			board:board,
			gameName:"testGame",
			baseUrl:"RPGPlayer/",
			imageBaseUrl:imagesDir
		});
		
		
		let questlog=document.createElement("textarea");
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
	
})(Morgas,Morgas.setModule,Morgas.getModule);