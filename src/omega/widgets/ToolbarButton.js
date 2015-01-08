define([
	"omega/widgets/DropDownButton"
], function(DropDownButton) {

	return DropDownButton.extend({

		startup: function() {

			this.inherited(DropDownButton, arguments);

			this._arrowNode.hide();

		},

		addChild: function() {

			this.inherited(DropDownButton, arguments);

			this._arrowNode.show();

		},

		_onClick: function() {

			this.inherited(DropDownButton, arguments);

			// don't let the menu show for regular buttons
			if (this._childWidgets.length == 0)
				this.hideMenu();

		}

	}, "widgets.ToolbarButton");

});