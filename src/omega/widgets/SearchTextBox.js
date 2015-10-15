define([
    "omega/_Widget",
	"omega/widgets/TextBox",
	"jquery",
	"omega/dom/events",
	"omega/utils"
], function(_Widget, TextBox, $, events, utils) {

	return TextBox.extend({

		options: {

			placeholder: "Search"

		},

		startup: function() {

			this._domNode.addClass("search-textbox form-control");

			this._clearNode = $("<span />").addClass("clear glyphicon glyphicon-remove").appendTo(this._domNode);
			this._textNode.removeClass("form-control");
			this._searchIconNode = $("<span />").addClass("glyphicon glyphicon-search").appendTo(this._domNode);

			events.on(this._clearNode, "click", this._clearClick, this);
			this.on("keyup", this._searchKeyUp, this);

		},

		on: function(event) {

			// intercept the search event
			if (event == "search")
				_Widget.prototype.on.apply(this, arguments);
			else
				TextBox.prototype.on.apply(this, arguments);

		},

		_clearClick: function() {

			this.clear();
			this.trigger("search");

		},

		destroy: function() {

			events.off(this._clearNode, "click", this._clearClick);

		},

		_searchKeyUp: function() {

			clearTimeout(this._searchTimeoutHandle);

			if (this.getValue())
				this._clearNode.show();
			else
				this._clearNode.hide();

			this._searchTimeoutHandle = setTimeout(utils.bind(function() {

				this.trigger("search");

			}, this), 250);

		}

	});

});