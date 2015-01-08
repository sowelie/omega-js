define([
	"./_TreeViewAdapter",
	"./TreeViewNode",
	"../utils",
	"jquery"
], function(_TreeViewAdapter, TreeNode, utils, $) {
	
	return _TreeViewAdapter.extend({
		
		startup: function(node) {
			
			this.inherited(_TreeViewAdapter, arguments);
			
			this.rootNode = node;
			
			// find all of the list items in the treeview's DOM
			node._domNode.find("> li").each(utils.bind(function(index, element) {
				
				this._parseTreeNode($(element), node);
				node._domNode.find(".destroy").detach();
				
			}, this));
			
		},
		
		_parseTreeNode: function(element, parentNode) {
			
			element.addClass("destroy");
			
			var label = element.html();
			var labelNode = element.find("> label");
			
			// check to see if the element has a label
			if (labelNode.length > 0)
				label = labelNode.html();
			
			// check to see if the element has children
			var childList = element.find("> ul");
			
			// create the tree node
			var treeNode = new TreeNode({
				
				label: label,
				icon: element.attr("data-icon"),
				parentTreeNode: parentNode,
				rootNode: this.rootNode,
				adapter: this,
				hasChildren: childList.find("> li").length > 0,
				// mark the node as loaded, so it won't request a refresh
				loaded: true
				
			});
			
			// create the tree node's DOM
			treeNode.startup();
			
			if (childList.length > 0) {
				
				childList.find("> li").each(utils.bind(function(index, element) {
					
					this._parseTreeNode($(element), treeNode);
					
				}, this));
				
			}
			
			// replace the previous element with the new tree node
			parentNode.addNode(treeNode);
			
		}
		
	});
	
});