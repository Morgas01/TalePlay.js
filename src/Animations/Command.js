(function(µ,SMOD,GMOD,HMOD,SC){

	var	Animation=GMOD("Map.Animation");
	/**
	 * actions :
	 * +------------+---------------+
	 * ||	type	|	attributes	||
	 * +------------+---------------+
	 * |	WAIT	|	time		|
	 * +------------+---------------+
	 * |	SET		|	position	|
	 * +------------+---------------+
	 * |	FACE	|	dicrection	|
	 * +------------+---------------+
	 * |	TURN	|	//TODO		|
	 * +------------+---------------+
	 * |	MOVE	|	position	|
	 * +------------+---------------+
	 */
	var Command=Animation.Command=µ.Class(Animation,
	{
		init:function()
		{
			this.activeAction=null;
		},
		doAction:function(action)
		{
			this.activeAction=action;
		},
		step:function(image,timeDiff)
		{
			if(this.activeAction)
			{
				switch (this.activeAction.type.toUpperCase)
				{
					case "WAIT":
						if(this.activeAction.time-=timeDiff<0) this.activeAction=null;
						break;
					case "SET":
						image.setPosition(this.activeAction.position);
						this.activeAction=null;
						break;
					case "FACE":
						image.direction.set(this.activeAction.direction);
						image.updateDirection();
						this.activeAction=null;
						break;
					case "TURN":
						//TODO
						break;
					case "MOVE":
						var dist=image.getPosition().negate().add(this.activeAction.position);
						var dir=dist.clone().div(Math.max(Math.abs(dist.x),Math.abs(dist.y)));
						var info=image.move(dir,timeDiff);
						if(info.distance.length()>=dist.length())
						{
							image.setPosition(this.activeAction.position);
							this.activeAction=null;
						}
						else if (info.collided)this.activeAction=null;
						break;
					default:
						µ.logger.error("unknown action type: ",this.activeAction.type);
					case "END":
						this.activeAction=null;
				}
			}
			if(!this.activeAction) return false;
			return true;
		}
	});
    SMOD("Map.Animation.Command",Command);
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);