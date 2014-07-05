(function(µ,SMOD,GMOD){
	
	var MENU=µ.Menu=µ.Class({
		init:function(param)
		{	
			param=param||{};
			
			this.items=[];
			this.remote=false;
			if(param.remote)
			{
				this.remote=true;
				this.items=param.remote;
			}
			else if (param.items)
			{
				this.items=param.items;
			}
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
		clearSelect:function()
		{
			this.selectedIndexs.length=0;
		},
		isSelected:function(item)
		{
			var index=this.items.indexOf(item);
			if(index===-1)
			{
				index=item;
			}
			return this.selectedIndexs.indexOf(index)!==-1;
		},
		addSelect:function(item)
		{
			var index=this.items.indexOf(item);
			if(index===-1)
			{
				index=item;
			}
			if(this.items.hasOwnProperty(index)&&this.selectedIndexs.indexOf(index)===-1)
			{
				this.selectedIndexs.push(index);
				return true;
			}
			return false;
		},
		removeSelect:function(item)
		{
			var index=this.items.indexOf(item);
			if(index===-1)
			{
				index=item;
			}
			index=this.selectedIndexs.indexOf(index)
			if(index!==-1)
			{
				this.selectedIndexs.splice(index,1);
				return true;
			}
			return false;
		},
		toggleSelect:function(item)
		{
			var index=this.items.indexOf(item);
			if(index===-1)
			{
				index=item;
			}
			if(this.items.hasOwnProperty(index))
			{
				var sIndex=this.selectedIndexs.indexOf(index);
				if(sIndex===-1)
				{
					this.selectedIndexs.push(index);
					return true;
				}
				else
				{
					this.selectedIndexs.splice(sIndex,1);
					return false;
				}
			}
			return null;
		},
		setActive:function(index)
		{
			var min=-1,max=this.items.length-1;
			index=min>index?min:(max<index?max:index);
			if(this.active!==index)
			{
				this.active=index;
			}
		},
		moveActive:function(val)
		{
			var next=this.active+val;
			if(!this.loop)
			{
				next=0>next?0:next;
			}
			else
			{
				if(this.active===-1&&val<0)
				{
					next++;
				}
				next=next%this.items.length;
				if(next<0)
				{
					next=this.items.length-next;
				}
			}
			this.setActive(next);
		},
		toggleActive:function()
		{
			return this.toggleSelect(this.active);
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