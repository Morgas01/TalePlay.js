(function(µ,SMOD,GMOD){
	
	var MENU=µ.Menu=µ.Class({
		init:function(param)
		{	
			param=param||{};
			
			this.items=param.items||[];
			this.selectedIndexs=[];
			
			this.active=-1;
			
			this.loop=param.loop!==false;
		},
		addItem:function(item)
		{
			this.items.push(item);
		},
		removeItem:function(item)
		{
			var index=this.items.indexOf(item);
			if(index!==-1)
			{
				this.items.splice(index, 1);
				var sIndex=this.selectedIndexs.indexOf(index);
				if(sIndex!==-1)
				{
					this.selectedIndexs.splice(sIndex, 1);
				}
				if(this.active>index)
				{
					this.active--;
				}
				else if (this.active===index)
				{
					this.setActive(-1);
				}
			}
			return index;
		},
		getItem:function(index)
		{
			return {
				value:this.items[index],
				active:this.active===index,
				selected:this.selectedIndexs.indexOf(index)!==-1
			};
		},
		setActive:function(index)
		{
			this.active=Math.max(-1,Math.min(this.items.length-1,index));
		},
		activeUp:function()
		{
			if(this.active===-1)
			{
				if(this.loop)
				{
					this.setActive(this.items.length-1);
				}
				else
				{
					this.setActive(0);
				}
			}
			else if(this.active===0&&this.loop)
			{
				this.setActive(this.items.length-1);
			}
			else if (this.active>0)
			{
				this.setActive(this.active-1);
			}
		},
		activeDown:function()
		{
			if(this.active===this.items.length-1&&this.loop)
			{
				this.setActive(0);
			}
			else if (this.active<this.items.length-1)
			{
				this.setActive(this.active+1);
			}
		},
		toggleActive:function()
		{
			if(this.active!==-1)
			{
				var index=this.selectedIndexs.indexOf(this.active);
				if(index===-1)
				{
					this.selectedIndexs.push(this.active);
					return true;
				}
				else
				{
					this.selectedIndexs.splice(index, 1);
					return false;
				}
			}
			return null;
		},
		getSelectedItems:function()
		{
			var rtn=[];
			for(var i=0;i<this.selectedIndexs.length;i++)
			{
				rtn.push(this.getItem(i));
			}
			return rtn;
		}
	});
	
	SMOD("Menu",MENU);
	
})(Morgas,Morgas.setModule,Morgas.getModule)