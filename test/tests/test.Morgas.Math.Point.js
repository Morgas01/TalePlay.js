(function(µ,SMOD,GMOD){
	
	module("Morgas.Math.Point");
	
	let POINT=GMOD("Math.Point");
	
	test("create",function(assert)
	{
		assert.propEqual2(new POINT(),{x:0,y:0},"without parameters");
		assert.propEqual2(new POINT(1,2),{x:1,y:2},"with parameters");
		assert.propEqual2(new POINT({x:3,y:5}),{x:3,y:5},"with object parameters");
	});
	
	test("math",function(assert)
	{
		assert.propEqual2(new POINT({x:1,y:2}).add(3,4),{x:4,y:6},"add");
		assert.propEqual2(new POINT({x:5,y:6}).sub(7,8),{x:-2,y:-2},"sub");
		assert.propEqual2(new POINT({x:9,y:10}).mul(11,12),{x:99,y:120},"mul");
		assert.propEqual2(new POINT({x:13,y:14}).div(15,16),{x:13/15,y:14/16},"div");
	});
	
})(Morgas,Morgas.setModule,Morgas.getModule);