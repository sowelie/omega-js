define([
	"omega/_Widget",
	"jquery",
	"omega/dom/events",
	"omega/dom/Draggable",
	"text!./templates/Dialog.html"
], function(_Widget, $, events, Draggable, template) {

	var lastDialogZIndex = 999;
	var totalDisplayedDialogs = 0;

	return _Widget.extend({

		templateString: template,

		options: {
			title: "",
			content: "",
			showBackdrop: true,
			closable: true,
			movable: true,
			sizable: true,
			destroyOnHide: false,
			autoPosition: true,
			fullScreen: false,
			adjustZIndex: true,
			minWidth: 160,
			minHeight: 120,
			dockOn: null
		},

		startup: function() {

			this._startupComplete = true;

			// full screen dialogs should not be movable
			if (this.fullScreen) {
				this.movable = false;
				this.sizable = false;
			}

			// make sure the dialog's node is added somewhere
			if (!this._domNode && !this.parentNode)
				this.parentNode = $(document.body);

			// complete the creation of the DOM node
			this.inherited(_Widget, arguments);

			if (!this.movable)
				this._domNode.removeClass("ui-draggable");

			this._originalZIndex = parseInt(this._domNode.css("z-index"));

			if (isNaN(this._originalZIndex))
				this._originalZIndex = 999;

			events.on(this._closeNode, "click", this._closeClick, this);

			var width = this.width || this.minWidth,
				height = this.height || this.minHeight;

			if (width) {
				this._containerNode.width(width);
			}

			if (height) {
				this._containerNode.height(height);
			}

			this.update();

		},

		update: function() {

			// check to ensure a backdrop exists on the page
			if (this.showBackdrop) {

				this._initBackdrop();

			}

			if (!this.closable)
				this._closeNode.hide();

			if (this.fullScreen) {

				this._resize();
				events.on(window, "resize", this._resize, this);

			}

			if (this.sizable) {

				var handles = this._domNode.find(".ui-resizable-handle");

				events.on(handles, "mousedown", this._sizeHandleMouseDown, this);
				events.on(document, "mousemove", this._sizeHandleMouseMove, this);
				events.on(document, "mouseup", this._sizeHandleMouseUp, this);

			} else {

				this._domNode.find(".ui-resizable-handle").hide();

			}

			if (this.movable) {

				this._draggable = new Draggable({ domNode: this._domNode, targetNode: this._titleNode });

			} else if (this._draggable) {

				this._draggable.destroy();

			}

		},

		show: function() {

			if (!this._startupComplete) {

				this.startup();

			}

			if (this.adjustZIndex) {

				var dialogZIndex = (lastDialogZIndex + 2),
					newBackdropZIndex = lastDialogZIndex + 1;

				if (this._backdropNode) {

					totalDisplayedDialogs++;

					this._backdropNode.css("z-index", newBackdropZIndex);

					lastDialogZIndex = dialogZIndex;

				}

				this._domNode.css("z-index", dialogZIndex);

			}

			if (this._backdropNode) {

				this._backdropNode.show();

			}

			// position the dialog based on its size
			if (this.autoPosition) {

				this.updatePosition();

			}

			$(document.body).addClass("dialogOpen");

			this._domNode.addClass("ui-dialog-visible");

		},

		hide: function() {

			this.trigger("hide", this);

			if (this._backdropNode) {

				lastDialogZIndex -= 2;
				totalDisplayedDialogs--;

				if (totalDisplayedDialogs == 0) {
					this._backdropNode.hide();
					$(document.body).removeClass("dialogOpen");
				}

				if (this.adjustZIndex)
					this._backdropNode.css("z-index", lastDialogZIndex - 1);

			}

			this._domNode.removeClass("ui-dialog-visible");

			if (this.destroyOnHide)
				this.destroy();

		},

		destroy: function() {

			if (this._draggable)
				this._draggable.destroy();

			events.off(this._closeNode, "click", this._closeClick, this);
			events.off(window, "resize", this._resize, this);

			if (this.sizable) {

				var handles = this._domNode.find(".ui-resizable-handle");

				events.off(handles, "mousedown", this._sizeHandleMouseDown, this);
				events.off(document, "mousemove", this._sizeHandleMouseMove, this);
				events.off(document, "mouseup", this._sizeHandleMouseUp, this);

			}

			_Widget.prototype.destroy.apply(this, arguments);

		},

		setTitle: function(title) {

			this._titleNode.find(".ui-dialog-title").html(title);

		},

		updatePosition: function() {

			var dockOn = this.dockOn;

			if (this.fullScreen) {

				this._domNode.css("top", $(window).scrollTop() - 2);
				this._domNode.css("left", -2);

			} else if (dockOn) {

				var restriction = "",
					viewport = $(window),
					fullWidth = false,
					fullHeight = false,
					headerNode = $("#header"),
					footerNode = $("#footer"),
					top = "auto",
					left = "auto",
					bottom = "auto",
					right = "auto",
					domNode = this._domNode,
					padding = 5;

				this.movable = false;
				this._overridePosition = true;

				if (dockOn == "top") {

					// only allow resizing from the bottom
					restriction = "s";
					fullWidth = true;
					top = headerNode.outerHeight();
					left = 0;

				} else if (dockOn == "right") {

					// only allow resizing from the left
					restriction = "w";
					fullHeight = true;
					top = headerNode.outerHeight();
					right = 0;

				} else if (dockOn == "bottom") {

					// only allow resizing from the top
					restriction = "n";
					fullWidth = true;
					bottom = footerNode.outerHeight();
					left = 0;

				} else if (dockOn == "left") {

					// only allow resizing from the right
					restriction = "e";
					fullHeight = true;
					top = headerNode.outerHeight();
					left = 0;

				}

				this.resizeRestriction = restriction;

				if (fullWidth) {

					domNode.width(Math.round(viewport.width()));
					this._containerNode.width(Math.round(domNode.width()));

				} else if (settings) {

					this.log(settings.width);

					this._containerNode.css("width", settings.width);

				}

				if (fullHeight) {

					var offset = headerNode.outerHeight() + footerNode.outerHeight();

					domNode.height(Math.round(viewport.height() - offset));
					this._containerNode.height(Math.round(domNode.height() - this._titleNode.outerHeight() - offset));

				} else if (settings) {

					this._containerNode.css("height", settings.height);

				}

				domNode.css("top", top);
				domNode.css("right", right);
				domNode.css("bottom", bottom);
				domNode.css("left", left);

			} else {

				this._domNode.css("top", Math.round(($(window).height() - this._domNode.outerHeight()) / 2 + (this.fullScreen ? 0 : $(window).scrollTop())) + "px");
				this._domNode.css("left", Math.round(($(window).width() - this._domNode.outerWidth()) / 2) + "px");

			}

		},

		_resize: function() {

			if (this.fullScreen) {

				var viewport = $(window);

				this._domNode.width(Math.round(viewport.width()));
				this._domNode.height(Math.round(viewport.height()));

				this._containerNode.width(Math.round(this._domNode.width()));
				this._containerNode.height(Math.round(this._domNode.height() - this._titleNode.outerHeight()));

				this.updatePosition();

			}

		},

		_initBackdrop: function() {

			this._backdropNode = $("#ui-backdrop");

			if (this._backdropNode.length == 0) {

				this._backdropNode = $("<div />").addClass("ui-backdrop").attr("id", "ui-backdrop").appendTo(document.body);
				originalBackdropZIndex = parseInt(this._backdropNode.css("z-index"));

			}

		},

		_closeClick: function() {

			this.hide();

		},

		_sizeHandleMouseDown: function(e) {

			e.preventDefault();

			var node = $(e.target),
				classes = node.attr("class").split(" "),
				handle = "";

			classes.forEach(function(className) {

				if (className != "ui-resizable-handle" && className.indexOf("ui-resizable-") == 0) {

					handle = className.replace("ui-resizable-", "");

				}

			});

			if (!this.resizeRestriction || this.resizeRestriction == handle) {

				this._sizeInfo = {
					position: this._domNode.position(),
					mousePosition: { x: e.clientX, y: e.clientY },
					width: this._containerNode.width(),
					height: this._containerNode.height(),
					handle: handle
				};

				this._moving = true;

			}

			return false;

		},

		_sizeHandleMouseMove: function(e) {

			if (this._moving) {

				var info = this._sizeInfo,
					handle = info.handle,
					body = this._containerNode,
					container = this._domNode;

				// east handles
				if (handle == "ne" || handle == "se" || handle == "e")
					body.css("width", info.width + e.clientX - info.mousePosition.x);

				// southern handles
				if (handle == "s" || handle == "se" || handle == "sw")
					body.css("height", info.height + e.clientY - info.mousePosition.y);

				// west handles
				if (handle == "nw" || handle == "w" || handle == "sw") {

					var newWidth = info.width + info.mousePosition.x - e.clientX;

					if (newWidth > this.minWidth) {

						// move the dialog
						container.css("left", info.position.left + e.clientX - info.mousePosition.x);

						// update the width
						body.css("width", newWidth);

					}

				}

				// north handles
				if (handle == "nw" || handle == "n" || handle == "ne") {

					var newHeight = info.height + info.mousePosition.y - e.clientY;

					if (newHeight > this.minHeight) {

						// move the dialog
						container.css("top", info.position.top + e.clientY - info.mousePosition.y);

						// update the width
						body.css("height", newHeight);

					}

				}

				if (body.width() < this.minWidth)
					body.css("width", this.minWidth);

				if (body.height() < this.minHeight)
					body.css("height", this.minHeight);

				this.trigger("resize");

			}

		},

		_sizeHandleMouseUp: function(e) {

			this._moving = false;

		}

	});

});