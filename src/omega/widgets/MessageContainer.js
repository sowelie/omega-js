define([
	"omega/_Widget",
	"text!./templates/MessageContainer.html"
], function(_Widget, template) {

	return _Widget.extend({

		templateString: template,

		addError: function(message, animate) {

			this._domNode.removeClass("ui-state-highlight");

			this._domNode.addClass("ui-state-error");

			if (animate)
				this._domNode.fadeIn();
			else
				this._domNode.show();

			this._domNode.append("<p><span class=\"ui-icon ui-icon-alert\" style=\"float: left; margin-right: .3em;\"></span>" + message + "</p>");

		},

		addErrors: function(errors, animate) {

			errors.forEach(function(message) {

				this.addError(message, animate);

			}, this);

		},

		addInfo: function(message, animate) {

			this._domNode.removeClass("ui-state-error");

			this._domNode.addClass("ui-state-highlight");

			if (animate)
				this._domNode.fadeIn();
			else
				this._domNode.show();

			this._domNode.append("<p><span class=\"ui-icon ui-icon-info\" style=\"float: left; margin-right: .3em;\"></span>" + message + "</p>");

		},

		clear: function() {

			this._domNode.removeClass("ui-state-error");
			this._domNode.removeClass("ui-state-highlight");
			this._domNode.hide();
			this._domNode.empty();

		},

		hide: function() {

			this._domNode.fadeOut();

		}

	});

});