define([
	"omega/dom/events",
	"omega/_Object"
], function(events, _Object) {

	return _Object.extend({

		initialize: function(options) {

			this.inherited(_Object, arguments);

			this._dragging = false;
			this.domNode = options.domNode;
			this.targetNode = options.targetNode;
			this.initDomNode();

		},

		initDomNode: function() {

			var node = this.domNode;
			var targetNode = this.targetNode || node;

			if (node) {

				events.on(targetNode, "mousedown", this._mouseDown, this);
				events.on(document, "mouseup", this._mouseUp, this);
				events.on(document, "mousemove", this._mouseMove, this);

			}

		},

		setDomNode: function(node) {

			if (this.domNode) {

				this.destroy();

			}

			this.domNode = node;
			this.initDomNode();

		},

		destroy: function() {

			var node = this.domNode;
			var targetNode = this.targetNode || node;

			if (node) {

				events.off(targetNode, "mousedown", this._mouseDown, this);
				events.off(document, "mouseup", this._mouseUp, this);
				events.off(document, "mousemove", this._mouseMove, this);

			}

		},

		startDrag: function(clientX, clientY) {

			this._startDragging = true;

			this._startOffsetX = clientX;
			this._startOffsetY = clientY;

		},

		_mouseDown: function(e) {

			this.startDrag(e.clientX, e.clientY);

			e.preventDefault();
			return false;

		},

		_mouseUp: function(e) {

			this._startDragging = false;

			if (this._dragging) {
				this._dragging = false;

				this.trigger("dragend");
			}

		},

		_mouseMove: function(e) {

			if (this._startDragging) {

				if (!this._dragging) {

					// trigger the drag start event once
					this.trigger("dragstart");

					// check for an offset parent
					var offsetParent = this.domNode.offsetParent(),
						clientX = this._startOffsetX,
						clientY = this._startOffsetY;

					if (offsetParent.length) {
						clientX -= offsetParent.position().left;
						clientY -= offsetParent.position().top;
					}

					// calculate the offset
					this._startOffsetX = e.clientX - this.domNode.position().left;
					this._startOffsetY = e.clientY - this.domNode.position().top;

				}

				this._dragging = true;

				var clientX = e.clientX,
					clientY = e.clientY;

				// check for an offset parent
				var offsetParent = this.domNode.offsetParent();

				if (offsetParent.length) {
					clientX -= offsetParent.position().left;
					clientY -= offsetParent.position().top;
				}

				// check for the offset in relation to the target element
				clientX -= this._startOffsetX;
				clientY -= this._startOffsetY;

				if (!this.restrictDirection || this.restrictDirection != "horizontal")
					this.domNode.css("left", clientX);

				if (!this.restrictDirection || this.restrictDirection != "vertical")
					this.domNode.css("top", clientY);

				this.trigger("drag", e);

				e.preventDefault();
				return false;

			}
		}

	});

});