define([
	"omega/_Widget",
	"omega/utils",
	"omega/dom/events",
	"omega/widgets/MenuItem",
	"jquery",
	"text!./templates/Menu.html"
], function(_Widget, utils, events, MenuItem, $, template) {

	return _Widget.extend({

		templateString: template,

		startup: function() {

			this.inherited(_Widget, arguments);

			this._domNode.find("> li").each(utils.bind(function(index, element) {

				element = $(element);

				// remove the old element
				element.detach();

				// add the new element
				var item = this.addItem(new MenuItem({ label: element.html(), icon: element.attr("data-icon"), dataItem: element.attr("data-item") })),
					attachedToWidget = element.data("attachedToWidget"),
					attachPoint = element.attr("data-attach-point");

				// carry over the attach points
				if (attachPoint && attachedToWidget)
					attachedToWidget._attachElement(item._domNode, attachPoint);

			}, this));

		},

		addItem: function(menuItem) {

			menuItem.startup();

			this._domNode.append(menuItem._domNode);

			menuItem.on("click", this._menuItemClick, this);
			menuItem.on("menuitemclick", this._menuItemClick, this);

			this._childWidgets.push(menuItem);

			return menuItem;
		},

		getItems: function() {

			return this._childWidgets;

		},

		eachItem: function(callback, scope) {

			this._childWidgets.some(callback, scope);

		},

		_menuItemClick: function(e) {

			var menuItem = e.menuItem;

			this.trigger("menuitemclick", { menuItem: menuItem, targetWidget: this.targetWidget });

		},

		clearItems: function() {

			this._childWidgets.forEach(function(item) {

				item.destroy();

			}, this);

			this._childWidgets = [];

		}

	}, "widgets.Menu");

});