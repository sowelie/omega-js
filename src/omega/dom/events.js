define(["omega/utils", "jquery"], function(utils, $) {

	return {

		on: function(target, event, method, scope) {

			var handlers = method._eventHandlers;

			if (!target)
				return;

			if (!target.jQuery || target == window)
				target = $(target);

			if (scope) {

				if (!handlers)
					handlers = [];

				var scopedMethod = utils.bind(method, scope);
				scopedMethod._eventTarget = target;
				scopedMethod._eventName = event;
				scopedMethod._eventScope = scope;

				handlers.push(scopedMethod);
				target.bind(event, scopedMethod);

				method._eventHandlers = handlers;

			} else {

				target.bind(event, method);

			}

		},

		off: function(target, event, method, scope) {

			var handlers = method._eventHandlers;

			if (!target)
				return;

			if (!target.jquery)
				target = $(target);

			if (handlers) {

				var removeHandlers = [];

				// find the handlers that need to be unbound
				handlers.forEach(function(handler) {

					// make sure the handler matches
					if (this._targetEquals(target, handler._eventTarget) && handler._eventName == event && handler._eventScope == scope) {

						// unbind the event handler
						target.unbind(event, handler);

						// store the handler to be removed from the array
						removeHandlers.push(handler);
					}

				}, this);

				// remove each handler from the array
				removeHandlers.forEach(function(handler) {

					handlers.splice(handlers.indexOf(handler), 1);

				}, this);

			} else
				target.unbind(event, method);

		},

		_targetEquals: function(targetA, targetB) {

			var result = true;

			targetA.each(function(indexA, elementA) {

				var currentResult = false;

				targetB.each(function(indexB, elementB) {

					if (elementA == elementB) {
						currentResult = true;
					}

				});

				if (!currentResult)
					result = false;

			});

			return result;

		}

	};

});