(function(µ,SMOD,GMOD,HMOD,SC){
	
	var GUI=GMOD("GUIElement");
	
	SC=SC({
		ENERGY:"Character.Energy"
	})
	
	GUI.CharacterPanel=µ.Class(GUI,{
		init:function(character,keys)
		{
			this.mega({
				element:"fieldset",
				styleClass:["CharacterPanel","panel"]
			})
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
			var html='<legend>'+this.character.name+'</legend>';
			for(var i=0;i<keys.length;i++)
			{
				html+='<span data-energy="'+keys[i]+'">'+
					'<meter min="0" ></meter>'+
					'<span></span>'+
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
				group.childNodes[0].max=energy.max;
				group.childNodes[0].value=energy.value;
				group.childNodes[1].textContent=energy.value+" / "+energy.max;
			}
		}
	});
	SMOD("GUI.CharacterPanel",GUI.CharacterPanel);

})(Morgas,Morgas.setModule,Morgas.getModule,Morgas.hasModule,Morgas.shortcut);