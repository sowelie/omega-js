define([
	"omega/widgets/_Label",
	"omega/dom/events",
	"omega/utils",
	"text!./templates/Button.html"
], function(_Label, events, utils, template) {

	return _Label.extend({

		templateString: template,

		options: {
			iconPosition: "left",
			inline: true
		},

		startup: function() {

			_Label.prototype.startup.apply(this, arguments);

			this.setIcon(this.icon);
			this.setLabel(this.label || this._containerNode.html());

			this._domNode.addClass("btn-up");

			if (this.inline)
				this._domNode.addClass("btn-inline");

			if (typeof(this.enabled) != "undefined")
				this.setEnabled(this.enabled);

			events.on(this._domNode, "click", this._onClick, this);
			events.on(this._domNode, "mousedown", this._onMouseDown, this);
			events.on(this._domNode, "mouseup", this._onMouseUp, this);
			events.on(this._domNode, "touchstart", this._onMouseDown, this);
			events.on(this._domNode, "touchend", this._onTouchEnd, this);
			events.on(this._domNode, "touchcancel", this._onTouchEnd, this);

			// use jquery's hover event explicitly
			this._domNode.hover(utils.bind(this._onHoverIn, this), utils.bind(this._onHoverOut, this));

		},

		destroy: function() {

			this.inherited(_Label, arguments);

			events.off(this._domNode, "click", this._onClick, this);
			events.off(this._domNode, "mousedown", this._onMouseDown, this);
			events.off(this._domNode, "mouseup", this._onMouseUp, this);
			events.off(this._domNode, "touchstart", this._onMouseDown, this);
			events.off(this._domNode, "touchend", this._onTouchEnd, this);
			events.off(this._domNode, "touchcancel", this._onTouchEnd, this);

		},

		getAction: function() {
			return this._action;
		},

		setAction: function(action) {
			this._action = action;
		},

		getIcon: function() {
			return this.icon;
		},

		setIcon: function(icon) {

			if (this.icon)
				this._iconNode.removeClass(this.icon);

			this.icon = icon;

			if (icon) {
				if (this.iconPosition)
					this._domNode.addClass("btn-icon-" + this.iconPosition);

				this._iconNode.addClass(icon);
				this._domNode.removeClass("btn-text-only");
			} else {
				this._domNode.addClass("btn-text-only");
			}
		},

		getLabel: function() {
			return this._containerNode.html();
		},

		setLabel: function(label) {

			if (label) {
				this._domNode.removeClass("btn-icon-notext");
				this._domNode.removeClass("btn-icon-only");
			} else {
				this._domNode.addClass("btn-icon-notext");
				this._domNode.addClass("btn-icon-only");
			}

			this._containerNode.html(label);
		},

		isEnabled: function() {
			return !this._domNode.attr("disabled");
		},

		setEnabled: function(value) {

			this._domNode.attr("disabled", value ? null : "disabled");
		},

		setActivated: function(value) {

			if (value)
				this._domNode.addClass("btn-primary");
			else
				this._domNode.removeClass("btn-primary");

		},

		setOptions: function(options) {

			var className = this._domNode.attr("class"),
				state = options.stateName,
				label = options.label,
				timeout = options.timeout,
				enabled = options.enabled;

			if (timeout) {

				var button = this;

				options.timeout = null;

				setTimeout(function() {

					button.setOptions(options);

				}, timeout);

			} else {

				className.split(" ").forEach(function(clazz) {

					if (clazz.indexOf("btn-state-custom") == 0) {

						this._domNode.removeClass(clazz);

					}

				}, this);

				if (state) {

					this._domNode.addClass("btn-state-custom-" + state);

				}

				if (typeof(enabled) != "undefined") {

					this.setEnabled(enabled);

				}

				if (label)
					this.setLabel(label);

			}

		},

		_onMouseDown: function() {

			if (!this._domNode.attr("disabled"))
				this._domNode.addClass("btn-state-down");

		},

		_onMouseUp: function() {

			this._domNode.removeClass("btn-state-down");

		},

		_onTouchEnd: function() {

			this._domNode.removeClass("btn-state-down");
			this._domNode.removeClass("btn-hover");

		},

		_onHoverIn: function() {

			if (!this._domNode.attr("disabled"))
				this._domNode.addClass("btn-hover");
		},

		_onHoverOut: function() {

			this._domNode.removeClass("btn-hover");
			this._domNode.removeClass("btn-state-down");

		},

		_onClick: function(e) {

			e.preventDefault();

			if (this._domNode.attr("disabled"))
				return false;

			e.targetWidget = this;

			this.trigger("click", e);

			return false;

		}

	}, "widgets.Button");

});