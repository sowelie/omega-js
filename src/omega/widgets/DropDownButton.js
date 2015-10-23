define([
	"omega/widgets/Button",
	"jquery",
	"omega/utils",
	"omega/dom/events",
	"text!./templates/DropDownButton.html"
], function(Button, $, utils, events, template) {

	return Button.extend({

		templateString: template,

		initialize: function() {
			this.inherited(Button, arguments);
		},

		startup: function() {
			this.inherited(Button, arguments);

			var labelNode = this._containerNode.find("> span");

			// set the label text
			if (labelNode.length > 0) {
				this._labelNode.html(labelNode.html());

				labelNode.detach();
			}

			// add a class if there is no text
			if (!this._labelNode.html().trim()) {

				this._domNode.addClass("btn-icon-only");
				this._domNode.removeClass("btn-icon-" + this.iconPosition);

				// icon position
			} else {

				this._domNode.removeClass("btn-icon-only");

				if (this.icon && this.iconPosition) {

					this._domNode.addClass("btn-icon-" + this.iconPosition);

				}
			}

			// wire up the document click
			events.on(document, "click", this._documentClick, this);

		},

		destroy: function() {

			this.inherited(Button, arguments);

			events.off(document, "click", this._documentClick, this);

		},

		setLabel: function(label) {
            console.log(this);

			this._labelNode.html(label);

			this._domNode.removeClass("btn-icon-only");
		},

		_documentClick: function(e) {

			var matches = false;

			this.log(e.target);

			$(e.target).parents().each(utils.bind(function(index, element) {

				if (element == this._containerNode.get(0)) {
					matches = true;
					this.log("FOUND CONTAINER");
				}

				if (element == this._domNode.get(0))
					matches = true;

			}, this));

			if (matches || e.target == this._domNode.get(0))
				return;

			this.log("HIDING MENU");

			this.hideMenu();

		},

		_onClick: function(e) {
			if (!this.isEnabled()) {
				e.preventDefault();
				return false;
			}

			e.targetWidget = this;

			if (this._containerNode.is(":visible"))
				this.hideMenu();
			else
				this.showMenu();

			this.trigger("click", e);
		},

		hideMenu: function() {
			this._containerNode.hide();
		},

		showMenu: function() {
			this._containerNode.show();
		}

	});

});