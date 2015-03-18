define([
	"omega/widgets/BorderContainer",
	"omega/dom/events",
	"text!./templates/Main.html",
	"omega/widgets/Button",
	"omega/widgets/DropDownButton",
	"omega/widgets/Menu",
	"omega/widgets/SplitButton",
	"omega/widgets/ListView",
	"demo/widgets/TabContainer",
	"demo/widgets/ProgressBar",
	"demo/widgets/Dialogs",
    "demo/widgets/FilterTextBox"
], function(BorderContainer, events, template) {

	return BorderContainer.extend({

		initialize: function() {

			this.inherited(BorderContainer, arguments);

			this._mixinTemplateStrings.push(template);

		},

		startup: function() {

			this.inherited(BorderContainer, arguments);

			this.layoutChildren();

			events.on(window, "resize", this._onResize, this);

			this._widgetListNode.on("itemselected", this._itemSelected, this);

		},

		destroy: function() {

			this.inherited(BorderContainer, arguments);

			this._widgetListNode.off("itemselected", this._itemSelected, this);

			events.off(window, "resize", this._onResize, this);

		},

		layoutChildren: function() {

			this.inherited(BorderContainer, arguments);

			this._centerNode.layoutChildren();

		},

		_onResize: function() {

			this.layoutChildren();

		},

		_itemSelected: function(e) {

			if (this._previousWidget) {
				this._previousWidget.destroy();
			}

			var constructor = require(e.tag),
				widget = new constructor({ parentNode: this._bodyNode });

			widget.startup();

			this._previousWidget = widget;

		}

	});

});