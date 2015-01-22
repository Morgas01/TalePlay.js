(function(µ,SMOD,GMOD){
	
	module("Morgas.Map");
	
	let MAP=GMOD("Map");
	
	test("create",function(assert)
	{
        let map=new MAP({
        	images:[
	            new MAP.Image(srcDir+"Images/1.png",{x:50,y:0},{x:100,y:100}),
	            new MAP.Image(srcDir+"Images/2.png",{x:0,y:100},{x:100,y:100}),
	            new MAP.Image(srcDir+"Images/3.png",{x:100,y:100},{x:100,y:100}),
	            new MAP.Image(srcDir+"Images/1.png",{x:75,y:75},{x:50,y:50},"moving")
	        ]
        });

        getContainer("Map").appendChild(map.domElement);
        map.domElement.style.width=map.domElement.style.height="100px";

        let animate=function(time)
        {
            map.setPosition((Math.sin(time/500)+1)*100,(Math.cos(time/500)+1)*100);
            let image=map.getImages({name:"moving"})[0];
            image.setPosition(Math.sin(time/500)*125+75,Math.cos(time/500)*75+75);
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
        ok(true);
	});
	
})(Morgas,Morgas.setModule,Morgas.getModule);