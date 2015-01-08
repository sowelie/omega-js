define([
	"omega/widgets/Dialog",
	"text!./templates/BorderDialog.html",
	"omega/widgets/BorderContainer"
], function(Dialog, template) {

	return Dialog.extend({

		initialize: function() {

			this.inherited(Dialog, arguments);

			this._mixinTemplateStrings.push(template);

		},

		startup: function() {

			this.inherited(Dialog, arguments);

			this.on("resize", this._onResize, this);

		},

		destroy: function() {

			this.inherited(Dialog, arguments);

			this.off("resize", this._onResize, this);

		},

		show: function() {

			Dialog.prototype.show.apply(this, arguments);

			// TODO: why twice?
			this._resize();
			this._resize();

		},

		_resize: function() {

			this.inherited(Dialog, arguments);

			this._onResize();

		},

		_onResize: function() {

			this._borderNode.layoutChildren();

		}

	});

});