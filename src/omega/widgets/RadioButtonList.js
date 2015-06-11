define([
	"omega/_Widget",
	"omega/utils",
	"omega/dom/events",
	"jquery",
	"text!./templates/RadioButtonList.html"
], function(_Widget, utils, events, $, template) {
	
	var radioIndex = 0;
	
	return _Widget.extend({
		
		templateString: template,
		
		startup: function() {
			
			this._radioButtons = [];
			
			if (!this._radioId) {
				this._radioId = radioIndex;
				radioIndex++;
			}
			
			_Widget.prototype.startup.apply(this, arguments);
			
			// add radio buttons
			this._domNode.find("> *[data-value]").each(utils.bind(function(index, element) {
				
				element = $(element);
				var label = element.find("> label");
				
				// create the label if it doesn't exist
				if (label.length == 0) {
					label = $("<label />").html(element.html().replace(/^\s*(.+)\s*$/g, "$1"));
					element.html(label);
				}
				
				// add a radio button to the label
				var radio = $("<input />").attr("type", "radio").attr("name", "radiobuttonlist_" + this._radioId).prependTo(label);
				var childPanel = element.find("> div");
				
				if (element.attr("data-checked"))
					radio.attr("checked", "checked");
				else if (childPanel.length) {
					
					childPanel.hide();
					
				}
				
				events.on(radio, "click", this._radioClick, this);
				
				this._radioButtons.push(radio);
				
			}, this));
			
		},
		
		destroy: function() {
			
			this.inherited(_Widget, arguments);
			
			this._radioButtons.forEach(function(radio) {
				
				events.off(radio, "click", this._radioClick, this);
				
			}, this);
			
		},
		
		_radioClick: function(e) {
			
			var element = $(e.target),
				container = element.parent().parent();
			
			container.parent().find("> *[data-value] > div").hide();
			container.find("> div").show();
			
		},
		
		getValue: function() {
			
			return this._domNode.find("input:checked").parents().closest("*[data-value]").attr("data-value");
			
		}
		
	});
	
});