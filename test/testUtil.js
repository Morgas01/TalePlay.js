function logController()
{
	var type=this instanceof µ.getModule("Controller.Keyboard")?"Keyboard":"Gamepad"
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
	var Kcon=new (µ.getModule("Controller.Keyboard"))();
	Kcon.addListener("changed",Kcon,logController);
	
	var container=getContainer(name);
	var board=new (µ.getModule("Board"))(container);
	board.addController(Kcon);

	return board;
}