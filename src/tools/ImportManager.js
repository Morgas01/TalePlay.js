window.addEventListener("load",function(){

    let html='';
    for(let i in TalePlay.dependencies.config)
    {
        html+='<label><input type="checkbox" value="'+i+'">'+i+'</label>';
    }
    document.querySelector(".selections").innerHTML=html;

    window.addEventListener("change",function(e)
    {
    	Array.forEach(document.querySelectorAll(':indeterminate'), function(v){v.indeterminate=false});
        let values=Array.prototype.map.call(document.querySelectorAll('[type="checkbox"]:checked'),function(val){return val.value});
        if(values)
        {
            let resolved=TalePlay.dependencies.resolve(values);
            for(let i=0;i<resolved.length;i++)
        	{
            	let checkbox=document.querySelector('[type="checkbox"][value="'+resolved[i]+'"]:not(:checked)');
            	if(checkbox)checkbox.indeterminate=true;
        	}
            let prefix=document.getElementById("prefix").value;
            resolved.sort(function(a,b){
               return a.endsWith(".css")-b.endsWith(".css");
            });
            document.getElementById("result").value=resolved.map(function(v)
            {
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