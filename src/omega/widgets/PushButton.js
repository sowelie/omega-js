define([
	"omega/widgets/Button"
], function(Button) {

	return Button.extend({

		options: {
			checked: false
		},

		startup: function() {

			this.inherited(Button, arguments);

			// update the state so the initial value of checked will be respected
			this._updateState();

		},

		getChecked: function() {

			return this.checked;

		},

		setChecked: function(value) {

			this.checked = value;
			this._updateState();

		},

		_onClick: function() {

			if (this._domNode.attr("disabled"))
				return false;

			// toggle the checked property
			this.checked = !this.checked;

			// update the class
			this._updateState();

			this.inherited(Button, arguments);

		},

		_onMouseUp: function() {



		},

		_updateState: function() {

			if (this.checked)
				this._domNode.addClass("ui-state-focus");
			else
				this._domNode.removeClass("ui-state-focus");

		}

	}, "widgets.PushButton");

});