(function(){
	var WR=function(path){
		document.write('<script type="text/javascript" charset="utf-8" src="'+path+'"></script>');
	};
	var CSS=function(path){
		document.write('<link rel="stylesheet" href="'+path+'">');
	};
	
	var srcDir="./",
	testDir="tests/",
	guiDir="GUI/",
	morgasDir="Morgas/src/",
	cssDir="css/";
	

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
	
	WR("testUtil.js");
	CSS("test.css");
	
	CSS(cssDir+"structure/core.css");
	
	// MENU
	WR(srcDir+"Morgas.Menu.js");
	WR(guiDir+"Morgas.Board.GUIElement.Menu.js");
	CSS(cssDir+"structure/GUIElement.Menu.css");
	
	WR(testDir+"test.Morgas.Board.GUIElement.Menu.js")
	
	// ControllerConfig
	WR(guiDir+"Morgas.Board.GUIElement.ControllerConfig.js");
	CSS(cssDir+"structure/GUIElement.ControllerConfig.css");
	
	WR(testDir+"test.Morgas.Board.GUIElement.ControllerConfig.js")
	
	// ControllerManager
	WR(morgasDir+"Morgas.Organizer.js");
	WR(guiDir+"Morgas.Board.GUIElement.ControllerManager.js");
	CSS(cssDir+"structure/GUIElement.ControllerManager.css");
	
	WR(testDir+"test.Morgas.Board.GUIElement.ControllerManager.js")
	
	// 
	
	CSS(cssDir+"themes/TalePlay-classic.css");
})();