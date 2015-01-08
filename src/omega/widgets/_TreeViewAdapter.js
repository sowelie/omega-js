define([
	"omega/_Object"
], function(_Object) {

	return _Object.extend({

		startup: function(node) {

			this.wireEventsTo(node);
			this.rootNode = node;

		},

		setSelectedItem: function(item) {

			var foundNode = null;

			var findItem = function(item, parentNode) {

				// first check to see if the current node matches
				if (parentNode.dataItem == item) {

					foundNode = parentNode;
					return true;

				}

				var result = false;

				// now check children
				parentNode.children.some(function(childNode) {

					if (findItem(item, childNode)) {

						result = true;
						return true;

					}

					return false;

				});

				return result;

			};

			// if something was found, select it
			if (foundNode != null) {

				foundNode.setSelected(true);

			}

		},

		destroy: function() { },
		refresh: function(node, callback) { },
		getContextMenuItems: function(node, callback) { }

	});

});