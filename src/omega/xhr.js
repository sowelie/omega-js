define([
	"./_Object",
	"jquery",
	"./utils",
	"./messageBus",
	"./dom/storage",
	"./promise"
], function(_Object, $, utils, messageBus, storage, promise) {

	return _Object.extend({

		_defaultDataType: "jsonp",
		_defaultMethod: "POST",

        post: function(action, data, callback, scope) {
            return this.execute(action, "POST", data, callback, scope);
        },

        execute: function(action, method, data, callback, scope) {
            if (typeof(data) == "function") {
                scope = callback;
                callback = data;
                data = {};
            }

            // serialize any property that is an object
            for (var name in data) {

                var obj = data[name];

                if (typeof(obj) == "object")
                    data[name] = JSON.stringify(obj);

            }

            data.format = this._defaultDataType;

            var result = promise();

            this.processData(data);

            $.ajax({
                url: this.getURL(action),
                data: data,
                dataType: this._defaultDataType,
                type: method ? method : this._defaultMethod,
                success: function(response, status, jqxhr) {

                    if (response && response.error) {
                        messageBus.publish("main/triggerError", {
                            message: response.error
                        });
                    }

                    // call the callback
                    (scope ? utils.bind(callback, scope) : callback)(response, false, status, jqxhr);

                    // resolve the promise
                    result.resolve(response, false, status, jqxhr);

                },

                error: function(response, status, jqxhr) {

                    console.log(response);

                    result.resolve(response, true, status, jqxhr);

                    // call the callback
                    (scope ? utils.bind(callback, scope) : callback)(response, false, status, jqxhr);

                }

            });

            return result;
        },

		postJSON: function(options) {

			var action = options.action,
				data = options.data,
				params = options.params || {},
				callback = options.callback,
				scope = options.scope,
				dataType = options.dataType,
				result = promise();

			params.format = "json";
			params.authToken = storage("authToken");

			$.ajax(this.root + action + "?" + $.param(params), {

				data: JSON.stringify(data),
				type: "POST",
				dataType: dataType || "json",
				contentType: "application/json",
				success: function(response) {

					if (response && response.error) {
						messageBus.publish("main/triggerError", {
							message: response.error
						});
					}

					// call the callback
					(scope ? utils.bind(callback, scope) : callback)(response);

					// resolve the promise
					result.resolve(response);

				},

				error: function(response) {

					result.resolve(response);
					console.log(arguments);

				}

			});

			return result;

		},

		getURL: function(action) {

			return this.root + action;

		},

		processData: function(data) {



		}

	});

});