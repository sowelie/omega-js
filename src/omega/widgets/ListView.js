define([
    "omega/_Widget",
    "omega/utils",
    "jquery",
    "omega/widgets/ListItem",
    "omega/dom/DNDManager",
    "text!./templates/ListView.html"
], function(_Widget, utils, $, ListItem, DNDManager, template) {

	return _Widget.extend({

		templateString: template,

		options: {

		},

		startup: function() {

			_Widget.prototype.startup.apply(this, arguments);

			// set up any list items
			var items = this._domNode.find("> li");

            // check to see if the items can be reordered using drag and drop
            if (this.reorderItems) {
                this._dragManager = new DNDManager();
                this._dragManager.on("dragstart", this._dragStart, this);
                this._dragManager.on("dragend", this._dragEnd, this);
                this._dragManager.on("dragover", this._dragOver, this);
                this._dragManager.on("dragout", this._dragOut, this);
            }

			items.each(utils.bind(function(index, element) {

				this.addItem({ content: $(element).html(), tag: $(element).attr("data-tag"), selected: $(element).attr("data-selected") });

				$(element).detach();

                this._registerDragElement(element);

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
            this._registerDragElement(newItem._domNode);

			if (listItem.selected)
				this.setSelectedItem(newItem);

		},

		clearItems: function() {

			this._childWidgets.forEach(function(widget) {

				widget.destroy();

			});

			this._childWidgets = [];

		},

        _registerDragElement: function(element) {

            // if DND is enabled, register the element as both a source and a target
            if (this._dragManager) {
                this._dragManager.registerSourceElement(element);
                this._dragManager.registerTargetElement(element);
            }

        },

        _dragStart: function(e) {
            e.container.html(e.element.html());
        },

        _dragOver: function(e) {
            var mousePosition = e.position,
                elementNode = e.element,
                targetNode = e.target,
                targetPosition = e.target.offset(),
                verticalDiffBottom = targetPosition.top + e.target.outerHeight() - mousePosition.y,
                verticalDiffTop = mousePosition.y - targetPosition.top;

            // clear all classes
            e.target.removeClass("ui-dragtarget-above ui-dragtarget-below");

            if (verticalDiffTop < 5) {
                targetNode.addClass("ui-dragtarget-above");
            } else if (verticalDiffBottom < 5) {
                targetNode.addClass("ui-dragtarget-below");
            }
        },

        _dragOut: function(e) {
            e.target.removeClass("ui-dragtarget-above ui-dragtarget-below");
        },

        _dragEnd: function(e) {
            var targetElement = e.target,
                sourceElement = e.element,
                sourceWidget = sourceElement.data("widget"),
                newIndex = targetElement.index(),
                oldIndex = sourceElement.index();

            // if the element is going below the target, add one to the new index
            if (targetElement.hasClass("ui-dragtarget-below")) {
                newIndex++;
                targetElement.after(sourceElement);
            } else {
                targetElement.before(sourceElement);
            }

            this.log("MOVE", sourceElement, targetElement, oldIndex, newIndex);

            e.target.removeClass("ui-dragtarget-above ui-dragtarget-below");

            this.trigger("moveitem", {
                item: sourceWidget,
                fromIndex: oldIndex,
                toIndex: newIndex
            });
        }

	});

});