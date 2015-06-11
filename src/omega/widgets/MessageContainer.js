define([
	"omega/_Widget",
	"text!./templates/MessageContainer.html"
], function(_Widget, template) {

	return _Widget.extend({

		templateString: template,

		addError: function(message, animate) {

			this._domNode.removeClass("alert-info");
			this._domNode.addClass("alert-danger");

			if (animate)
				this._domNode.fadeIn();
			else
				this._domNode.show();

			this._domNode.append("<p><span class=\"glyphicon glyphicon-exclamation-sign\" style=\"float: left; margin-right: .3em;\"></span>" + message + "</p>");

		},

		addErrors: function(errors, animate) {

			errors.forEach(function(message) {

				this.addError(message, animate);

			}, this);

		},

		addInfo: function(message, animate) {

			this._domNode.removeClass("alert-danger");
			this._domNode.addClass("alert-info");

			if (animate)
				this._domNode.fadeIn();
			else
				this._domNode.show();

			this._domNode.append("<p><span class=\"glyphicon glyphicon-info-sign\" style=\"float: left; margin-right: .3em;\"></span>" + message + "</p>");

		},

		clear: function() {

			this._domNode.removeClass("alert-danger");
			this._domNode.removeClass("alert-info");
			this._domNode.hide();
			this._domNode.empty();

		},

		hide: function() {

			this._domNode.fadeOut();

		}

	});

});