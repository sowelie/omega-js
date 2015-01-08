define([
	"omega/_Widget"
], function(_Widget) {

	return _Widget.extend({

		templateString: "<input type=\"checkbox\" value=\"{value}\" />",

		startup: function() {

			this.inherited(_Widget, arguments);

			this.wireEventsTo(this._domNode);

		},

		getValue: function() {
			return this._domNode.val();
		},

		setValue: function(value) {
			this._domNode.val(value);
		},

		isChecked: function() {
			return this._domNode.is(":checked");
		},

		setChecked: function(checked) {

			this._domNode.get(0).checked = checked;

		},

		setIndeterminate: function(value) {

			var element = this._domNode.get(0);

			if (value) {
				element.indeterminate = true;
			} else {
				element.indeterminate = false;
			}

		}

	});

});