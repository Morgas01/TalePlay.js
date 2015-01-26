(function(µ,SMOD,GMOD){
    var MORGAS_PATH="Morgas/src/";
    var t=this.TalePlay=this.TalePlay||{};
    t.dependencies= µ.dependencies.clone(MORGAS_PATH);
    t.dependencies.addConfig({
        "TalePlay.Board.js":{
            deps:[MORGAS_PATH+"Morgas.js"],
            uses:[MORGAS_PATH+"Morgas.util.function.rescope.js",MORGAS_PATH+"Morgas.NodePatch.js","css/structure/core.css"]
        },
        "TalePlay.Layer.js":{
            deps:[MORGAS_PATH+"Morgas.js",MORGAS_PATH+"Morgas.Listeners.js"],
            uses:[MORGAS_PATH+"Morgas.NodePatch.js"]
        },
        "TalePlay.Controller.js":{
            deps:[MORGAS_PATH+"Morgas.js",MORGAS_PATH+"Morgas.Listeners.js","Math/TalePlay.Math.Point.js"],
            uses:["TalePlay.Controller.Mapping.js"]
        },
        "TalePlay.Controller.Mapping.js":{
            deps:[MORGAS_PATH+"Morgas.js","TalePlay.Controller.js",MORGAS_PATH+"DB/Morgas.DB.js"],
            uses:[]
        },
        "TalePlay.Controller.Keyboard.js":{
            deps:[MORGAS_PATH+"Morgas.js","TalePlay.Controller.js"],
            uses:[MORGAS_PATH+"Morgas.util.function.rescope.js"]
        },
        "TalePlay.Controller.Gamepad.js":{
            deps:[MORGAS_PATH+"Morgas.js","TalePlay.Controller.js"],
            uses:[MORGAS_PATH+"Morgas.util.function.rescope.js"]
        },
        
        "TalePlay.Map.js":{
            deps:[MORGAS_PATH+"Morgas.js"],
            uses:[MORGAS_PATH+"Morgas.util.object.find.js",MORGAS_PATH+"Morgas.NodePatch.js",
                  "Math/TalePlay.Math.Point.js","Math/TalePlay.Math.Rect.js","css/structure/Map.css"]
        },
        "TalePlay.Menu.js":{
            deps:[MORGAS_PATH+"Morgas.js"],
            uses:[]
        },
        "TalePlay.Layer.MapMaker.js":{
            deps:[MORGAS_PATH+"Morgas.js","TalePlay.Layer.js"],
            uses:[MORGAS_PATH+"Morgas.util.function.rescope.js",MORGAS_PATH+"Morgas.util.object.inputValues.js","TalePlay.Map.js","GUI/TalePlay.GUIElement.Map.js",
                  "TalePlay.Menu.js","GUI/TalePlay.GUIElement.Menu.js","css/structure/Layer.MapMaker.css"]
        },
    
        "Math/TalePlay.Math.Point.js":{
            deps:[MORGAS_PATH+"Morgas.js"],
            uses:[]
        },
        "Math/TalePlay.Math.Rect.js":{
            deps:[MORGAS_PATH+"Morgas.js","Math/TalePlay.Math.Point.js"],
            uses:[]
        },
    
        "GUI/TalePlay.GUIElement.js":{
            deps:[MORGAS_PATH+"Morgas.js",MORGAS_PATH+"Morgas.Listeners.js"],
            uses:[MORGAS_PATH+"Morgas.NodePatch.js"]
        },
        "GUI/TalePlay.GUIElement.ControllerConfig.js":{
            deps:[MORGAS_PATH+"Morgas.js","GUI/TalePlay.GUIElement.js"],
            uses:[MORGAS_PATH+"Morgas.util.function.rescope.js","TalePlay.Controller.Mapping.js",
                  "css/structure/GUIElement.ControllerConfig.css"]
        },
        "GUI/TalePlay.GUIElement.ControllerManager.js":{
            deps:[MORGAS_PATH+"Morgas.js","GUI/TalePlay.GUIElement.js"],
            uses:[MORGAS_PATH+"Morgas.util.function.rescope.js","TalePlay.Controller.Keyboard.js","TalePlay.Controller.Gamepad.js","TalePlay.Controller.Mapping.js",
                  "TalePlay.Menu.js","GUI/TalePlay.GUIElement.Menu.js",
                  "GUI/TalePlay.GUIElement.ControllerConfig.js","css/structure/GUIElement.ControllerManager.css"]
        },
        "GUI/TalePlay.GUIElement.Map.js":{
            deps:[MORGAS_PATH+"Morgas.js","GUI/TalePlay.GUIElement.js","TalePlay.Map.js"],
            uses:[MORGAS_PATH+"Morgas.util.object.find.js",MORGAS_PATH+"Morgas.util.function.rescope.js",MORGAS_PATH+"Morgas.util.function.proxy.js",
                  MORGAS_PATH+"Morgas.Organizer.js","Math/TalePlay.Math.Point.js"]
        },
        "GUI/TalePlay.GUIElement.Menu.js":{
            deps:[MORGAS_PATH+"Morgas.js","GUI/TalePlay.GUIElement.js"],
            uses:[MORGAS_PATH+"Morgas.util.function.rescope.js","TalePlay.Menu.js","css/structure/GUIElement.Menu.css"]
        },
        "GUI/TalePlay.GUIElement.TextBox.js":{
        	deps:[MORGAS_PATH+"Morgas.js","GUI/TalePlay.GUIElement.js"],
        	uses:[MORGAS_PATH+"Morgas.util.function.rescope.js","css/structure/GUIElement.TextBox.css"]
        },
        
        "minigames/ButtonStack.js":{
        	deps:[MORGAS_PATH+"Morgas.js","GUI/TalePlay.GUIElement.js"],
        	uses:["minigames/ButtonStack.css"]
        },
        "minigames/TicTacToe.js":{
        	deps:[MORGAS_PATH+"Morgas.js","GUI/TalePlay.GUIElement.Menu.js"],
        	uses:["TalePlay.Menu.js","minigames/TicTacToe.css"]
        },
        "minigames/TimeStroke.js":{
        	deps:[MORGAS_PATH+"Morgas.js","GUI/TalePlay.GUIElement.js"],
        	uses:[MORGAS_PATH+"Morgas.util.function.rescope.js","minigames/TimeStroke.css"]
        },
        
        "RPGPlayer/TalePlay.RPGPlayer.js":{
        	deps:[MORGAS_PATH+"Morgas.js","TalePlay.Layer.js"],
        	uses:[MORGAS_PATH+"Morgas.Detached.js",MORGAS_PATH+"Morgas.util.Request.js",MORGAS_PATH+"DB/Morgas.DB.IndexedDBConnector.js",
        	      "GUI/TalePlay.GUIElement.Map.js","RPGPlayer/TalePlay.GUIElement.Dialog.js","RPGPlayer/TalePlay.RPGPlayer.GameSave.js",
        	      //defaults
        	      "TalePlay.Layer.ActionMenu.StartMenu.js","RPGPlayer/TalePlay.Layer.ActionMenu.GameMenu.js"]
        },
        "RPGPlayer/TalePlay.GUIElement.Dialog.js":{
        	deps:[MORGAS_PATH+"Morgas.js","GUI/TalePlay.GUIElement.js"],
        	uses:[MORGAS_PATH+"Morgas.util.function.proxy.js","GUI/TalePlay.GUIElement.TextBox.js","GUI/TalePlay.GUIElement.Menu.js"]
        },
        "RPGPlayer/TalePlay.RPGPlayer.GameSave.js":{
        	deps:[MORGAS_PATH+"Morgas.js",MORGAS_PATH+"DB/Morgas.DB.js","RPGPlayer/TalePlay.RPGPlayer.js"],
        	uses:[]
        },
        "TalePlay.Layer.ActionMenu.js":{
        	deps:[MORGAS_PATH+"Morgas.js","TalePlay.Layer.js"],
        	uses:["GUI/TalePlay.GUIElement.Menu.js"]
        },
        "TalePlay.Layer.ActionMenu.StartMenu.js":{
        	deps:[MORGAS_PATH+"Morgas.js","TalePlay.Layer.ActionMenu.js"],
        	uses:[MORGAS_PATH+"Morgas.util.Request.js"]
        },
        "RPGPlayer/TalePlay.Layer.ActionMenu.GameMenu.js":{
        	deps:[MORGAS_PATH+"Morgas.js","TalePlay.Layer.ActionMenu.js"],
        	uses:[MORGAS_PATH+"Morgas.util.Request.js"]
        }
    });

})(Morgas,Morgas.setModule,Morgas.getModule);