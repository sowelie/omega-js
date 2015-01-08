define([
	"../_Widget",
	"./Button",
	"jquery",
	"../utils",
	"../router",
	"../messageBus",
	"text!./templates/NavBar.html"
], function(_Widget, Button, $, utils, router, messageBus, template) {
	
	return _Widget.extend({
		
		templateString: template,
		
		options: {
			
		},
		
		startup: function() {
			
			_Widget.prototype.startup.apply(this, arguments);
			
			this.update();
			
			messageBus.subscribe("router/routeChanged", this.update, this);
			
		},
		
		update: function() {
			
			this._containerNode.find("li.selected").removeClass("selected");
			
			this._containerNode.find("> li").each(utils.bind(function(index, element) {
				
				var element = $(element);
				
				// check to see if the route is the current route
				if (element.attr("data-route") == router.getCurrentRoute())
					element.addClass("selected");
				
				if (!element.data("navbar")) {
					
					element.data("navbar", true);
					
					// get the text
					var text = element.html();
					
					// create a link
					var link = $("<a />").html(text).attr("href", "#" + element.attr("data-route"));
					element.html(link);
					
					// process the link with the router
					router.processLink(link.get(0));
					
				}
				
			}, this));
			
		},
		
		_itemClick: function(node) {
			
			this.trigger("itemClick", node);
			
		}
		
	});
	
});