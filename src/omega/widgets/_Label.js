define([
	"omega/_Widget"
], function(_Widget) {

	return _Widget.extend({

		setLabel: function(text) {

			this._containerNode.html(text);

		},

		getLabel: function() {

			return this._containerNode.html();

		}

	});

});