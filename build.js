
var MORGASPATH="./src/Morgas/";

require(MORGASPATH+"./src/Morgas.js");
require(MORGASPATH+"./src/Morgas.DependencyResolver.js");
require(MORGASPATH+"./src/Morgas.Dependencies.js");
require("./src/TalePlay.Dependencies.js");

var fs=require("fs");

var uglify=require("uglify-js2");

var minify=function(name)
{
	var inFile=__dirname+"/src/"+name;
	var outFile=__dirname+"/build/"+name;
	console.info(inFile+" => "+outFile);
	try
	{
		fs.writeFileSync(outFile,uglify.minify(inFile).code);
	}
	catch (e)
	{
		fs.linkSync(inFile,outFile);
	}
};
var FILE_ENCODING = 'utf-8',EOL = '\n';
var createPackage=function(name,sources)
{
	var packageFiles=TalePlay.dependencies.resolve(sources);
	var packageJsFiles=packageFiles.filter(function(f){return f.indexOf(".css")===-1;})
	.map(function(f)
	{
		var file=__dirname+"/build/"+f;
		if(f.indexOf("Morgas/")===0) file=__dirname+"/src/"+f.replace("/src/","/build/");
		return "//"+f+EOL+fs.readFileSync(file, FILE_ENCODING);
	})
	.join(EOL);
	fs.writeFileSync(__dirname+"/build/"+name+".js",packageJsFiles);

	var packageCssFiles=packageFiles.filter(function(f){return f.indexOf(".css")!==-1;})
		.map(function(f)
		{
			var file=__dirname+"/src/"+f;
			return "/*~~~ "+f+" ~~~*/"+EOL+fs.readFileSync(file, FILE_ENCODING);
		})
		.join(EOL);
	fs.writeFileSync(__dirname+"/build/"+name+".css",packageCssFiles);
};

var files=Object.keys(TalePlay.dependencies.config);
for(var i=0;i<files.length;i++)
{
	if(files[i].indexOf("Morgas/")!==0&&files[i].indexOf(".css")===-1)
	{
		try{
			minify(files[i]);
		}catch(e){
			console.error(e);
		}
	}
}

createPackage("TalePlay_FULL",Object.keys(TalePlay.dependencies.config));
createPackage("TalePlay_RPGPlayer",["RPGPlayer/TalePlay.RPGPlayer.js"]);
