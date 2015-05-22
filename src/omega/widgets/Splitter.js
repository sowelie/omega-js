define([
	"omega/_Widget",
	"omega/dom/Draggable",
	"omega/utils"
], function(_Widget, Draggable, utils) {

	return _Widget.extend({

		templateString: "<div class=\"splitter splitter-{orientation}\"></div>",
		options: {
			orientation: "horizontal"
		},

		startup: function() {

			_Widget.prototype.startup.apply(this, arguments);

			this._draggable = new Draggable({ domNode: this._domNode, restrictDirection: this.orientation });
			this._draggable.on("drag", this._onDrag, this);

		},

		setPosition: function(left, top) {

			if (left)
				this._domNode.css("left", left + "px");

			if (top)
				this._domNode.css("top", top + "px");

		},

		setDimensions: function(width, height) {

			if (width)
				this._domNode.css("width", width + "px");

			if (height)
				this._domNode.css("height", height + "px");

		},

		destroy: function() {

			_Widget.prototype.destroy.apply(this, arguments);

			this._draggable.off("drag", this._onDrag);
			this._draggable.destroy();

		},

		_onDrag: function(e) {

			this.trigger("drag", utils.extend({ splitter: this }, e));

		}

	});

});