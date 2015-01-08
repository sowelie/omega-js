define([
	"omega/_Widget",
	"omega/dom/events"
], function(_Widget, events) {

	return _Widget.extend({

		startup: function() {

			this.inherited(_Widget, arguments);

			events.on(this._headerNode, "click", this._headerClick, this);

		},

		destroy: function() {

			this.inherited(_Widget, arguments);

			if (this._headerNode) {

				this._headerNode.detach();

			}

		},

		show: function() {

			this.inherited(_Widget, arguments);

			this._headerNode.addClass("ui-tabs-active ui-state-active");
			this.trigger("show", this);

		},

		setTitle: function(title) {

			this._headerNode.find("a").html(title);

		},

		_headerClick: function() {

			this.trigger("click", this);
			this.show();

		}

	}, "widgets.Tab");

});