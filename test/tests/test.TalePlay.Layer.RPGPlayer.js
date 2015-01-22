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
			player.activeQuests.forEach(function(q){questlog.value+=JSON.stringify(q,null,"\t")});
		});
		
        ok(true);
	});
	
})(Morgas,Morgas.setModule,Morgas.getModule);