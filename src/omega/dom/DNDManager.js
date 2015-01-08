define([
	"omega/_Object",
	"omega/dom/Draggable",
	"omega/dom/events",
	"omega/utils",
	"jquery"
], function(_Object, Draggable, events, utils, $) {

	return _Object.extend({

		initialize: function() {

			this.inherited(_Object, arguments);

			this._dragContainer = $("<div />>")
				.addClass("ui-dragcontainer")
				.hide()
				.appendTo(document.body);

			// set up the draggable
			this._draggable = new Draggable({
				domNode: this._dragContainer
			});

			this._draggable.on("dragstart", this._onDragStart, this);
			this._draggable.on("dragend", this._onDragEnd, this);

			this._sourceElements = {};
			this._targetElements = {};

		},

		registerSourceElement: function(element) {

			events.on(element, "mousedown", this._onElementMouseDown, this);

			var dragId = this._getDragId(element);

			this._sourceElements[dragId] = element;

		},

		unregisterSourceElement: function(element) {

			events.off(element, "mousedown", this._onElementMouseDown, this);

			var dragId = element._dragId;

			if (dragId) {

				delete this._sourceElements[dragId];

			}

		},

		registerTargetElement: function(element) {

			events.on(element, "mousemove", this._onElementMouseMove, this);
			events.on(element, "mouseout", this._onElementMouseOut, this);

			var dragId = this._getDragId(element);

			this._targetElements[dragId] = element;

		},

		unregisterTargetElement: function(element) {

			events.off(element, "mousemove", this._onElementMouseMove, this);
			events.off(element, "mouseout", this._onElementMouseOut, this);

			var dragId = element._dragId;

			if (dragId) {

				delete this._targetElements[dragId];

			}

		},

		destroy: function() {

			this.inherited(_Object, arguments);

			for (var dragId in this._sourceElements) {

				this.unregisterSourceElement(this._sourceElements[dragId]);

			}

			for (var dragId in this._targetElements) {

				this.unregisterTargetElement(this._targetElements[dragId]);

			}

		},

		_getDragId: function(element) {

			var dragId = element._dragId;

			if (!dragId) {

				dragId = utils.randomUUID();

				// store the ID
				element.data("dragId", dragId);

			}

			return dragId;

		},

		_onElementMouseDown: function(e) {

			this._dragContainer.css("top", e.clientY + 10);
			this._dragContainer.css("left", e.clientX + 10);

			// make sure and trigger the start drag on the draggable
			this._draggable.startDrag(e.clientX, e.clientY);

			this._currentDragElement = $(e.currentTarget);

			e.stopPropagation();

			return false;

		},

		_onElementMouseMove: function(e) {

			// if something is being dragged, fire the dragover event
			if (this._draggable._dragging) {

				this.trigger("dragover", {
					container: this._dragContainer,
					element: this._currentDragElement,
					target: $(e.currentTarget),
					position: { x: e.clientX, y: e.clientY }
				});

				this._currentDragTarget = $(e.currentTarget);

			}

			e.preventDefault();

		},

		_onElementMouseOut: function(e) {

			// if something is being dragged, fire the dragover event
			if (this._draggable._dragging) {

				this.trigger("dragout", {
					container: this._dragContainer,
					element: this._currentDragElement,
					target: $(e.currentTarget)
				});

			}

			e.preventDefault();

		},

		_onDragStart: function() {

			// show the drag container, which will be the actual element that is dragged
			this._dragContainer.show();

			this.trigger("dragstart", {
				container: this._dragContainer,
				element: this._currentDragElement
			});

		},

		_onDragEnd: function() {

			this.trigger("dragend", {
				container: this._dragContainer,
				element: this._currentDragElement,
				target: this._currentDragTarget
			});

			this._dragContainer.hide();

		}

	}, "omega.dom.DNDManager");

});