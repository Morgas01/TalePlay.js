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
function getContainer(name)
{
    var container=document.createElement("fieldset");
    container.innerHTML='<legend>'+name+'</legend>';
    document.body.appendChild(container);
    return container
}
function getBoard(name)
{
	var Kcon=new Morgas.Controller.Keyboard();
	Kcon.addListener("changed",logController);
	
	var container=getContainer(name);
	var board=new µ.Board(container);
	board.addController(Kcon);

	return board;
}