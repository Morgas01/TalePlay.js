(function(µ,SMOD,GMOD,HMOD){
	
	var GUI=GMOD("GUIElement");
	
	var SC=GMOD("shortcut")({
		ENERGY:"Character.Energy"
	})
	
	GUI.CharacterPanel=µ.Class(GUI,{
		init:function(character,keys)
		{
			this.mega({styleClass:"CharacterPanel"})
			this.character=character;
			if(!keys)
			{
				keys=[];
				for(var a in character)
				{
					if(character[a] instanceof SC.ENERGY)
					{
						keys.push(a);
					}
				}
			}
			this._setHTML(keys);
			this.update();
		},
		/**
		 * generates html for this GuiElement
		 */
		_setHTML:function(keys)
		{
			var html='<span>'+this.character.name+'</span>';
			for(var i=0;i<keys.length;i++)
			{
				html+='<span data-energy="'+keys[i]+'">'+
					'<span></span>'+
					'<meter min="0" ></meter>'
				'</span>'
			}
			this.domElement.innerHTML=html;
		},
		update:function()
		{
			var groups=this.domElement.querySelectorAll("[data-energy]");
			for(var g=0;g<groups.length;g++)
			{
				var group=groups[g];
				var energy=this.character[group.dataset.energy];
				group.childNodes[0].textContent=energy.value+" / "+energy.max;
				group.childNodes[1].max=energy.max;
				group.childNodes[1].value=energy.value;
			}
		}
	});
	SMOD("GUI.CharacterPanel",GUI.CharacterPanel);
	
})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule);