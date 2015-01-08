define([
	"./utils",
	"./promise"
], function(utils, promise) {

	return {

		all: function() {

			var promises = arguments,
				result = promise(),
				completedCount = 0,
				totalCount = promises.length;

			for (var index = 0; index < totalCount; index++) {

				var prom = promises[index];

				prom.then(function() {

					completedCount++;

					if (completedCount >= totalCount)
						result.resolve();

				});

			};

			return result;

		}

	}

});