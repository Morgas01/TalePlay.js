(function(µ,SMOD,GMOD){

	var BOARD=GMOD("Board"),
	LST=GMOD("Listeners");
	
	var LAYER=BOARD.Layer=µ.Class(LST,{
		init:function(board)
		{
			this.superInit(LST);
			this.createListener("changed axisChanged buttonChanged .board");
			
			this.board=null;
			this.setBoard(board);
		},
		setBoard:function(board)
		{
			this.board=board;
			this.setState(".board",this.board);
		},
		removeBoard:function()
		{
			this.board=null;
			this.setState(".board",null);
		}
	});
	
})(Morgas,Morgas.setModule,Morgas.getModule)