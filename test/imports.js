(function(){
	var WR=function(path){
		document.write('<script type="text/javascript" charset="utf-8" src="'+path+'"></script>');
	};
	var CSS=function(path){
		document.write('<link rel="stylesheet" href="'+path+'">');
	};
	
	srcDir="./";
	testDir="tests/";
	guiDir=srcDir+"GUI/";
	MathDir=srcDir+"Math/";
	morgasDir=srcDir+"Morgas/src/";
	cssDir=srcDir+"css/";
	gameDir=srcDir+"minigames/";
	imagesDir=srcDir+"Images/";
	


	
	WR(morgasDir+"Morgas.js");
	WR(morgasDir+"Morgas.Patch.js");
	WR(morgasDir+"Morgas.Listeners.js");
	WR(morgasDir+"Morgas.util.function.bind.js");
	WR(morgasDir+"Morgas.util.function.rescope.js");
	WR(morgasDir+"Morgas.util.function.proxy.js");
	WR(morgasDir+"Morgas.NodePatch.js");
	WR(morgasDir+"Morgas.util.object.goPath.js");
	WR(morgasDir+"Morgas.util.object.equals.js");
	WR(morgasDir+"Morgas.util.object.find.js");
	WR(morgasDir+"Morgas.util.object.iterate.js");
	WR(morgasDir+"Morgas.Organizer.js");
	WR(morgasDir+"Morgas.Detached.js");
	WR(morgasDir+"DB/Morgas.DB.js");

	WR(srcDir+"TalePlay.Board.js");
	WR(srcDir+"TalePlay.Layer.js");
	WR(srcDir+"TalePlay.Controller.js");
	WR(srcDir+"TalePlay.Controller.Mapping.js");
	WR(srcDir+"TalePlay.Controller.Keyboard.js");
	WR(srcDir+"TalePlay.Controller.Gamepad.js");

	WR(MathDir+"TalePlay.Math.Point.js");
	WR(MathDir+"TalePlay.Math.Rect.js");

	WR(srcDir+"TalePlay.Map.js");
	WR(srcDir+"TalePlay.Menu.js");

	WR(guiDir+"TalePlay.GUIElement.js");
	WR(guiDir+"TalePlay.GUIElement.Menu.js");
	WR(guiDir+"TalePlay.GUIElement.ControllerConfig.js");
	WR(guiDir+"TalePlay.GUIElement.ControllerManager.js");
	WR(guiDir+"TalePlay.GUIElement.Map.js");
	WR(guiDir+"TalePlay.GUIElement.TextBox.js");

	CSS(cssDir+"structure/core.css");
	CSS(cssDir+"structure/Map.css");
	CSS(cssDir+"structure/GUIElement.Menu.css");
	CSS(cssDir+"structure/GUIElement.ControllerConfig.css");
	CSS(cssDir+"structure/GUIElement.ControllerManager.css");
	CSS(cssDir+"structure/GUIElement.TextBox.css");
	
	WR("testUtil.js");
	CSS("test.css");
	
	//Math
	WR(testDir+"test.Morgas.Math.Point.js");
	//TODO WR(testDir+"test.Morgas.Math.Rect.js");
	
	// MENU
	WR(testDir+"test.Morgas.Board.GUIElement.Menu.js");
	
	// ControllerConfig
	WR(testDir+"test.Morgas.Board.GUIElement.ControllerConfig.js");
	
	// ControllerManager
	WR(testDir+"test.Morgas.Board.GUIElement.ControllerManager.js");
	
    // Morgas.Map
    WR(testDir+"test.Morgas.Map.js");

    // Map
    WR(testDir+"test.Morgas.Board.GUIElement.Map.js");
    CSS(cssDir+"structure/arrow_animation.css");
    
    //TextBox
    WR(testDir+"test.Morgas.Board.GUIElement.TextBox.js");

	// Theme
	CSS(cssDir+"themes/TalePlay-classic.css");
})();
