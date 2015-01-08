define([
	"omega/_Widget",
	"text!./templates/Confirmation.html"
], function(_Widget, template) {

	return _Widget.extend({

		options: {
			negativeLabel: "No",
			positiveLabel: "Yes"
		},

		templateString: template,

		startup: function() {

			_Widget.prototype.startup.apply(this, arguments);

			this._positiveButtonNode.on("click", this._positiveClick, this);
			this._negativeButtonNode.on("click", this._negativeClick, this);

		},

		setMessage: function(message) {

			this._messageNode.html(message);

		},

		_positiveClick: function() {

			this.trigger("confirm");

		},

		_negativeClick: function() {

			this.trigger("cancel");

		}

	});

});