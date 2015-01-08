define([
"jquery"
], function($) {
		
	var container = null;
	var loadingMessage = null;
	var backdrop = null;
	
	var createDOM = function() {
		
		if (container == null) {
		
			container = $("<div />").addClass("loading");
			container.append($("<div />").addClass("image"));
			
			loadingMessage = $("<div />").addClass("message");
			container.append(loadingMessage);

			$(document.body).append(container);
			
			backdrop = $("<div />").addClass("loadingBackdrop");
			$(document.body).append(backdrop);
		
		}
		
	};
	
	return {
		
		show: function(message) {
			
			createDOM();
		
			if (message)
				loadingMessage.html(message);
			
			container.show();
			backdrop.show();
			
		},
		
		hide: function() {
			container.hide();
			backdrop.hide();
		}
	
	};
	
});