define([
	"omega/_Widget",
	"omega/utils",
	"omega/dom/events",
	"jquery",
	"text!./templates/MenuItem.html"
], function(_Widget, utils, events, $, template) {

	return _Widget.extend({

		templateString: template,

		startup: function() {

			this.inherited(_Widget, arguments);

			events.on(this._domNode, "mouseenter", this._mouseEnter, this);
			events.on(this._domNode, "mouseleave", this._mouseLeave, this);
			events.on(this._containerNode, "click", this._click, this);

			if (this.label)
				this.setLabel(this.label);

			if (this.icon)
				this.setIcon(this.icon);

		},

		destroy: function() {

			this.inherited(_Widget, arguments);

			events.off(this._domNode, "mouseenter", this._mouseEnter, this);
			events.off(this._domNode, "mouseleave", this._mouseLeave, this);
			events.off(this._containerNode, "click", this._click, this);

		},

		getLabel: function() {

			return this._containerNode.html();

		},

		setLabel: function(label) {

			this._containerNode.html(label);

		},

		setIcon: function(icon) {

			var node = this._containerNode.find("ui-icon");

			// destroy the former icon node
			if (node.length > 0)
				node.detach();

			// create the new icon node
			node = $("<span />").appendTo(this._containerNode).addClass("ui-icon");
			node.addClass(icon);

		},

		addItem: function(menuItem) {

			var menu = this._menuNode;

			if (menu == null) {

				// TODO: circular reference...
				var Menu = require("omega/widgets/Menu");

				this._menuNode = menu = new Menu();
				menu.startup();
				menu.hide();
				menu.on("menuitemclick", function(e) { this.trigger("menuitemclick", e); }, this);

				this._domNode.append(menu._domNode);
				this.addChild(menu);

				this._domNode.prepend("<span class=\"ui-menu-icon ui-icon ui-icon-carat-1-e\"></span>");

			}

			menu.addItem(menuItem);

			return menuItem;

		},

		clearItems: function() {

			if (this._menuNode)
				this._menuNode.clearItems();

		},

		_mouseEnter: function() {

			this._containerNode.addClass("ui-state-focus");

			if (this._menuNode) {
				this._menuNode.show();
				this._menuNode.css("left", this._domNode.width());
				this._menuNode.css("top", 0);
			}

		},

		_mouseLeave: function() {

			this._containerNode.removeClass("ui-state-focus");

			if (this._menuNode)
				this._menuNode.hide();

		},

		_click: function(e) {

			var newArgs = utils.extend({ }, e, { menuItem: this });

			this.trigger("click", newArgs);

		}

	}, "widgets.MenuItem");

});