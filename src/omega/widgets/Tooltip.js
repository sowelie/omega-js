define([
	"omega/_Widget",
	"omega/dom/events",
	"text!./templates/Tooltip.html"
], function(_Widget, events, template) {

	return _Widget.extend({

		templateString: template,
		options: {
			arrowPosition: "south",
			text: ""
		},

		initialize: function() {

			this.inherited(_Widget, arguments);

			this._attachedNodes = [];

		},

		startup: function() {

			if (!this._hasStarted) {

				this.inherited(_Widget, arguments);

				// hide the tooltip initially
				this.hide();

				events.on(document, "click", this._hide, this);
				events.on(this._domNode, "mouseleave", this.hide, this);

				// set the class based on the arrowPosition property
				this._domNode.addClass("ui-tooltip-arrow-" + this.arrowPosition);

			}

		},

		destroy: function() {

			// detach all of the attached widgets
			this._attachedNodes.forEach(function(attachedNode) {

				this._detach(attachedNode);

			}, this);

			this._attachedNodes = [];

			events.off(document, "click", this._hide, this);
			events.off(this._domNode, "mouseleave", this.hide, this);

			this.inherited(_Widget, arguments);

		},

		attachTo: function(node, hover, content) {

			// make sure the node is a jquery object
			if (node.__typeName) {

				node = node._domNode;

			} else if (!node.jQuery) {

				node = $(node);

			}

			// mark the node as a tooltip anchor
			node.addClass("ui-tooltip-anchor");

			// default hover to true
			if (typeof(hover) == "undefined") {

				hover = true;

			}

			this.startup();

			// add to the body
			$(document.body).append(this._domNode);

			// attach to the node's event depending on the hover param
			events.on(node, hover ? "mouseenter" : "click", this._show, this);

			if (hover) {

				events.on(node, "mouseleave", this._hide, this);

			}

			this._attachedNodes.push({ node: node, hover: hover, content: content });

		},

		detachFrom: function(node) {

			// make sure the node is a jquery object
			if (node.__typeName) {

				node = node._domNode;

			} else if (!node.jQuery) {

				node = $(node);

			}

			node.removeClass("ui-tooltip-anchor");

			this._attachedNodes.some(function(attachedNode, index) {

				if (attachedNode.node[0] == node) {

					this._detach(attachedNode);
					this._attachedNodes.splice(index, 1);

					return true;

				}

				return false;

			}, this);

		},

		_detach: function(attachedNode) {

			events.off(attachedNode.node, attachedNode.hover ? "mouseenter" : "click", this._show, this);

			if (attachedNode.hover) {

				events.off(attachedNode.node, "mouseleave", this._hide, this);

			}

		},

		_show: function(e) {

			var targetAttachment = null;

			// try and find the attached node
			this._attachedNodes.some(function(attachedNode) {

				if (attachedNode.node[0] == e.currentTarget) {

					targetAttachment = attachedNode;
					return true;

				}

				return false;

			}, this);

			this._containerNode.empty();
			this.show();

			// if the attachment was found, update the content
			if (targetAttachment != null) {

				var node = targetAttachment.node;

				if (targetAttachment.content) {

					// if the content is a function, call it
					if (typeof(targetAttachment.content) == "function") {

						targetAttachment.content(this);

					} else {

						this._containerNode.html(targetAttachment.content);

					}

				}

				// position the tooltip
				this._position(node);

			}

		},

		_hide: function(e) {

			if ((e.toElement && $(e.toElement).parents(".ui-tooltip").length == 0)
				&& $(e.target).parents(".ui-tooltip").length == 0) {

				this.hide();

			}

		},

		_position: function(node) {

			var top = node.offset().top,
				left = node.offset().left;

			if (this.arrowPosition == "north") {

				top += node.outerHeight();
				left -= (this._domNode.outerWidth() - node.outerWidth()) / 2;

			} else if (this.arrowPosition == "south") {

				top -= this._domNode.outerHeight();
				left -= (this._domNode.outerWidth() - node.outerWidth()) / 2;

			} else if (this.arrowPosition == "east") {

				top -= (this._domNode.outerHeight() - node.outerHeight()) / 2;
				left -= this._domNode.outerWidth();

			} else if (this.arrowPosition = "west") {

				top -= (this._domNode.outerHeight() - node.outerHeight()) / 2;
				left += node.outerWidth();

			}

			this._domNode.css("top", top);
			this._domNode.css("left", left);

		}

	}, "omega.widgets.Tooltip");

});