define([
	"omega/widgets/BorderDialog",
	"text!./templates/AlertDialog.html",
	"omega/widgets/Button"
], function(Dialog, template) {

	return Dialog.extend({

		options: {

			title: "Alert...",
			message: "",
			width: 300,
			height: 120,
			sizable: false

		},

		initialize: function() {

			this.inherited(Dialog, arguments);

			this._mixinTemplateStrings.push(template);

		},

		startup: function() {

			this.inherited(Dialog, arguments);

			this._okayButtonNode.on("click", this.hide, this);

		}

	});

});