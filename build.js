
var MORGASPATH="./src/Morgas/";

require(MORGASPATH+"src/Morgas.js");
require(MORGASPATH+"src/Morgas.DependencyResolver.js");
µ.debug.verbose=µ.debug.LEVEL.DEBUG;

var mDeps=require(MORGASPATH+"src/Morgas.Dependencies.json");
var tDeps=require("./src/TalePlay.Dependencies.json");
var resolver=new µ.DependencyResolver();
resolver.addConfig(mDeps);
resolver.addConfig(tDeps);

var fs=require("fs");

var uglify=require("uglify-js2");

var minify=function(name)
{
	var inFile=__dirname+"/src/"+name;
	var outFile=__dirname+"/build/"+name;
	µ.debug(inFile+" => "+outFile,µ.debug.LEVEL.INFO);
	try
	{
		fs.writeFileSync(outFile,uglify.minify(inFile).code);
	}
	catch (e)
	{
		try{fs.unlinkSync(outFile)}catch (e){};
		fs.linkSync(inFile,outFile);
	}
};
var FILE_ENCODING = 'utf-8',EOL = '\n';
var createPackage=function(name,sources)
{
	µ.debug("Package: "+name,µ.debug.LEVEL.INFO);
	var packageFiles=resolver.resolve(sources).map(function(a)
	{
		if(a in mDeps)return "Morgas/src/"+a;
		return a;
	});
	var packageJsFiles=packageFiles.filter(function(f){return f.indexOf(".css")===-1;})
	.map(function(f)
	{
		var file=__dirname+"/src/"+f;
		return "//"+f+EOL+
			fs.readFileSync(file, FILE_ENCODING);
	})
	.join(EOL);
	fs.writeFileSync(__dirname+"/build/"+name+".js",packageJsFiles);
	try
	{
		var minPackage=uglify.minify(__dirname+"/build/"+name+".js")
		fs.writeFileSync(__dirname+"/build/"+name+"-min.js",packageFiles);
	} catch(e){console.log("could not minify "+name+".js");}

	var packageCssFiles=packageFiles.filter(function(f){return f.indexOf(".css")!==-1;})
		.map(function(f)
		{
			var file=__dirname+"/src/"+f;
			return "/*~~~ "+f+" ~~~*/"+EOL+fs.readFileSync(file, FILE_ENCODING);
		})
		.join(EOL);
	fs.writeFileSync(__dirname+"/build/"+name+".css",packageCssFiles);
};

var files=Object.keys(tDeps);
for(var i=0;i<files.length;i++)
{
	if(files[i].indexOf(".css")===-1)
	{
		try{
			minify(files[i]);
		}catch(e){
			µ.debug(e,µ.debug.LEVEL.ERROR);
		}
	}
}

var basic_package=[
	"TalePlay.Board.js",
	"TalePlay.Layer.js",
	"GUI/TalePlay.GUIElement.js",
	"TalePlay.Controller.Gamepad.js",
	"TalePlay.Controller.Keyboard.js",
	"GUI/TalePlay.GUIElement.ControllerManager.js",
	"GUI/TalePlay.GUIElement.Menu.js",
	"Math/TalePlay.Math.Point.js",
	"Math/TalePlay.Math.Rect.js"
];
createPackage("TalePlay_FULL",Object.keys(resolver.config));
createPackage("TalePlay_RPGPlayer",basic_package.concat("RPGPlayer/TalePlay.RPGPlayer.js"));
createPackage("TalePlay_MapMaker",basic_package.concat("TalePlay.Layer.MapMaker.js"));
