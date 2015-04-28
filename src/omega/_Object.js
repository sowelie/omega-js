define([
	"omega/_Class",
	"omega/dom/events",
	"omega/utils"
], function(_Class, events, utils) {

	return _Class.extend({

		initialize: function(options) {

			this._eventHandlers = {};
			this._mixinArgs = null;

			this.options = utils.extend({}, this.options, options);
			utils.extend(this, this.options);

		},

		on: function(event, method, scope) {

			if (this._eventTarget == null) {

				var handlerSet = this._eventHandlers[event];

				if (!handlerSet)
					this._eventHandlers[event] = handlerSet = [];

				if (!scope)
					scope = this;

				handlerSet.push({ callback: utils.bind(method, scope), original: method, scope: scope });

			} else {

				if (this._eventTarget.jquery) {

					events.on(this._eventTarget, event, method, scope);

				} else {

					this._eventTarget.on(event, method, scope);

				}

			}

			return this;

		},

		off: function(event, method) {

			if (this._eventTarget == null) {

				var handlerSet = this._eventHandlers[event],
					index = -1;

				if (!handlerSet)
					return;

				handlerSet.forEach(function(handler, handlerIndex) {

					if (handler.original == method)
						index = handlerIndex;

				}, this);

				if (index != -1)
					handlerSet.splice(index, 1);

			} else {

				if (this._eventTarget.jquery) {

					events.off(this._eventTarget, event, method);

				} else {

					this._eventTarget.off(event, method);

				}

			}

			return this;

		},

		destroy: function() {

			this._eventHandlers = {};

		},

		trigger: function(event, args) {

			if (this._mixinArgs) {
				args = utils.extend({}, args, this._mixinArgs);
			}

			if (this._eventTarget == null) {

				var handlerSet = this._eventHandlers[event];

				if (handlerSet) {
					handlerSet.forEach(function(handler) {
						handler.callback(args);
					});
				}

			} else {

				this._eventTarget.trigger(event, args);

			}

		},

		wireEventsTo: function(target) {

			var oldTarget = this._eventTarget;
			this._eventTarget = target;

			// re-map existing events
			for (var name in this._eventHandlers) {
				var handlerSet = this._eventHandlers[name];

				handlerSet.forEach(function(handler) {

					if (oldTarget)
						oldTarget.off(name, handler.original);
					else
						this.off(name, handler.original);

					this.on(name, handler.original, handler.scope);

				}, this);
			}

		},

		unwireEvents: function() {

			this._eventTarget = null;

		},

		log: function() {

			if (this.debug)
				console.log.apply(console, arguments);

		}

	});

});