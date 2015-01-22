function logController()
{
	let type=this instanceof µ.getModule("Controller.Keyboard")?"Keyboard":"Gamepad";
	document.getElementById("logger").value=type+": "+this;
}

window.addEventListener("load", function()
{
	let logger=document.createElement("textarea");
	logger.id="logger";
	document.body.insertBefore(logger, document.querySelector("#qunit-fixture").nextSibling);
});
function getContainer(name)
{
    let container=document.createElement("fieldset");
    container.innerHTML='<legend>'+name+'</legend>';
    document.body.appendChild(container);
    return container
}
function getBoard(name)
{
	let Kcon=new (µ.getModule("Controller.Keyboard"))();
	Kcon.addListener("changed",Kcon,logController);
	
	let container=getContainer(name);
	let board=new (µ.getModule("Board"))(container);
	board.addController(Kcon);

	return board;
}