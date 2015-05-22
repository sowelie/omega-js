define([
	"omega/_Widget",
	"omega/dom/events",
	"omega/utils",
	"text!./templates/ListItem.html"
], function(_Widget, events, utils, template) {

	return _Widget.extend({

		templateString: template,

		startup: function() {

			this.inherited(_Widget, arguments);

			events.on(this._domNode, "click", this._click, this);
			events.on(this._domNode, "mouseover", this._mouseOver, this);
			events.on(this._domNode, "mouseout", this._mouseOut, this);

		},

		destroy: function() {

			events.off(this._domNode, "click", this._click, this);
			events.off(this._domNode, "mouseover", this._mouseOver, this);
			events.off(this._domNode, "mouseout", this._mouseOut, this);

			this.inherited(_Widget, arguments);

		},

		setSelected: function(value) {

			if (value) {

				this._domNode.addClass("active");

			} else {

				this._domNode.removeClass("active");

			}

		},

		_click: function(e) {

			var arg = utils.extend({}, e, { targetWidget: this });

			this.trigger("click", arg);

		},

		_mouseOver: function(e) {

			var arg = utils.extend({}, e, { targetWidget: this });

			this.trigger("mouseover", arg);

		},

		_mouseOut: function(e) {

			var arg = utils.extend({}, e, { targetWidget: this });

			this.trigger("mouseout", arg);

		}

	}, "widgets.ListItem");

}, this);