﻿window.addEventListener("load", function()
{
	let SC=µ.getModule("shortcut")({
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
	
	let board=new SC.Board(document.querySelector("#bordContainer"));
	let kCon=new SC.kCon({
		"buttons": {
			" ": "0",
			"Enter": "1"
		},
		"buttonAxis": {
			"w": "1",
			"d": "0",
			"s": "-1",
			"a": "-0",
			"Up": "3",
			"Right": "2",
			"Down": "-3",
			"Left": "-2"
		}
	});
	board.addController(kCon);
	let controllerLayer=new SC.Layer();
	controllerLayer.domElement.classList.add("overlay");
	let manager=new SC.ControllerManager({
		styleClass:["panel","center"],
		buttons:2,
		analogSticks:2,
		mappings:[kCon.getMapping()],
		dbConn:new SC.Idb("mapMaker")
	});
	controllerLayer.add(manager);
	let mapMaker=new SC.MapMaker({
        board:board,
        images:[
            {url:"../Images/empty.png"},
            {url:"../Images/1.png"},
            {url:"../Images/2.png"},
            {url:"../Images/3.png"}
        ]
    });
	
	let actions={
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
			let dialog=document.querySelector("#addImageDialog");
			let images=[];
			
			let input=dialog.querySelector("input");
			for(let i=0;i<input.files.length;i++)
			{
				images.push(input.files[i]);
			}
			input.value="";
			
			let textArea=dialog.querySelector("textarea");
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
		let action=e.target.dataset.action;
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
		let reader=new FileReader();
		reader.onload=function()
		{
			mapMaker.fromJSON(JSON.parse(reader.result));
		};
		reader.readAsText(e.target.files[0]);
		board.focus();
	}, false);

	board.focus();
}, false);