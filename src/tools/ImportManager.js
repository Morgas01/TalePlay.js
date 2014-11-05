window.addEventListener("load",function(){

    var html='';
    for(var i in TalePlay.dependencies.config)
    {
        html+='<label><input type="checkbox" value="'+i+'">'+i+'</label>';
    }
    document.querySelector(".selections").innerHTML=html;

    window.addEventListener("change",function(e)
    {
        var values=Array.map(document.querySelectorAll('[type="checkbox"]:checked'),function(val){return val.value});
        if(values)
        {
            var resolved=TalePlay.dependencies.resolve(values);
            var prefix=document.getElementById("prefix").value;
            document.getElementById("result").value=resolved.map(function(v)
            {
                if(v.endsWith("css"))
                {
                    return '<link rel="stylesheet" href="'+prefix+v+'">'
                }
                return '<script src="'+prefix+v+'></script>';
            }).join("\n");
        }
        else
        {
            document.getElementById("result").value="";
        }
    })
});