(function(µ,SMOD,GMOD){

	var GUI=GMOD("GUIElement"),
	
	SC=GMOD("shortcut")({
		MAP:"Map",
		rescope:"rescope",
		proxy:"proxy",
		point:"Math.Point"
	});
	
	GUI.Map=µ.Class(GUI,{
		init:function(param)
		{
			param=param||{};
			
			this.superInit(GUI,param.styleClass)
			this.map=new SC.Map({
				domElement:this.domElement,
				items:param.items,
				position:param.position
			});
			SC.proxy("map",{
				add:"addImages",
				setPosition:"setPosition",
				move:"move",
				getImages:"getImages",
				getSize:"getSize"
			},this);
			this.cursor=null;
			this.setCursor(param.cursor);
			this.offset=new SC.point();
			this._negOffset=new SC.point();
			this.setOffset(param.offset);
		},
		setCursor:function(cursor)
		{
			if(this.cursor)
			{
				this.map.remove(this.cursor);
			}
			this.map.add(cursor);
			this.cursor=cursor;
			this.cursor.move(this._negOffset);
		},
		getCursor:function()
		{
			return this.cursor;
		},
		setOffset:function(numberOrPoint,y)
		{
			if(this.cursor)
			{
				this.cursor.move(this.offset);
			}
			this.offset.set(numberOrPoint,y);
			this._negOffset.set(this.offset).negate();
			if(this.cursor)
			{
				this.cursor.move(this._negOffset);
			}
		},
		setCursorPosition:function(numberOrPoint,y)
		{
			if(this.cursor)
			{
				this.cursor.setPosition(this._negOffset.clone().add(numberOrPoint,y));
	        	this.updateCursor();
			}
		},
		moveCursor:function(numberOrPoint,y)
		{
			if(this.cursor)
			{
				this.cursor.move(numberOrPoint,y);
	        	this.updateCursor();
			}
		},
		getCursorPosition:function()
		{
			if(this.cursor)
			{
				return this.cursor.position.clone().add(this._negOffset);
			}
			return undefined
		},
        update:function(noimages)
        {
        	this.updateCursor();
        	this.map.update(noImages);
        },
        updateCursor:function()
        {
			if(this.cursor)
			{
				var size=this.map.getSize(),
				pos=this.cursor.position;
				if(pos.x+this.offset<0)
				{
					pos.x=this._negOffset.x;
				}
				if(pos.x+this.offset>size.x)
				{
					pos.x=size.x+this._negOffset.x;
				}
				if(pos.y+this.offset<0)
				{
					pos.y=this._negOffset.y;
				}
				if(pos.y+this.offset>size.y)
				{
					pos.y=size.y+this._negOffset.y;
				}
				this.cursor.update();
			}
        },
		onAnalogStick:function(event)
		{
			
		}
	});
	
})(Morgas,Morgas.setModule,Morgas.getModule);