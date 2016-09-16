define([
	"omega/_Widget",
	"omega/widgets/ContextMenu",
	"omega/dom/events",
	"omega/utils"
], function(_Widget, ContextMenu, events, utils) {

	var PADDING_PER_LEVEL = 20;

	return _Widget.extend({

		options: {
			depth: -1,
			storageId: ""
		},

		initialize: function() {

			this.inherited(_Widget, arguments);

			this.children = [];

		},

		addNode: function(node) {

			node.parentTreeNode = this;
			this.children.push(node);

			// check to see if a root node is specified, if not, this is the root node
			if (this.rootNode)
				node.rootNode = this.rootNode;
			else
				node.rootNode = this;

			// trigger startup if it hasn't been triggered already
			if (!node._domNode)
				node.startup();

			var updateDepth = function(children, depth) {

				children.forEach(function(childNode) {

					childNode.depth = depth;
					childNode._contentNode.css("margin-left", (PADDING_PER_LEVEL * childNode.depth) + "px");

					updateDepth(childNode.children, depth + 1);

				});

			};

			updateDepth(this.children, this.depth + 1);

			this._getContainerNode(node._domNode).append(node._domNode);

		},

		removeNode: function(node) {

			node.destroy();

			var index = this.children.indexOf(node);

			if (index >= 0)
				this.children.splice(index, 1);

		},

		clearNodes: function() {

			this.children.forEach(function(node) {

				node.destroy();

			}, this);

			this.children = [];

		},

		destroy: function() {

			this.inherited(_Widget, arguments);

			this.clearNodes();

			if (this._contextMenu)
				events.off(document, "click", this._contextDocumentClick, this);

		},

		expandAll: function() {
			this.children.forEach(function(node) {
				node.expand(function() {
					node.expandAll();
				});
			});
		},

		collapseAll: function() {
			this.children.forEach(function(node) {
				node.collapse();
				node.collapseAll();
			});
		},

		expand: function(callback) { },
		updateCheckedState: function() { },

		getCheckedChildren: function() {

			var result = [];

			this.children.forEach(function(node) {

				if (node.isChecked())
					result.push(node);

				result = result.concat(node.getCheckedChildren());

			}, this);

			return result;

		},

		_getContainerNode: function() {

			return this._containerNode;

		},

		_contextDocumentClick: function() {

			var menu = this._contextMenu;

			if (menu)
				menu.hide();

		},

		initContextMenu: function() {

			var menu = this._contextMenu;

			if (!menu) {

				menu = new ContextMenu();
				menu.startup();

				events.on(document, "click", this._contextDocumentClick, this);

			}

			this._contextMenu = menu;

			return menu;

		}

	});

});