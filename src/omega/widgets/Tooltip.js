define([
	"omega/_Widget",
	"omega/dom/events",
    "jquery",
	"text!./templates/Tooltip.html"
], function(_Widget, events, $, template) {

	return _Widget.extend({

		templateString: template,
		options: {
			position: "bottom",
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

				// set the class based on the position property
				this._domNode.addClass(this.position);

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
			node.addClass("popover-anchor");

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

			node.removeClass("popover-anchor");

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

			this.show();

			// if the attachment was found, update the content
			if (targetAttachment != null) {

				var node = targetAttachment.node;

				if (targetAttachment.content) {

					// if the content is a function, call it
					if (typeof(targetAttachment.content) == "function") {

						targetAttachment.content(this);

					} else if (targetAttachment.content) {

						this._containerNode.html(targetAttachment.content);

					}

				}

				// position the tooltip
				this._position(node);

			}

			e.stopPropagation();

			return false;

		},

		_hide: function(e) {

			if ((e.toElement && $(e.toElement).parents(".popover").length == 0)
				&& $(e.target).parents(".popover").length == 0) {

				this.hide();

			}

		},

		_position: function(node) {

			var top = node.offset().top,
				left = node.offset().left;

			if (this.position == "bottom") {

				top += node.outerHeight();
				left -= (this._domNode.outerWidth() - node.outerWidth()) / 2;

			} else if (this.position == "top") {

				top -= this._domNode.outerHeight();
				left -= (this._domNode.outerWidth() - node.outerWidth()) / 2;

			} else if (this.position == "left") {

				top -= (this._domNode.outerHeight() - node.outerHeight()) / 2;
				left -= this._domNode.outerWidth();

			} else if (this.position = "right") {

				top -= (this._domNode.outerHeight() - node.outerHeight()) / 2;
				left += node.outerWidth();

			}

			this._domNode.css("top", top);
			this._domNode.css("left", left);

		}

	}, "omega.widgets.Tooltip");

});