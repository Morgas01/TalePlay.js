window.addEventListener("load", function()
{
	var SC=µ.getModule("shortcut")({
		find:"find",
		Board:"Board",
		kCon:"Controller.Keyboard",
		padCon:"Controller.Gamepad",
		Layer:"Layer",
		Map:"GUI.Map",
	});
	var images=[];
	var updateImages=function()
	{
		var container=document.querySelector("#Images");
		for(var i=container.children.length;i<images.length;i++)
		{
			var img=document.createElement("img");
			img.src=images[i].url;
			container.appendChild(img);
		}
	}
	var actions={
		save:function()
		{
			//todo
		},
		load:function()
		{
			//todo
		},
		addImage:function()
		{
			document.querySelector("#addImageDialog").classList.remove("hidden");
		},
		putImages:function()
		{
			var dialog=document.querySelector("#addImageDialog");
			
			var input=dialog.querySelector("input");
			for(var i=0;i<input.files.length;i++)
			{
				images.push({file:input.files[i],url:URL.createObjectURL(input.files[i])});
			}
			input.value="";
			
			var textArea=dialog.querySelector("textarea");
			if(textArea.value)
			{
				images=images.concat(textArea.value.split("\n").map(function(val)
				{
					return {url:val.trim()};
				}));
			}
			textArea.value="";
			
			dialog.classList.add("hidden");
			updateImages();
		}
	};
	window.addEventListener("click", function(e)
	{
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
	
	var board=new SC.Board(document.querySelector("#bordContainer"));
	var kCon=new SC.kCon({
		"buttons": {
			" ": "0"
		},
		"buttonAxis": {
			"Up": "3",
			"Right": "2",
			"Down": "-3",
			"Left": "-2"
		}
	});
	board.addController(kCon);
	
	var layer=new SC.Layer();
	var map=new SC.Map({
		cursors:new SC.Map.Cursor("../Images/cursor_target.svg",0,{x:100,y:100},{x:50,y:50})
	});
	board.addLayer(layer);
	layer.add(map);
	map.setPosition(0);
}, false);