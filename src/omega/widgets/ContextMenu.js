define([
	"./Menu"
], function(Menu, template) {
	
	return Menu.extend({
		
		startup: function() {
			
			// default to binding to the body
			if (!this.parentNode)
				this.parentNode = document.body;
			
			this.inherited(Menu, arguments);
			
			this._domNode.addClass("ui-contextmenu");
			
			this.on("menuitemclick", this.hide, this);
			
		},
		
		destroy: function() {
			
			this.inherited(Menu, arguments);
			
			this.off("menuitemclick", this.hide, this);
			
		},
		
		show: function(x, y) {
			
			// TODO: handle auto positioning the menu
			if (x && y) {
				
				this._domNode.css("top", y);
				this._domNode.css("left", x);
				
			}
			
			this._domNode.show();
			
		},
		
		hide: function() {
			
			this._domNode.hide();
			
		}
		
	});
	
});