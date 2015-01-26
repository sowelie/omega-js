define([
	"omega/_Widget",
	"text!./templates/TabContainer.html",
	"omega/widgets/TabContainer"
], function(_Widget, template) {

	return _Widget.extend({

		templateString: template,

		startup: function() {

			this.inherited(_Widget, arguments);

			this._tabContainerNode.layoutChildren();

		}

	});

});