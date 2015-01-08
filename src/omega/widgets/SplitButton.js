define([
	"omega/_Widget",
	"jquery",
	"omega/widgets/Menu",
	"omega/widgets/MenuItem",
	"omega/utils",
	"omega/dom/events",
	"text!./templates/SplitButton.html",
	"omega/widgets/Button"
],
function(_Widget, $, Menu, MenuItem, utils, events, template) {

	return _Widget.extend({

		templateString: template,

		options: {

			displaySelectedItem: true

		},

		startup: function() {

			this.inherited(_Widget, arguments);

			var labelNode = this._containerNode.find("> span");

			if (labelNode.length > 0) {

				// set the label text
				this._labelNode.setLabel(labelNode.html());

				labelNode.detach();

			}

			this._labelNode._domNode.removeClass("ui-corner-all");
			this._labelNode._domNode.addClass("ui-corner-left");

			this._menuButtonNode._domNode.removeClass("ui-corner-all");
			this._menuButtonNode._domNode.addClass("ui-corner-right");

			// set up the icon
			if (this.icon)
				this._labelNode.setIcon(this.icon);

			// create a menu
			this._menuNode = new Menu();
			this._menuNode.startup();
			this._menuNode.on("menuitemclick", this._menuItemClick, this);

			// check to see if a list node exists
			var listNode = this._containerNode.find("> ul");

			if (listNode.length > 0) {

				// add items for each of the list items
				listNode.find("> li").each(utils.bind(function(index, element) {

					this.addItem(new MenuItem({ label: $(element).html(), tag: $(element).attr("data-tag") }));

				}, this));

				listNode.detach();

			}

			this._menuNode._domNode.appendTo(this._containerNode);

			this._menuButtonNode.on("click", this._iconClick, this);

			events.on(document, "click", this._documentClick, this);

			this._labelNode.on("click", function() {

				this.trigger("click");

			}, this);

		},

		addItem: function(menuItem) {

			this._menuNode.addItem(menuItem);

			// check to see if an item has already been added
			if (!this._selectedItem) {

				this._selectedItem = menuItem;
				this.setLabel(menuItem.label);

			}

			menuItem.on("click", function() {

				this.setSelectedItem(menuItem);
				this.hideMenu();

			}, this);

			return menuItem;

		},

		destroy: function() {

			this.inherited(_Widget, arguments);

			events.off(document, "click", this._documentClick, this);

		},

		clearItems: function() {

			this._menuNode.clearItems();

			this._selectedItem = null;

		},

		getLabel: function() {

			return this._labelNode.getLabel();

		},

		setLabel: function(label) {

			this._labelNode.setLabel(label);

		},

		isEnabled: function() {

			return this._labelNode.isEnabled();

		},

		setEnabled: function(value) {

			this._labelNode.setEnabled(value);
			this._menuButtonNode.setEnabled(value);

		},

		hideMenu: function() {

			this._containerNode.hide();

		},

		showMenu: function() {

			this._containerNode.show();

		},

		isActivated: function() {

			return this._labelNode.hasClass("ui-button-primary");

		},

		setActivated: function(value) {

			if (value) {

				this._labelNode.addClass("ui-button-primary");
				this._menuButtonNode.addClass("ui-button-primary");

			} else {

				this._labelNode.removeClass("ui-button-primary");
				this._menuButtonNode.removeClass("ui-button-primary");

			}

		},

		getSelectedItem: function() {

			return this._selectedItem;

		},

		setSelectedItem: function(item) {

			if (item.__typeName) {

				this._selectedItem = item;

				if (this.displaySelectedItem)
					this.setLabel(item.label);

			} else {

				this._menuNode.eachItem(function(menuItem) {

					if (menuItem.tag == item) {

						this._selectedItem = menuItem;

						if (this.displaySelectedItem)
							this.setLabel(menuItem.label);

					}

				}, this);

			}

			this.trigger("selectitem", { menuItem: this._selectedItem });

		},

		getSelectedIndex: function() {

			var result = -1;

			this._menuNode.eachItem(function(menuItem, index) {

				if (menuItem == this._selectedItem) {

					result = index;
					return true;

				}

			}, this);

			return result;

		},

		setSelectedIndex: function(index) {

			var items = this._menuNode.getItems();

			if (index < items.length && index >= 0) {

				this.setSelectedItem(items[index]);

			}

		},

		getItems: function() {

			return this._menuNode.getItems();

		},

		_documentClick: function() {

			this.hideMenu();

		},

		_iconClick: function(e) {

			e.preventDefault();

			if (this.isEnabled()) {

				if (this._containerNode.is(":visible"))
					this.hideMenu();
				else
					this.showMenu();

			}

			return false;

		},

		_menuItemClick: function(e) {

			this._selectedItem = e.menuItem;

		}

	}, "widgets.SplitButton");

});