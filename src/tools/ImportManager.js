new µ.Promise([µ.util.Request.json("../Morgas/src/Morgas.Dependencies.json"),µ.util.Request.json("../TalePlay.Dependencies.json"),function(signal)
{
	window.addEventListener("load",signal.resolve);
}]).then(function(mDeps,tDeps){

	var resolver=new µ.DependencyResolver();
	resolver.addConfig(mDeps);
	resolver.addConfig(tDeps);
    var html='';
    for(var i in resolver.config)
    {
        html+='<label><input type="checkbox" value="'+i+'">'+i+'</label>';
    }
    document.querySelector(".selections").innerHTML=html;

    window.addEventListener("change",function(e)
    {
    	Array.forEach(document.querySelectorAll(':indeterminate'), function(v){v.indeterminate=false});
        var values=Array.map(document.querySelectorAll('[type="checkbox"]:checked'),function(val){return val.value});
        if(values)
        {
            var resolved=resolver.resolve(values);
            for(var i=0;i<resolved.length;i++)
        	{
            	var checkbox=document.querySelector('[type="checkbox"][value="'+resolved[i]+'"]:not(:checked)');
            	if(checkbox)checkbox.indeterminate=true;
        	}
            var prefix=document.getElementById("prefix").value;
            resolved.sort(function(a,b){
               return a.endsWith(".css")-b.endsWith(".css");
            });
            document.getElementById("result").value=resolved.map(function(v)
            {
				if(v in mDeps) v="Morgas/src/"+v;
                if(v.endsWith(".css"))
                {
                    return '<link rel="stylesheet" href="'+prefix+v+'">'
                }
                return '<script src="'+prefix+v+'"></script>';
            }).join("\n");
        }
        else
        {
            document.getElementById("result").value="";
        }
    })
});