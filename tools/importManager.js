µ.util.Request.json("../src/TalePlay.Dependencies.json")
.then(function(tDeps)
{
	var resolver=new µ.DependencyResolver();
	resolver.addConfig(tDeps);
    var html='';
	var keys=Object.keys(tDeps);
	keys.sort(function(a,b)
	{
		a=a.slice(0,-3);
		b=b.slice(0,-3);//remove ".js"
		if(	(a.indexOf("/")!==-1) != (b.indexOf("/")!==-1) ||
			(a.slice(0,6)=="Morgas") != (b.slice(0,6)=="Morgas")) return false; //sort subfolders & Morgas sources last
		else return a>b;
	});
    for(var k=0;k<keys.length;k++)
    {
        html+='<label><input type="checkbox" value="'+keys[k]+'">'+keys[k]+'</label>';
    }

	var selections=document.getElementById("selections");
	var prefix=document.getElementById("prefix");
	var result=document.getElementById("result");
	selections.innerHTML=html;

	var update=function()
    {
    	Array.forEach(selections.querySelectorAll(':indeterminate'), function(v){v.indeterminate=false});
        var values=Array.map(selections.querySelectorAll('[type="checkbox"]:checked'),function(val){return val.value});
        if(values)
        {
            var resolved=resolver.resolve(values);
            for(var i=0;i<resolved.length;i++)
        	{
            	var checkbox=document.querySelector('[type="checkbox"][value="'+resolved[i]+'"]:not(:checked)');
            	if(checkbox)checkbox.indeterminate=true;
        	}
            resolved.sort(function(a,b){
               return a.endsWith(".css")-b.endsWith(".css");
            });
			result.value=resolved.map(function(v)
            {
                if(v.endsWith(".css"))
                {
                    return '<link rel="stylesheet" href="'+prefix.value+v+'">'
                }
                return '<script defer src="'+prefix.value+v+'"></script>';
            }).join("\n");
        }
        else
        {
			result.value="";
        }
    };
	window.addEventListener("change",update);
	window.addEventListener("input",update);
});