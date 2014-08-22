(function(µ,SMOD,GMOD){
	
	module("Morgas.Map");
	
	var MAP=GMOD("Map");
	
	test("create",function(assert)
	{
        var map=new MAP(
        [
            new MAP.Image("Images/1.png",{x:50,y:0},{x:100,y:100}),
            new MAP.Image("Images/2.png",{x:0,y:100},{x:100,y:100}),
            new MAP.Image("Images/3.png",{x:100,y:100},{x:100,y:100}),
            new MAP.Image("Images/1.png",{x:75,y:75},{x:50,y:50},"moving")
        ]);

        getContainer("Map").appendChild(map.domElement);
        map.domElement.style.width=map.domElement.style.height="100px";

        var animate=function(time)
        {
            map.setPosition(Math.sin(time/500)*50,Math.cos(time/500)*50);
            var image=map.getImages({name:"moving"})[0];
            image.setPosition(Math.sin(time/500)*75+75,Math.cos(time/500)*75+75);
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        ok(true);
	});
	
})(Morgas,Morgas.setModule,Morgas.getModule);