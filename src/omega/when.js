define([
    "omega/utils",
    "omega/promise",
    "omega/_Object"
], function(utils, promise, _Object) {

    var dynamicWhen = _Object.extend({

        initialize: function() {
            this.inherited(_Object, arguments);

            this.promiseCount = 0;
            this.completedCount = 0;
            this.promises = [];
            this.responses = [];
            this.promise = promise();
        },

        push: function(promise) {
            this.promises.push(promise);
            this.promiseCount++;

            promise.then(function(response) {

                this.completedCount++;

                this.responses.push(response);

                if (this.completedCount >= this.promiseCount)
                    this.promise.resolve(this.responses);

            }, this);

            return this;
        },

        then: function() {
            // if no promises were added, the promise should be resolved
            if (this.promises.length == 0) {
                this.promise.resolve();
            }

            this.promise.then.apply(this.promise, arguments);

            return this;
        }

    });

    return {

        all: function() {

            var promises = arguments,
                result = promise(),
                completedCount = 0,
                totalCount = promises.length,
                responses = [];

            // check to see if the first argument is an array
            if (typeof(arguments[0]) == "object" && arguments[0].length) {

                promises = arguments[0];
                totalCount = promises.length;

            }

            for (var index = 0; index < totalCount; index++) {

                var prom = promises[index];

                prom.then(function(response) {

                    completedCount++;

                    if (response)
                        responses.push(response);

                    if (completedCount >= totalCount)
                        result.resolve(responses);

                });

            };

            return result;

        },

        promiseList: function() {

            return new dynamicWhen();

        }

    }

});