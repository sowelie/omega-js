define([
	"./utils",
	"./_Class"
], function(utils, _Class) {

	var Promise = _Class.extend({

		initialize: function(isComplete) {

			this._callbacks = [];
			this._isComplete = (isComplete === true);

		},

		resolve: function() {

			this._isComplete = true;
			this._args = arguments;

			this._callbacks.forEach(function(callback) {
				callback.method.apply(callback.scope || window, this._args);
			}, this);
		},

		then: function(callback, scope) {

			if (this._isComplete) {

				callback.apply(scope || window, this._args);

			} else {

				this._callbacks.push({
					method: callback,
					scope: scope
				});

			}

			return this;

		}

	});

	return function(isComplete) {

		return new Promise(isComplete);

	};

});