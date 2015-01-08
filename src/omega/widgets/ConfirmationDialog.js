define([
	"omega/widgets/Dialog",
	"text!./templates/ConfirmationDialog.html",
	"omega/widgets/Confirmation"
], function(Dialog, template) {

	return Dialog.extend({

		options: {

			title: "Confirm...",
			message: "Are you sure you want to do that?",
			width: 300,
			height: "auto",
			sizable: false,
			closable: false

		},

		initialize: function() {

			this.inherited(Dialog, arguments);

			this._mixinTemplateStrings.push(template);

		},

		startup: function() {

			this.inherited(Dialog, arguments);

			this._confirmationNode.setMessage(this.message);
			this._confirmationNode.on("confirm", this.hide, this);
			this._confirmationNode.on("cancel", this.hide, this);

			this.wireEventsTo(this._confirmationNode);

		}

	});

});