define(["omega/_Widget"], function(_Widget) {

	return _Widget.extend({

		options: {
			nodeName: "div",
			innerHTML: ""
		},

		templateString: "<{nodeName} data-attach-point=\"containerNode\">{innerHTML}</{nodeName}>",

		startup: function() {

			this.inherited(_Widget, arguments);

			// wire all events to the DOM node
			this.wireEventsTo(this._domNode);

		}

	});

});