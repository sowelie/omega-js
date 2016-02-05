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

		setIndeterminate: function(value) {

			if (value) {

				this._overlayNode.show();
				this.find(".progress-label").hide();
				this._valueNode.addClass("progress-bar-striped active");

			} else {

				this._overlayNode.hide();
                this.find(".progress-label").show();
				this.setValue(this.value);
				this._valueNode.removeClass("progress-bar-striped active");

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