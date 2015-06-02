(function(µ,SMOD,GMOD,HMOD){
	
	module("TalePlay.Battle");
	
	var BATTLE=GMOD("Battle");
	var CHAR=GMOD("Character");
	var SKILL=GMOD("Skill");
	
	var attack=new SKILL(function(battle,user,target)
	{
		return {
			type:"damage",
			amount:Math.max(0,user.attributes.get("atk")-target.attributes.get("def")),
			target:target
		};
	},SKILL.Targets.SINGLE);
	var playerJSON={
		life:{value:100,max:100},
		attributes:{
			atk:5,
			def:3
		}
	}
	var players={
		1:new CHAR(playerJSON),
		2:new CHAR(playerJSON)
	}
	
	test("Battle",function(assert)
	{
		var container=getContainer("Battle");
		
		container.innerHTML+='<div><meter min="0" data-player="1"></meter><button data-player="1" data-target="2">attack</button><span></span></div>'+
		'<div><meter min="0" data-player="2"></meter><button data-player="2" data-target="1">attack</button><span></span></div>';
		
		var update=function()
		{
			var meter1=container.querySelector('meter[data-player="1"]');
			meter1.max=players[1].life.max;
			meter1.value=players[1].life.value;
			container.querySelector('meter[data-player="1"]~span').textContent=players[1].life.value;
			
			var meter2=container.querySelector('meter[data-player="2"]');
			meter2.max=players[2].life.max;
			meter2.value=players[2].life.value;
			container.querySelector('meter[data-player="2"]~span').textContent=players[2].life.value;
		}
		update();
		
		var battle=new BATTLE([players[1]],[players[2]]);
		
		container.addEventListener("click",function(e)
		{
			if(e.target.tagName=="BUTTON")
			{
				battle.executeSkill(attack,players[e.target.dataset.player],players[e.target.dataset.target]);
				update();
			}
		});
		battle.addListener(".finish:once",null,function(event){
			console.log(event);
			alert("win: "+event.value.win);
		});
		ok(true);
	});
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);