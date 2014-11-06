(function(µ,SMOD,GMOD,TalePlay){
    var MORGAS_PATH="Morgas/src/";
    var t=this.TalePlay=TalePlay=TalePlay||{};
    TalePlay.dependencies= µ.dependencies.clone(MORGAS_PATH);
    TalePlay.dependencies.addConfig({
        "Morgas.Board.js":{
            deps:[MORGAS_PATH+"Morgas.js"],
            uses:[MORGAS_PATH+"Morgas.NodePatch.js","Morgas.Controller.js","css/structure/core.css"]
        },
        "Morgas.Board.Layer.js":{
            deps:[MORGAS_PATH+"Morgas.js","Morgas.Board.js"],
            uses:[MORGAS_PATH+"Morgas.NodePatch.js"]
        },
        "Morgas.Controller.js":{
            deps:[MORGAS_PATH+"Morgas.js"],
            uses:["Morgas.Controller.Mapping.js"]
        },
        "Morgas.Controller.Mapping.js":{
            deps:[MORGAS_PATH+"Morgas.js","Morgas.Controller.js",MORGAS_PATH+"DB/Morgas.DB.js"],
            uses:[]
        },
        "Morgas.Controller.Keyboard.js":{
            deps:[MORGAS_PATH+"Morgas.js","Morgas.Controller.js"],
            uses:[]
        },
        "Morgas.Controller.Gamepad.js":{
            deps:[MORGAS_PATH+"Morgas.js","Morgas.Controller.js"],
            uses:[]
        },
    
        "Math/Morgas.Math.Point.js":{
            deps:[MORGAS_PATH+"Morgas.js"],
            uses:[]
        },
        "Math/Morgas.Math.Rect.js":{
            deps:[MORGAS_PATH+"Morgas.js","Math/Morgas.Math.Point.js"],
            uses:[]
        },
        "Morgas.Map.js":{
            deps:[MORGAS_PATH+"Morgas.js"],
            uses:[MORGAS_PATH+"Morgas.util.object.js","Math/Morgas.Math.Point.js","Math/Morgas.Math.Rect.js","css/structure/Map.css"]
        },
    
        "Morgas.Menu.js":{
            deps:[MORGAS_PATH+"Morgas.js"],
            uses:[]
        },
    
        "GUI/Morgas.Board.GUIElement.js":{
            deps:[MORGAS_PATH+"Morgas.js","Morgas.Board.js"],
            uses:[MORGAS_PATH+"Morgas.NodePatch.js"]
        },
        "GUI/Morgas.Board.GUIElement.Menu.js":{
            deps:[MORGAS_PATH+"Morgas.js","GUI/Morgas.Board.GUIElement.js"],
            uses:["Morgas.Menu.js","css/structure/GUIElement.Menu.css"]
        },
        "GUI/Morgas.Board.GUIElement.ControllerConfig.js":{
            deps:[MORGAS_PATH+"Morgas.js","GUI/Morgas.Board.GUIElement.js"],
            uses:["Morgas.Controller.js","Morgas.Controller.Mapping.js","css/structure/GUIElement.ControllerConfig.css"]
        },
        "GUI/Morgas.Board.GUIElement.ControllerManager.js":{
            deps:[MORGAS_PATH+"Morgas.js","GUI/Morgas.Board.GUIElement.js"],
            uses:["Morgas.Menu.js","Morgas.Controller.js","Morgas.Controller.Keyboard.js","Morgas.Controller.Gamepad.js","Morgas.Controller.Mapping.js",
                "GUI/Morgas.Board.GUIElement.Menu.js","GUI/Morgas.Board.GUIElement.ControllerConfig.js","css/structure/GUIElement.ControllerManager.css"]
        },
        "GUI/Morgas.Board.GUIElement.Map.js":{
            deps:[MORGAS_PATH+"Morgas.js","GUI/Morgas.Board.GUIElement.js","Morgas.Map.js"],
            uses:[MORGAS_PATH+"Morgas.util.object.js","Math/Morgas.Math.Point.js"]
        },

        "Morgas.Board.Layer.MapMaker.js":{
            deps:[MORGAS_PATH+"Morgas.js","Morgas.Board.Layer.js"],
            uses:["Morgas.Map.js","GUI/Morgas.Board.GUIElement.Map.js","Morgas.Menu.js","GUI/Morgas.Board.GUIElement.Menu.js",MORGAS_PATH+"Morgas.util.object.js",
                  "css/structure/Layer.MapMaker.css"]
        }
    });

})(Morgas,Morgas.setModule,Morgas.getModule,window.TalePlay);