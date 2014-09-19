(function(){
	var WR=function(path){
		document.write('<script type="text/javascript" charset="utf-8" src="'+path+'"></script>');
	};
	var CSS=function(path){
		document.write('<link rel="stylesheet" href="'+path+'">');
	};
	
	var srcDir="./",
	testDir="tests/",
	guiDir=srcDir+"GUI/",
	MathDir=srcDir+"Math/",
	morgasDir=srcDir+"Morgas/src/",
	cssDir=srcDir+"css/",
	gameDir=srcDir+"minigames/";
	

	WR(morgasDir+"Morgas.js");
	WR(morgasDir+"DB/Morgas.DB.js");
	
	WR(srcDir+"Morgas.Controller.js");
	WR(srcDir+"Morgas.Controller.Mapping.js");
	WR(srcDir+"Morgas.Controller.Keyboard.js");
	WR(srcDir+"Morgas.Controller.Gamepad.js");
	
	WR(morgasDir+"Morgas.NodePatch.js");
	WR(srcDir+"Morgas.Board.js");
	WR(srcDir+"Morgas.Board.Layer.js");
	WR(guiDir+"Morgas.Board.GUIElement.js");

    WR(morgasDir+"Morgas.util.object.js");
	
	WR("testUtil.js");
	CSS("test.css");
	
	CSS(cssDir+"structure/core.css");
	
	//Math
	WR(MathDir+"Morgas.Math.Point.js");
	WR(testDir+"test.Morgas.Math.Point.js");

	WR(MathDir+"Morgas.Math.Rect.js");
	//TODO WR(testDir+"test.Morgas.Math.Rect.js");
	
	// MENU
	WR(srcDir+"Morgas.Menu.js");
	WR(guiDir+"Morgas.Board.GUIElement.Menu.js");
	CSS(cssDir+"structure/GUIElement.Menu.css");
	
	WR(testDir+"test.Morgas.Board.GUIElement.Menu.js");
	
	// ControllerConfig
	WR(guiDir+"Morgas.Board.GUIElement.ControllerConfig.js");
	CSS(cssDir+"structure/GUIElement.ControllerConfig.css");
	
	WR(testDir+"test.Morgas.Board.GUIElement.ControllerConfig.js");
	
	// ControllerManager
	WR(morgasDir+"Morgas.Organizer.js");
	WR(guiDir+"Morgas.Board.GUIElement.ControllerManager.js");
	CSS(cssDir+"structure/GUIElement.ControllerManager.css");
	
	WR(testDir+"test.Morgas.Board.GUIElement.ControllerManager.js");
	
	// TicTacToe
	WR(gameDir+"TicTacToe.js");
	CSS(gameDir+"TicTacToe.css");
	
	WR(testDir+"test.TicTacToe.js");

    // Morgas.Map
    WR(srcDir+"Morgas.Map.js");
    WR(testDir+"test.Morgas.Map.js");
    CSS(cssDir+"structure/Map.css");

    // Map
    WR(guiDir+"Morgas.Board.GUIElement.Map.js");
    WR(testDir+"test.Morgas.Board.GUIElement.Map.js");

    CSS(cssDir+"structure/arrow_animation.css");

	// Theme
	CSS(cssDir+"themes/TalePlay-classic.css");
})();
