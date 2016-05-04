define([
	"omega/_Widget",
	"text!./templates/ProgressBar.html"
], function(_Widget, template) {

	return _Widget.extend({

		templateString: template,

		options: {
			value: 0,
			animated: false,
			indeterminate: false,
			label: ""
		},

		startup: function() {
			this.inherited(_Widget, arguments);

			this.setValue(this.value);
			this.setIndeterminate(this.indeterminate);

			if (!this.indeterminate) {
				this.setAnimated(this.animated);
			}

			this._updateLabel();
		},

		setValue: function(value) {

			if (value < 1) {
                this.find(".progress-label").hide();
			} else {
                this.find(".progress-label").show();
				this._valueNode.css("width", value + "%");
			}

		},

		getValue: function() {

			return parseInt(this._valueNode.css("width"));

		},

		setLabel: function(label) {

			this._domNode.find(".progress-label").html(label);

			this._updateLabel();

		},

		setAnimated: function(value) {
			if (value) {
				this._valueNode.addClass("progress-bar-striped active");
			} else {
				this._valueNode.removeClass("progress-bar-striped active");
			}
		},

		setIndeterminate: function(value) {
			this.setAnimated(value);

			if (value) {
				this._overlayNode.show();
				this.find(".progress-label").hide();
			} else {
				this._overlayNode.hide();
                this.find(".progress-label").show();
				this.setValue(this.value);
			}

		},

		_updateLabel: function() {

			// position the labels
			var label = this._domNode.find(".progress-label");

			this.log(this._domNode.outerWidth(), label.outerWidth(), label.html(), this);

			label.css("left", ((this._domNode.width() - label.width()) / 2) + "px");

		}

	});

});