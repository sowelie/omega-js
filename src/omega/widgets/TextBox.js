define([
	"omega/_Widget",
	"omega/dom/events",
	"text!./templates/TextBox.html",
	"text!./templates/TextBox_multiLine.html"
], function(_Widget, events, template, templateMultiLine) {

	return _Widget.extend({

		templateString: null,

		options: {
			type: "text",
			multiLine: false
		},

		initialize: function() {

			this.inherited(_Widget, arguments);

			if (this.multiLine)
				this.templateString = templateMultiLine;
			else
				this.templateString = template;

		},

		startup: function() {

			_Widget.prototype.startup.apply(this, arguments);

			if (this.placeholder)
				this._textNode.attr("placeholder", this.placeholder);

			if (this.name)
				this._textNode.attr("name", this.name);

			if (this.value)
				this.setValue(this.value);

		},

		on: function(event, handler, scope) {

			// forward all events to the textbox
			events.on(this._textNode, event, handler, scope);

		},

		getValue: function() {

			return this._textNode.val();

		},

		setValue: function(value) {

			this._textNode.val(value);

		},

		focus: function() {

			this._textNode.focus();

		},

		select: function() {

			this._textNode.select();

		},

		setEnabled: function(value) {

			if (value)
				this._textNode.removeAttr("disabled");
			else
				this._textNode.attr("disabled", "disabled");

		}

	});

});