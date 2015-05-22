define([
	"omega/widgets/_BaseTreeViewNode",
	"omega/widgets/CheckBox",
	"omega/widgets/MenuItem",
	"omega/dom/events",
	"omega/dom/storage",
	"omega/utils",
	"text!./templates/TreeViewNode.html",
	"omega/widgets/Menu"
], function(_BaseTreeViewNode, CheckBox, MenuItem, events, storage, utils, template) {

	var PADDING_PER_LEVEL = 20;

	return _BaseTreeViewNode.extend({

		templateString: template,

		startup: function() {

			this.inherited(_BaseTreeViewNode, arguments);

			// set the label
			this._labelNode.html(this.label);

			if (!this.icon && this.rootNode.defaultIcon)
				this.icon = this.rootNode.defaultIcon;

			// set up the icon
			if (this.icon) {
				this._secondaryIconNode.addClass(this.icon);
				this._domNode.addClass("has-icon");
			} else
				this._secondaryIconNode.hide();

			if (this.hasChildren === false)
				this._domNode.addClass("no-children");

			// check to see if the node should be expanded
			if (this._getPersistentState() && !this.isOpen())
				this._expandClick();

			// make the text of the node not selectable
			this._labelNode.attr("unselectable", "on")
				.css("user-select", "none")
				.on("selectstart", false);

			// check to see if checkboxes should be enabled
			if (this.rootNode.checkBoxes) {

				this._domNode.addClass("treeview-node-checkbox");

				var checkbox = new CheckBox({ name: "treeview" });
				checkbox.startup();
				this._primaryIconNode.after(checkbox._domNode);
				this._checkBoxNode = checkbox;
				checkbox.on("click", this._checkboxClick, this);

				if (this.checked)
					checkbox.setChecked(true, true, false);

			}

			events.on(this._primaryIconNode, "click", this._expandClick, this);
			events.on(this._domNode, "click", this._click, this);
			events.on(this._domNode, "contextmenu", this._contextMenuOpen, this);

		},

		destroy: function() {

			this.inherited(_BaseTreeViewNode, arguments);

			events.off(this._primaryIconNode, "click", this._expandClick, this);
			events.off(this._domNode, "click", this._click, this);
			events.off(this._domNode, "contextmenu", this._contextMenuOpen, this);

		},

		addNode: function(node) {

			this.inherited(_BaseTreeViewNode, arguments);

			this.updateCheckedState(false);

		},

		isChecked: function() {

			if (this._checkBoxNode)
				return this._checkBoxNode.isChecked();
			else
				return false;

		},

		setChecked: function(value, updateChildren, triggerEvents) {

			if (typeof(updateChildren) == "undefined")
				updateChildren = true;

			if (this._checkBoxNode)
				this._checkBoxNode.setChecked(value);

			if (updateChildren) {
				this._checkChildCheckBoxes();
			}

			if (this.adapter && (typeof(triggerEvents) == "undefined" || triggerEvents))
				this.adapter.trigger("nodecheckchange", this);

		},

		setIndeterminate: function(value) {

			if (this._checkBoxNode)
				this._checkBoxNode.setIndeterminate(value);

		},

		_checkboxClick: function(e) {

			e.stopPropagation();

			this._checkChildCheckBoxes();

			this._click(e, true);

			if (this.adapter)
				this.adapter.trigger("nodecheckchange", this);

		},

		updateCheckedState: function(triggerEvents) {

			var checked = true,
				hasChecked = false;

			// check all of the children
			this.children.forEach(function(node) {

				if (node.isChecked())
					hasChecked = true;
				else
					checked = false;

			}, this);

			if (hasChecked && !checked)
				this.setIndeterminate(true);
			else {
				this.setIndeterminate(false);
				this.setChecked(checked, false, triggerEvents);
			}

		},

		isOpen: function() {

			return this._domNode.hasClass("treeview-node-open");

		},

		toggle: function() {

			if (this.isOpen()) {

				this.collapse();

			} else {

				this.expand();

			}

		},

		_updateExpandState: function(expand) {

			if (expand) {
				this._updatePersistentState(true);

				this._domNode.addClass("treeview-node-open");
				this._primaryIconNode.removeClass("icon-loading");
				this._primaryIconNode.addClass("glyphicon-chevron-down");
				this._primaryIconNode.removeClass("glyphicon-chevron-right");

			} else {
				this._updatePersistentState(false);

				this._domNode.removeClass("treeview-node-open");
				this._primaryIconNode.removeClass("icon-loading");
				this._primaryIconNode.removeClass("glyphicon-chevron-down");
				this._primaryIconNode.addClass("glyphicon-chevron-right");
			}

		},

		_checkChildCheckBoxes: function() {


			if (this._checkBoxNode) {

				// check all of the children
				this.children.forEach(function(node) {

					node.setChecked(this._checkBoxNode.isChecked());

				}, this);

			}

		},

		_contextMenuOpen: function(e) {

			this._click();
			this._contextMenuEvent = e;

			if (this.adapter)
				this.adapter.getContextMenuItems(this, utils.bind(this._buildContextMenu, this));

			e.preventDefault();
			return false;

		},

		_buildContextMenu: function(items) {

			var menu = this.rootNode.initContextMenu(),
				e = this._contextMenuEvent;

			menu.clearItems();

			items.forEach(function(item) {

				this._addContextMenuItem(menu, item);

			}, this);

			if (items.length > 0)
				menu.show(e.clientX, e.clientY);

		},

		_addContextMenuItem: function(menu, item) {

			var clickHandler = item.clickHandler,
				menuItem = new MenuItem({ label: item.label, icon: item.icon });

			menuItem._targetNode = this;

			menu.addItem(menuItem);

			if (clickHandler)
				menuItem.on("click", clickHandler, item.clickScope);

			if (item.children) {

				item.children.forEach(function(childItem) {

					this._addContextMenuItem(menuItem, childItem);

				}, this);

			}

		},

		_updatePersistentState: function(open) {

			if (!this.rootNode.storageId)
				return;

			var storageName = "treeview_" + this.rootNode.storageId + "_" + this._getUniqueName();

			storage(storageName, open);

		},

		_getPersistentState: function() {

			if (!this.rootNode.storageId)
				return false;

			var storageName = "treeview_" + this.rootNode.storageId + "_" + this._getUniqueName();

			return storage(storageName);

		},

		_getUniqueName: function() {

			var parentNode = this.parentNode,
				uniqueName = this.label.replace(/\s+/g, "_");

			while (parentNode != null) {
				uniqueName += "_" + parentNode.name.replace(/\s+/g, "_");
				parentNode = parentNode.parentNode;
			}

			return uniqueName;

		},

		expand: function(userCallback) {

			var callback = utils.bind(function() {

				this.loaded = true;
				this._updateExpandState(true);

				if (this.adapter)
					this.adapter.trigger("nodeexpand", this);

				this.trigger("expand");

				if (userCallback)
					userCallback();

			}, this);

			// show the loading icon
			this._primaryIconNode.removeClass("glyphicon-chevron-down");
			this._primaryIconNode.removeClass("glyphicon-chevron-right");
			this._primaryIconNode.addClass("icon-loading");

			// check to see if the tree node has been loaded
			if (this.loaded)
				callback();
			else if (this.adapter)
				this.adapter.refresh(this, callback);

		},

		collapse: function() {

			this._updateExpandState(false);

		},

		_expandClick: function(e) {

			this.toggle();

			if (e)
				e.preventDefault();

			return false;

		},

		_click: function(e, checkBox) {

			var checked = !this.isChecked();

			if (e && !checkBox)
				e.stopImmediatePropagation();

			if (!checkBox)
				this.setChecked(checked);

			if (this.parentTreeNode)
				this.parentTreeNode.updateCheckedState();

			this.setSelected(true);
			this.trigger("click");

			if (this.adapter)
				this.adapter.trigger("nodeclick", this);
			else if (this.rootNode)
				this.rootNode.trigger("nodeclick", this);

			var menu = this.rootNode.initContextMenu();

			if (menu)
				menu.hide();

			return false;

		},

		setSelected: function(selected) {

			this.rootNode._domNode.find(".active").removeClass("active");

			if (selected) {

				this._wrapperNode.addClass("active");

				// store the selected item
				this.rootNode.selectedItem = this.dataItem;
			}

		},

		refresh: function(userCallback) {

			this.loaded = false;
			this.expand(userCallback);

		}

	});

});