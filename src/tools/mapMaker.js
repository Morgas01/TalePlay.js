window.addEventListener("load", function()
{
	var SC=µ.getModule("shortcut")({
		find:"find",
		Board:"Board",
		kCon:"Controller.Keyboard",
		padCon:"Controller.Gamepad",
		Layer:"Layer",
		MapMaker:"MapMaker",
	});
	
	var board=new SC.Board(document.querySelector("#bordContainer"));
	var kCon=new SC.kCon({
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
	var mapMaker=new SC.MapMaker({board:board});
	
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
			document.querySelector("#addImageDialog textarea").focus();
		},
		putImages:function()
		{
			var dialog=document.querySelector("#addImageDialog");
			var images=[]
			
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
	

	board.focus();
}, false);