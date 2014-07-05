var Kcon=new Morgas.Controller.Keyboard();
Kcon.addListener("changed",logController);

function logController()
{
	var type=this instanceof Morgas.Controller.Keyboard?"Keyboard":"Gamepad"
	document.getElementById("logger").value=type+": "+this;
}

window.addEventListener("load", function()
{
	var logger=document.createElement("textarea");
	logger.id="logger";
	document.body.insertBefore(logger, document.querySelector("#qunit-fixture").nextSibling);
});

function getBoard(name)
{
	var container=document.createElement("fieldset");
	container.innerHTML='<legend>'+name+'</legend>';
	
	var board=new µ.Board(container);
	board.addController(Kcon);
	
	document.body.appendChild(container);
	return board;
}