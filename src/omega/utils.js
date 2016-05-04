define([], function() {

	function s4() {
	  return Math.floor((1 + Math.random()) * 0x10000)
	             .toString(16)
	             .substring(1);
	}

	function guid() {
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	         s4() + '-' + s4() + s4() + s4();
	}

	var utils = {
		extend: function (/*Object*/ dest) /*-> Object*/ {	// merge src properties into dest
			var sources = Array.prototype.slice.call(arguments, 1);
			for (var j = 0, len = sources.length, src; j < len; j++) {
				src = sources[j] || {};
				for (var i in src) {
					if (src.hasOwnProperty(i)) {
						dest[i] = src[i];
					}
				}
			}
			return dest;
		},

		bind: function (fn, obj) { // (Function, Object) -> Function
			var args = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : null;
			return function () {
				return fn.apply(obj, args || arguments);
			};
		},

		template: function (str, data, secondary) {
			var regex = /\{ *([\w_\.:]+) *\}/g;

			if (secondary) {
				regex = /\$ *([\w_\.:]+) *\$/g;
			}

			return str.replace(regex, this.bind(function (str, key) {
				var defaultValue = "";

				if (key.indexOf(":") >= 0) {
					var keys = key.split(":");
					key = keys[0];
					defaultValue = keys[1];
				}
				var result = this.bindField(data, key);

				return result || defaultValue;
			}, this));
		},

		bindField: function(item, fieldName) {

			if (!fieldName)
				return "";

			var currentItem = item,
				pieces = fieldName.split(".");

			pieces.forEach(function (piece) {

				if (typeof(currentItem) != "undefined" && currentItem != null)
					currentItem = currentItem[piece];

			});

			if (typeof(currentItem) == "undefined" || currentItem == null)
				currentItem = "";

			return currentItem;
		},

		getDOMNode: function(obj) {

			if (obj._domNode)
				return obj._domNode;
			else
				return obj;

		},

		randomUUID: function() {

			return guid();

		},

        equals: function(a, b) {
            if (typeof(a) == "object" && typeof(b) == "object") {
                for (var i in a) {
                    if (a.hasOwnProperty(i)) {
                        if (!b.hasOwnProperty(i)) return false;
                        if (a[i] != b[i]) return false;
                        if (!utils.equals(a[i], b[i])) return false;
                    }
                }
                for (var i in b) {
                    if (b.hasOwnProperty(i)) {
                        if (!a.hasOwnProperty(i)) return false;
                        if (a[i] != b[i]) return false;
                        if (!utils.equals(a[i], b[i])) return false;
                    }
                }
            } else if (a != b) {
                return false;
            }

            return true;
        }

	};

    return utils;

});