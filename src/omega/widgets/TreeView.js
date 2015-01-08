define([
	"omega/widgets/DOMTreeViewAdapter",
	"omega/_Widget",
	"omega/utils",
	"omega/dom/parser",
	"omega/widgets/_BaseTreeViewNode",
	"text!./templates/TreeView.html"
], function(DOMAdapter, _Widget, utils, parser, TreeViewNode, template) {

	return TreeViewNode.extend({

		templateString: template,

		startup: function() {

			this.inherited(TreeViewNode, arguments);

			// default to the DOM Adapter, which uses the contents of the DOM node
			if (!this.adapter)
				this.adapter = new DOMAdapter();

			// start up the adapter, which will add tree nodes
			this.adapter.startup(this, utils.bind(this._checkForExpandAll, this));

		},

		refresh: function(node, callback) {

			this.adapter.refresh(node, callback);

		},

		setAdapter: function(adapter) {

			// destroy the old adapter
			if (this.adapter)
				this.adapter.destroy();

			this.adapter = adapter;

			// make sure and clean up any nodes left by the old adapter
			this.clearNodes();

			// trigger the new adapter
			adapter.startup(this);

		},

		expandAll: function() {

			if (this.loaded)
				this.inherited(TreeViewNode, arguments);
			else
				this._callExpandAll = true;

		},

		getSelectedNode: function() {

			var element = this._domNode.find(".ui-state-focus");

			if (element)
				return parser.get(element.parent());
			else
				return null;

		},

		setSelectedItem: function(item) {

			if (this.adapter) {

				this.adapter.setSelectedItem(item);

			}

		},

		_getContainerNode: function(domNode) {

			return this._domNode;

		},

		_checkForExpandAll: function() {

			this.loaded = true;

			if (this._callExpandAll) {
				this._callExpandAll = false;
				this.expandAll();
			}

		},

		_initNode: function() { }

	});

});