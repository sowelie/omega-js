define([
"omega/_Widget",
"omega/utils",
"jquery",
"omega/widgets/ListItem",
"text!./templates/ListView.html"
], function(_Widget, utils, $, ListItem, template) {

	return _Widget.extend({

		templateString: template,

		options: {

		},

		startup: function() {

			_Widget.prototype.startup.apply(this, arguments);

			// set up any list items
			var items = this._domNode.find("> li");

			items.each(utils.bind(function(index, element) {

				this.addItem({ content: $(element).html(), tag: $(element).attr("data-tag"), selected: $(element).attr("data-selected") });

				$(element).detach();

			}, this));

		},

		getSelectedItem: function() {

			return this._selectedItem;

		},

		setSelectedIndex: function(index) {

			this._deselect();

			var node = this._domNode.find("> li").get(index);

			if (node) {

				var element = $(node);

				var item = element.data("widget");
				item.setSelected(true);
				this._selectedItem = item;

				this.trigger("itemselected", { tag: item.tag, node: item._domNode });

			}

		},

		getSelectedIndex: function() {

			return this._domNode.find("> li.ui-selected").index();

		},

		getItemCount: function() {

			return this._childWidgets.length;

		},

		_deselect: function() {

			if (this._selectedItem)
				this._selectedItem.setSelected(false);

		},

		setSelectedItem: function(item) {

			this._deselect();

			if (item) {

				if (item.__typeName) {

					if (item.listView == this) {

						item.setSelected(true);
						this._selectedItem = item;

						this.trigger("itemselected", { tag: item.tag, node: item._domNode });

					}

				} else {

					// find the new item
					this._childWidgets.some(function(listItem) {

						if (listItem.tag == item) {

							this._deselect();
							listItem.setSelected(true);
							this._selectedItem = listItem;

							this.trigger("itemselected", { tag: listItem.tag, node: listItem._domNode });

						}

					}, this);

				}

			}

		},

		_itemClick: function(e) {

			var arg = utils.extend({ tag: e.targetWidget.tag, node: e.targetWidget._domNode }, e),
				selected = this._selectedItem;

			// deselect the currently selected item
			if (selected)
				selected.setSelected(false);

			// select the new item
			e.targetWidget.setSelected(true);

			this._selectedItem = e.targetWidget;

			this.trigger("itemselected", arg);

		},

		_itemMouseOver: function(e) {

			this.trigger("itemmouseover", e);

		},

		_itemMouseOut: function(e) {

			this.trigger("itemmouseout", e);

		},

		addItem: function(listItem) {

			var newItem = null;

			// check to see if the data being added is a widget
			if (listItem.__typeName) {

				listItem.listView = this;

				newItem = listItem;

			} else {

				newItem = new ListItem({ label: listItem.content, tag: listItem.tag, listView: this });

			}

			// attach to the click event
			newItem.on("click", this._itemClick, this);
			newItem.on("mouseover", this._itemMouseOver, this);
			newItem.on("mouseout", this._itemMouseOut, this);

			this.addChild(newItem);

			if (listItem.selected)
				this.setSelectedItem(newItem);

		},

		clearItems: function() {

			this._childWidgets.forEach(function(widget) {

				widget.destroy();

			});

			this._childWidgets = [];

		}

	});

});