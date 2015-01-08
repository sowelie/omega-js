define([
	"omega/_Widget",
	"text!./templates/ProgressBar.html"
], function(_Widget, template) {

	return _Widget.extend({

		templateString: template,

		options: {
			value: 0,
			label: ""
		},

		startup: function() {

			this.inherited(_Widget, arguments);

			this.setValue(this.value);

			this._updateLabel();

			this.setIndeterminate(this.indeterminate);

		},

		setValue: function(value) {

			if (value < 1) {
				this._valueNode.hide();
			} else {
				this._valueNode.show();
				this._valueNode.css("width", value + "%");
			}

		},

		getValue: function() {

			return parseInt(this._valueNode.css("width"));

		},

		setLabel: function(label) {

			this._domNode.find(".ui-progressbar-label").html(label);

			this._updateLabel();

		},

		setIndeterminate: function(value) {

			if (value) {

				this._overlayNode.show();
				this._valueNode.hide();
				this._domNode.addClass("ui-progressbar-indeterminate");

			} else {

				this._overlayNode.hide();
				this.setValue(this.value);
				this._domNode.removeClass("ui-progressbar-indeterminate");

			}

		},

		_updateLabel: function() {

			// position the labels
			var label = this._domNode.find(".ui-progressbar-label");

			this.log(this._domNode.outerWidth(), label.outerWidth(), label.html(), this);

			label.css("left", ((this._domNode.width() - label.width()) / 2) + "px");

		}

	});

});