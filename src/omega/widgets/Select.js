define([
	"omega/_Widget",
	"jquery",
	"text!./templates/Select.html"
], function(_Widget, $, template) {

	return _Widget.extend({

		templateString: template,

		startup: function() {

			this.inherited(_Widget, arguments);

			this.wireEventsTo(this._domNode);

		},

		addOption: function(label, value) {

			$("<option />").html(label).attr("value", value).appendTo(this._domNode);

		},

        clear: function() {
            this._domNode.empty();
        },

		getValue: function() {

			return this._domNode.find("option:selected").attr("value");

		},

		getDisplayedValue: function() {

			return this._domNode.find("option:selected").html();

		},

		setValue: function(value) {

			return this._domNode.val(value);

		}

	});

});