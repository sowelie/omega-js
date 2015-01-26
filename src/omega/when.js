define([
	"./utils",
	"./promise"
], function(utils, promise) {

	return {

		all: function() {

			var promises = arguments,
				result = promise(),
				completedCount = 0;

			if (arguments.length == 1 && arguments[0].length) {

				promises = arguments[0];

			}

			for (var index = 0; index < promises.length; index++) {

				var prom = promises[index];

				prom.then(function() {

					completedCount++;

					if (completedCount >= promises.length)
						result.resolve();

				});

			};

			return result;

		}

	}

});