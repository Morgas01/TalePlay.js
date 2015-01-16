(function(µ,SMOD,GMOD){

	var MENU=GMOD("GUI.Menu"),
	
	SC=GMOD("shortcut")({
		menu:"Menu"
	});
	var TicTacToe=µ.Class(MENU,{
		init:function(param)
		{
			param=param||{};
			param.type=MENU.Types.GRID;
			param.rows=param.columns=3;
			param.items=[0,0,0,0,0,0,0,0,0];
			param.converter=param.converter||TicTacToe.defaultConverter;
			param.active=param.active||4;
			
			this.superInit(MENU,param)
			this.addStyleClass("TicTacToe");
			this.createListener("finish");

			this.player=param.player||["manual","manual"];
			
			this.setTurn(param.turn);
			this.addListener("select",this,"_select")
		},
		setTurn:function(turn)
		{
			this.turn=+!!turn
			this.domElement.dataset.turn=this.turn+1;
		},
		toggleTurn:function()
		{
			this.setTurn(!this.turn);
		},
		_select:function(event)
		{
			if(event.selected)
			{
				this.toggleSelect(event.index);
				if(!event.value)
				{
					this.menu.items[event.index]=this.turn+1;
					this.update();
					var finished=this.checkFinish();
					if(finished!==null)
					{
						this.fire("finish",{winner:finished})
					}
					else
					{
						this.toggleTurn();
					}
				}
			}
		},
		checkFinish:function()
		{
			var items=this.menu.items;
			for(var i=0;i<3;i++)
			{
				if(items[i*3]&&items[i*3]===items[i*3+1]&&items[i*3]===items[i*3+2])
				{
					return items[i*3];
				}
				else if(items[i]&&items[i]===items[i+3]&&items[i]===items[i+6])
				{
					return items[i];
				}
			}
			if (items[4]&&((items[4]===items[0]&&items[4]===items[8])||(items[4]===items[2]&&items[4])===items[6]))
			{
				return items[4];
			}
			for(var i=0;i<items.length;i++)
			{
				if(!items[i])
				{
					return null;
				}
			}
			return 0;
		},
		clear:function()
		{
			this.menu.clear();
			this.menu.addAll([0,0,0,0,0,0,0,0,0]);
			this.update();
			this.toggleTurn();
			this.setActive(4);
		}
	});
	TicTacToe.defaultConverter=function(item)
	{
		return item==1?"◯":item==2?"✕":"&nbsp;";
	};
	SMOD("Minigames.TicTacToe",TicTacToe);
})(Morgas,Morgas.setModule,Morgas.getModule);