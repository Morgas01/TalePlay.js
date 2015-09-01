window.addEventListener("load", function()
{
	var SC=µ.shortcut({
		download:"download",
		find:"find",
		Board:"Board",
		kCon:"Controller.Keyboard",
		padCon:"Controller.Gamepad",
		Layer:"Layer",
		ControllerManager:"GUI.ControllerManager",
		MapMaker:"MapMaker",
		Idb:"IDBConn"
	});
	
	var board=new SC.Board(document.querySelector("#bordContainer"));
	var kCon=new SC.kCon();
	board.addController(kCon);
	var controllerLayer=new SC.Layer();
	controllerLayer.domElement.classList.add("overlay");
	var manager=new SC.ControllerManager({
		styleClass:["panel","center"],
		buttons:3,
		analogSticks:2,
		mappings:[kCon.getMapping()],
		dbConn:new SC.Idb("mapMaker")
	});
	controllerLayer.add(manager);
	var mapMaker=new SC.MapMaker({
        board:board,
        images:[
            {url:"../Images/empty.png"},
            {url:"../Images/1.png"},
            {url:"../Images/2.png"},
            {url:"../Images/3.png"}
        ]
    });
	
	var actions={
		save:function()
		{
			SC.download(JSON.stringify(mapMaker),"map.js","application/json");
			board.focus();
		},
		load:function(e)
		{
			e.target.nextElementSibling.click();
			board.focus();
		},
		addImage:function()
		{
			document.querySelector("#addImageDialog").classList.remove("hidden");
			document.querySelector("#addImageDialog textarea").focus();
		},
		putImages:function()
		{
			var dialog=document.querySelector("#addImageDialog");
			var images=[];
			
			var input=dialog.querySelector("input");
			for(var i=0;i<input.files.length;i++)
			{
				images.push(input.files[i]);
			}
			input.value="";
			
			var textArea=dialog.querySelector("textarea");
			if(textArea.value)
			{
				images=images.concat(textArea.value.split("\n").map(function(val)
				{
					return val.trim();
				}));
			}
			textArea.value="";
			
			dialog.classList.add("hidden");
			mapMaker.addImages(images);
			board.focus();
		},
        removeImage:function()
        {
            mapMaker.GUIElements[1].removeItem(mapMaker.GUIElements[1].getActive().value);
            board.focus();
        },
		toggleControllerManager:function()
        {
			if(board.hasLayer(controllerLayer))
			{
				board.removeLayer(controllerLayer);
			}
			else
			{
	            board.addLayer(controllerLayer);
	            manager.update();
			}
        }
	};
	
	window.addEventListener("click", function(e)
	{
		//execute actions
		var action=e.target.dataset.action;
		if(action)
		{
			if(!actions[action])
			{
				alert("action "+action+" is undefined");
			}
			else
			{
				actions[action](e);
			}
		}
	}, false);
	
	document.getElementById("loadInput").addEventListener("change", function(e)
	{
		var reader=new FileReader();
		reader.onload=function()
		{
			mapMaker.fromJSON(JSON.parse(reader.result));
		};
		reader.readAsText(e.target.files[0]);
		board.focus();
	}, false);

	board.focus();
}, false);