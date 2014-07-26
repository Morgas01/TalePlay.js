(function() {
	var name="TicTacToe";
	var SC=µ.getModule("shortcut")({
		Board:"Board",
		game:"Minigames.TicTacToe"
	});
	module(name);
	test(name, function() {
		var board = getBoard(name),
		layer=new SC.Board.Layer(),
		game=new SC.game();
		board.addLayer(layer);
		layer.add(game);
		ok(true);
	});
})();