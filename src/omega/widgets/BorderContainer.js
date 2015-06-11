define([
    "jquery",
    "omega/_Widget",
    "text!./templates/BorderContainer.html",
	"omega/dom/events",
	"omega/utils",
	"omega/widgets/Splitter"
], function($, _Widget, template, events, utils, Splitter) {

	return _Widget.extend({

		templateString: template,

		initialize: function() {

			this.inherited(_Widget, arguments);

			this.panels = {};

		},

		startup: function() {

			_Widget.prototype.startup.apply(this, arguments);

			this.layoutChildren();

		},

		destroy: function() {

			_Widget.prototype.destroy.apply(this, arguments);

		},

		layoutChildren: function() {

			this.panels = {};

			var topHeight = 0,
				bottomHeight = 0,
				leftWidth = 0,
				rightWidth = 0,
				updateOuter = false,
				splitter = null;

			this._domNode.find("> *[data-layout-position]").each(utils.bind(function(index, element) {

				var panel = $(element);
				var position = panel.attr("data-layout-position");

				panel.css("position", "absolute");
				panel.addClass("bordercontainer-panel");

				this.panels[position] = panel;

				if (panel.attr("data-layout-splitter")) {
					this._addSplitter(panel, position);
				}

			}, this));

			// layout the top panel
			var topPanel = this.panels["top"];

			if (topPanel && topPanel.css("display") == "block") {

				// increment the height, so that the other panels will be shifted down
				topHeight = topPanel.outerHeight();

				this.log("TOP", topHeight);

				topPanel.css("top", 0);
				topPanel.css("left", 0);
				topPanel.outerWidth(this._domNode.width());
				topPanel.addClass("bordercontainer-panel-top");

				splitter = topPanel.data("splitter");

				if (splitter)
					topHeight += splitter._domNode.outerHeight();

			}

			// layout the bottom panel
			var bottomPanel = this.panels["bottom"];

			if (bottomPanel && bottomPanel.css("display") == "block") {

				// increment the height, so that the other panels will be shifted down
				bottomHeight = bottomPanel.outerHeight();

				bottomPanel.css("bottom", 0);
				bottomPanel.css("left", 0);
				bottomPanel.outerWidth(this._domNode.width());
				bottomPanel.addClass("bordercontainer-panel-bottom");

			}

			// layout the left panel
			var leftPanel = this.panels["left"];

			if (leftPanel && leftPanel.css("display") == "block") {

				leftWidth = leftPanel.outerWidth();

				splitter = leftPanel.data("splitter");

				if (splitter)
					leftWidth += splitter._domNode.outerWidth();

				leftPanel.css("top", topHeight + "px");
				leftPanel.css("left", 0);
				leftPanel.outerHeight(this._domNode.height() - topHeight - bottomHeight);
				leftPanel.addClass("bordercontainer-panel-left");

			}

			// layout the right panel
			var rightPanel = this.panels["right"];

			if (rightPanel && rightPanel.css("display") == "block") {

				rightWidth = rightPanel.outerWidth();

				rightPanel.css("top", topHeight + "px");
				rightPanel.css("right", 0);
				rightPanel.outerHeight(this._domNode.height() - topHeight - bottomHeight);
				rightPanel.addClass("bordercontainer-panel-right");

			}

			// layout the center panel
			var centerPanel = this.panels["center"];

			if (centerPanel && centerPanel.css("display") == "block") {

				centerPanel.css("top", topHeight + "px");
				centerPanel.css("left", leftWidth);

				var autoSizeAttr = centerPanel.attr("data-layout-autosize");

				// check to see if the panel should be auto sized
				if (typeof(autoSizeAttr) == "undefined" || autoSizeAttr == "true") {

					var width = this._domNode.width() - leftWidth - rightWidth,
						height = this._domNode.height() - topHeight - bottomHeight,
						minWidth = parseInt(centerPanel.css("min-width")) || 0,
						minHeight = parseInt(centerPanel.css("min-height")) || 0;

					centerPanel.outerWidth(width > minWidth ? width : minWidth);
					centerPanel.outerHeight(height > minHeight ? height : minHeight);

				} else {

					updateOuter = true;

				}

				centerPanel.addClass("bordercontainer-panel-center");

			}

			// update the outer width / height
			if (updateOuter) {

				this._domNode.width(leftWidth + centerPanel.outerWidth() + rightWidth);
				this._domNode.height(topHeight + centerPanel.outerHeight() + bottomHeight);

			}

			// update splitters
			for (var position in this.panels) {

				var panel = this.panels[position];

				if (panel.data("splitter")) {

					splitter = panel.data("splitter");
					var left = 0,
						top = 0;

					if (position == "left") {
						left += panel.outerWidth();
						top += topHeight;
						splitter.setDimensions(null, panel.outerHeight());
					}

					if (position == "right") {
						top += topHeight;
						left += panel.position().left;
						splitter.setDimensions(null, panel.outerHeight());
					}

					if (position == "top") {
						top += panel.outerHeight();
						splitter.setDimensions(panel.outerWidth(), null);
					}

					if (position == "bottom") {
						top += panel.position().top;
						splitter.setDimensions(panel.outerWidth(), null);
					}

					if (panel.css("display") == "block")
						splitter.show();
					else
						splitter.hide();

					splitter.setPosition(left, top);

				}

			}

			this.trigger("layoutchildren");

		},

		_addSplitter: function(panel, position) {

			if (panel.data("splitter"))
				return;

			var splitter = new Splitter({ orientation: position == "top" || position == "bottom" ? "horizontal" : "vertical" });
			this.addChild(splitter);
			splitter.startup();
			splitter.on("drag", this._splitterDrag, this);
			splitter._panel = panel;
			panel.data("splitter", splitter);

		},

		_splitterDrag: function(e) {

			var splitter = e.splitter,
				panel = splitter._panel,
				position = panel.attr("data-layout-position"),
				minWidth = panel.css("min-width") || 0,
				minHeight = panel.css("min-height") || 0,
				totalWidth = this._domNode.outerWidth(),
				totalHeight = this._domNode.outerHeight(),
				topPanel = this.panels["top"],
				rightPanel = this.panels["right"],
				bottomPanel = this.panels["bottom"],
				leftPanel = this.panels["left"],
				centerPanel = this.panels["center"],
				clientX = e.clientX - panel.offsetParent().offset().left,
				clientY = e.clientY - panel.offsetParent().offset().top,
				width = position == "left" ? clientX : totalWidth - clientX,
				height = position == "top" ? clientY : totalHeight - clientY,
				maxWidth = 0,
				maxHeight = 0;

			// check min width / height
			if (position == "left") {

				maxWidth = totalWidth;

				if (centerPanel && centerPanel.css("min-width"))
					maxWidth -= parseInt(centerPanel.css("min-width").replace("px", ""));

				if (rightPanel && rightPanel.css("min-width"))
					maxWidth -= parseInt(rightPanel.css("min-width").replace("px", ""));

				if (clientX < minWidth) {

					splitter.setPosition(minWidth, null);
					width = minWidth;

				} else if (maxWidth > 0 && clientX > maxWidth) {

					splitter.setPosition(maxWidth, null);
					width = maxWidth;

				}

			} else if (position == "right") {

				maxWidth = 0;

				if (centerPanel && centerPanel.css("min-width"))
					maxWidth += parseInt(centerPanel.css("min-width").replace("px", ""));

				if (leftPanel && leftPanel.css("min-width"))
					maxWidth += parseInt(leftPanel.css("min-width").replace("px", ""));

				if (width < minWidth) {

					splitter.setPosition(totalWidth - minWidth, null);
					width = totalWidth - minWidth;

				} else if (maxWidth > 0 && width > maxWidth) {

					splitter.setPosition(totalWidth - maxWidth, null);
					width = totalWidth - maxWidth;

				}

			} else if (position == "top") {

				maxHeight = 0;

				if (centerPanel && centerPanel.css("min-height"))
					maxHeight += parseInt(centerPanel.css("min-height").replace("px", ""));
				else if (leftPanel && leftPanel.css("min-height"))
					maxHeight += parseInt(leftPanel.css("min-height").replace("px", ""));
				else if (rightPanel && rightPanel.css("min-height"))
					maxHeight += parseInt(rightPanel.css("min-height").replace("px", ""));

				if (bottomPanel && bottomPanel.css("min-height"))
					maxHeight += parseInt(bottomPanel.css("min-height").replace("px", ""));

				if (clientY < minHeight) {

					splitter.setPosition(null, minHeight);
					height = minHeight;

				} else if (maxHeight > 0 && clientY > maxHeight) {

					splitter.setPosition(null, maxHeight);
					height = maxHeight;

				}

			} else if (position == "bottom") {

				maxHeight = 0;

				if (centerPanel && centerPanel.css("min-height"))
					maxHeight += parseInt(centerPanel.css("min-height").replace("px", ""));
				else if (leftPanel && leftPanel.css("min-height"))
					maxHeight += parseInt(leftPanel.css("min-height").replace("px", ""));
				else if (rightPanel && rightPanel.css("min-height"))
					maxHeight += parseInt(rightPanel.css("min-height").replace("px", ""));

				if (topPanel && topPanel.css("min-height"))
					maxHeight += parseInt(topPanel.css("min-height").replace("px", ""));

				if (height < minHeight) {

					splitter.setPosition(null, totalHeight - minHeight);
					height = totalHeight - minHeight;
					return;

				} else if (maxHeight > 0 && height > maxHeight) {

					splitter.setPosition(null, totalHeight - maxHeight);
					height = totalHeight - maxHeight;
					return;

				}

			}

			if (position == "left" || position == "right")
				panel.width(width);
			else if (position == "top" || position == "bottom")
				panel.height(height);

			this.layoutChildren();

		}

	}, "widgets.BorderContainer");

});