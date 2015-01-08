define([
	"./utils"
], function(utils) {

	return {

		handlers: {},

		subscribe: function(message, handler, scope) {

			var handlers = this.handlers[message];

			if (!handlers)
				handlers = [];

			// keep a reference to the generated function
			if (scope) {

				if (!handler._messageBusHandlers)
					handler._messageBusHandlers = {};

				handler = handler._messageBusHandlers[message] = utils.bind(handler, scope);
			}

			handlers.push(handler);

			this.handlers[message] = handlers;

		},

		publish: function(message, data) {

			var handlers = this.handlers[message];

			if (handlers) {

				var result = null;

				handlers.forEach(function(handler) {

					var returnValue = handler(data);

					if (typeof(returnValue) != "undefined")
						result = returnValue;

				});

				return result;

			}

			return null;

		},

		unsubscribe: function(message, handler) {

			var handlers = this.handlers[message];

			if (handlers) {

				if (handler._messageBusHandlers) {

					var newHandler = handler._messageBusHandlers[message];

					if (newHandler)
						handler = newHandler;

				}

				var index = handlers.indexOf(handler);

				if (index >= 0)
					handlers.splice(index, 1);

			}

		}

	};

});