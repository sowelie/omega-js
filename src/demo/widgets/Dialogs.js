define([
	"omega/_Widget",
	"omega/widgets/AlertDialog",
	"omega/widgets/ConfirmationDialog",
	"omega/widgets/Dialog",
	"text!./templates/Dialogs.html",
	"omega/widgets/Dialog"
], function(_Widget, AlertDialog, ConfirmationDialog, Dialog, template) {

	return _Widget.extend({

		templateString: template,

		startup: function() {

			this.inherited(_Widget, arguments);

			this._alertDialogButtonNode.on("click", this._alertDialogClick, this);
			this._confirmDialogButtonNode.on("click", this._confirmDialogClick, this);
			this._regularDialogButtonNode.on("click", this._regularDialogClick, this);
			this._fullscreenDialogButtonNode.on("click", this._fullscreenDialogClick, this);

		},

		destroy: function() {

			this.inherited(_Widget, arguments);

			this._alertDialogButtonNode.off("click", this._alertDialogClick, this);
			this._confirmDialogButtonNode.off("click", this._confirmDialogClick, this);
			this._regularDialogButtonNode.off("click", this._regularDialogClick, this);
			this._fullscreenDialogButtonNode.off("click", this._fullscreenDialogClick, this);

		},

		_alertDialogClick: function() {

			new AlertDialog({
				message: "This is an alert!",
				title: "Alert!",
				destroyOnHide: true
			}).show();

		},

		_confirmDialogClick: function() {

			var showAlert = function(message) {

				new AlertDialog({
					message: message,
					title: "Alert!",
					destroyOnHide: true
				}).show();

			};

			new ConfirmationDialog({
				message: "This is an alert!",
				title: "Alert!",
				destroyOnHide: true
			}).on("confirm", function() {
				showAlert("Confirm!");
			}).on("cancel", function() {
				showAlert("Cancel!");
			}).show();

		},

		_regularDialogClick: function() {

			new Dialog({
				content: "This is a regular dialog that can be extended to create custom dialogs.",
				title: "Regular Dialog",
				destroyOnHide: true
			}).show();

		},

		_fullscreenDialogClick: function() {

			new Dialog({
				content: "This is a full screen dialog!",
				title: "Full Screen Dialog",
				fullScreen: true,
				destroyOnHide: true
			}).show();

		}

	});

})