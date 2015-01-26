define(["omega/utils", "omega/polyfill"], function(utils) {

	var _Class = function() { };

	var objectId = 0;

	_Class.extend = function (/*Object*/ props, typeName) /*-> Class*/ {

		// extended class with the new prototype
		var NewClass = function () {
			if (this.initialize) {
				this.initialize.apply(this, arguments);
			}

			// set a type name for type checking
			this.__typeName = typeName;
			this.__objectId = ++objectId;
		};

		// instantiate class without calling constructor
		var F = function () {};
		F.prototype = this.prototype;

		var proto = new F();
		proto.constructor = NewClass;

		NewClass.prototype = proto;

		//inherit parent's statics
		for (var i in this) {
			if (this.hasOwnProperty(i) && i !== 'prototype') {
				NewClass[i] = this[i];
			}
		}

		// mix static properties into the class
		if (props.statics) {
			utils.extend(NewClass, props.statics);
			delete props.statics;
		}

		// mix includes into the prototype
		if (props.includes) {
			utils.extend.apply(null, [proto].concat(props.includes));
			delete props.includes;
		}

		// merge options
		if (props.options && proto.options) {
			props.options = utils.extend({}, proto.options, props.options);
		}

		// mix given properties into the prototype
		utils.extend(proto, props);

		// name each function
		for (var name in proto) {
			if (proto.hasOwnProperty(name) && typeof(proto[name]) == "function") {
				proto[name]._nom = name;
				proto[name]._base = this.prototype;
			}
		}

		// add inherited method
		proto.inherited = function(base, args) {

			if (typeof(args) == "undefined")
				args = base;

			var caller = args.callee,
				name = caller._nom;

			return caller._base[name].apply(this, args);

		};

		return NewClass;
	};

	return _Class;

});