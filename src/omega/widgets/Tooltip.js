define([
	"omega/_Widget",
	"omega/dom/events",
	"text!./templates/Tooltip.html"
], function(_Widget, events, template) {

	return _Widget.extend({

		templateString: template,
		options: {
			arrowPosition: "south"
		},

		startup: function() {

			this.inherited(_Widget, arguments);

			events.on(document, "click", this.hide, this);

			// set the class based on the arrowPosition property
			this._domNode.addClass("ui-tooltip-" + this.arrowPosition);

		},

		destroy: function() {

			this.inherited(_Widget, arguments);

			events.off(document, "click", this.hide, this);

		}

	}, "widgets.Tooltip");

});