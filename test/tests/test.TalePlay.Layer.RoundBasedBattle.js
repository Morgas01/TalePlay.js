(function() {
	var name="RoundBasedBattle";
	var SC=µ.getModule("shortcut")({
		Board:"Board",
		RBB:"Layer.RoundBasedBattle",
		Player:"Character.Player",
		Monster:"Character.Monster",
		SKILL:"Skill",
		MENU:"GUI.Menu"
	});
	module(name);
	test(name, function() {
		var board = getBoard(name);
		var attack=new SC.SKILL("attack",function(battle,user,target)
		{
			return {
				type:"damage",
				amount:Math.max(0,user.attributes.get("ATK")-target.attributes.get("DEF")),
				target:target
			};
		},SC.SKILL.Targets.SINGLE);
		var characterData={
			name:"player",
			life:{value:100,max:150},
			attributes:{
				ATK:20,
				DEF:5,
				SPD:10
			},
			abilities:{
				items:[
					attack,
					{
						name:"group",
						settings:{
							type:SC.MENU.Types.GRID,
							columns:2
						},
						items:[attack,attack,attack,attack,attack]
					}
				]
			}
		};
		var allies=[new SC.Player(characterData)];
		characterData.name="monster";
		characterData.attributes.ATK=15;
		characterData.ki=function(battle)
		{
			battle.executeSkill(attack,this,battle.allies[0]);
		}
		var enemies=[new SC.Monster(characterData)];
		
		layer = new SC.RBB(allies,enemies);
		board.addLayer(layer);
		layer.addListener(".finish:once",null,function(event){
			console.log(event);
			alert("win: "+event.value.win);
		});
		
		ok(true);
	});
})();