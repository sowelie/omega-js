define([
	"omega/_Object",
	"omega/utils",
	"jquery",
	"omega/dom/events",
	"omega/dom/parser"
], function(_Object, utils, $, events, parser) {

	return _Object.extend({

		initialize: function() {

			this.inherited(_Object, arguments);

			this._eventHandlers = {};
			this._childWidgets = [];
			this._shortcuts = [];
			this._mixinTemplateStrings = [];

		},

		initDomNode: function() {

			if (!this._domNode) {

				// check to see if a template was provided
				var template = this.templateString || "<div></div>";

				// replace any tokens
				template = utils.template(template, this.options);

				// create the DOM node
				this._domNode = $(template);
				this._domNode.data("widget", this);

				// mixin other templates
				this._mixinSubTemplates();

				// add the DOM node to the parent, if one was specified
				if (this.parentNode) {
					this._domNode.appendTo(this.parentNode);
				}

				if (this._domNode.attr("data-attach-point")) {
					this._attachElement(this._domNode.get(0));

					// remove the attach point information, so that it can be attached to a parent widget
					this._domNode.removeAttr("data-attach-point");
					this._domNode.data("attachedToWidget", null);
				}

				// clear the template string to save memory
				this.templateString = null;

			}

		},

		attachElements: function() {

			this._domNode.find("*[data-attach-point]").each(utils.bind(function(index, element) {
				this._attachElement(element);
			}, this));

		},

		_mixinSubTemplates: function() {

			this._mixinTemplateStrings.forEach(function(template) {

				// replace tokens
				template = utils.template(template, this.options);

				var domNode = $(template);

				this.log("TEMPLATE", domNode);

				// find mixin attach points
				domNode.find("*[data-mixin-attach-point]").each(utils.bind(function(index, mixinElement) {

					var node = $(mixinElement);

					this.log("MIXIN ELEMENT", node);

					this._appendMixinNode(node);

				}, this));

				// check to see if the root node should be appended
				if (domNode.attr("data-mixin-attach-point"))
					this._appendMixinNode(domNode);

				// copy over class names from the root node
				var className = domNode.attr("class");

				// add the class to the root node
				this._domNode.addClass(className);

			}, this);

			// clear the mixin strings to free memory
			this._mixinTemplateStrings = null;

		},

		_appendMixinNode: function(node) {

			// get the parent node the mixin should be attached to
			var mixinAttachPoint = node.attr("data-mixin-attach-point"),
				attachNode = null;

			if (mixinAttachPoint == "domNode")
				attachNode = this._domNode;
			else
				attachNode = this._domNode.find("*[data-attach-point='" + mixinAttachPoint + "']");

			// attach the mixin node
			if (node.attr("data-mixin-replace"))
				attachNode.html(node);
			else
				attachNode.append(node);

			this.log("ATTACH MIXIN", attachNode, node);

			// remove the data-mixin-attach-point so it isn't picked up later
			node.removeAttr("data-mixin-attach-point");

		},

		_attachElement: function(element, attachPoint) {

			var $element = $(element),
				value = $element;

			if (!attachPoint)
				attachPoint = $element.attr("data-attach-point");

			if ($element.data("widget"))
				value = $element.data("widget");

			this.log(this, $element.data("attachedToWidget"), $element.attr("data-attach-point"));

			if ($element.data("attachedToWidget") && $element.data("attachedToWidget") != this)
				return;

			this["_" + attachPoint] = value;
			$element.data("attachedToWidget", this);

		},

		_keyDown: function(e) {

			// make sure an input element isn't focused
			if ((e.target.tagName == "INPUT" || e.target.tagName == "SELECT" || e.target.tagName == "TEXTAREA")
				&& !e.ctrlKey && !e.metaKey && e.keyCode != 27) {

				return;

			}

			// get the key code
			var keyCode = e.keyCode || e.which;
			var keys = [];

			// check for meta keys
			if (e.ctrlKey || e.metaKey)
				keys.push("meta");

			if (e.shiftKey)
				keys.push("shift");

			if (e.altKey)
				keys.push("alt");

			if (keyCode == 27)
				keys.push("esc");

			var character = String.fromCharCode(keyCode).toLowerCase();

			// only use digits and word characters
			if (character.search(/[\w\d]+/g) >= 0)
				keys.push(character);

			// check to see if any shortcuts exist
			var shortcuts = this.findShortcut(keys);

			shortcuts.forEach(function(shortcut) {
				shortcut.callback(e);
			});

		},

		startup: function() {

			// check to see if the widget's DOM has been initialized
			if (!this._domNode) {

				this.initDomNode();
				this.attachElements();
				parser.parse(this._domNode, this);

			}

			events.on(document, "keydown", this._keyDown, this);

		},

		destroy: function() {

			this.inherited(_Object, arguments);

			this._domNode.detach();

			if (this._childWidgets) {

				this.clearChildren();

			}

			events.off(document, "keydown", this._keyDown, this);

			this._childWidgets = [];

		},

		addChild: function(childWidget) {

			// check to see if the widget needs to be added to the DOM
			if (!childWidget._domNode) {

				childWidget.startup();

				// check for a container node
				if (this._containerNode)
					this._containerNode.append(childWidget._domNode);
				else
					this._domNode.append(childWidget._domNode);

			}

			this._childWidgets.push(childWidget);

		},

		removeChild: function(childWidget) {

			var index = this._childWidgets.indexOf(childWidget);

			if (index >= 0) {

				if (childWidget._domNode) {

					childWidget._domNode.detach();

				}

				this._childWidgets.splice(index, 1);

			}

		},

		eachChild: function(callback, scope) {

			this._childWidgets.forEach(callback, scope);

		},

		clearChildren: function() {

			this.eachChild(function(widget) {

				widget.destroy();

			}, this);

			this._childWidgets = [];

		},

		bindShortcut: function(keys, callback, scope) {

			var processedCallback = callback;

			if (scope) {
				processedCallback = utils.bind(callback, scope);
				processedCallback._originalCallback = callback;
			}

			this._shortcuts.push({ keys: keys, callback: processedCallback });

		},

		removeShortcut: function(keys, callback) {

			var shortcuts = this.findShortcut(keys, callback);

			shortcuts.forEach(function(shortcut) {
				this._shortcuts.splice(this._shortcuts.indexOf(shortcut), 1);
			});

		},

		findShortcut: function(keys, callback) {

			var foundShortcuts = [];

			this._shortcuts.some(function(shortcut, shortcutIndex) {

				var areKeysEqual = true;

				if (keys.length == shortcut.keys.length) {
					keys.some(function(key) {

						if (shortcut.keys.indexOf(key) == -1) {
							areKeysEqual = false;
							return true;
						}

						return false;

					}, this);
				} else
					areKeysEqual = false;

				if (areKeysEqual && (callback == null || callback == shortcut.callback || shortcut._originalCallback == callback)) {

					foundShortcuts.push(shortcut);
					return true;

				}

				return false;

			}, this);

			return foundShortcuts;

		},

		show: function() {

			this._domNode.show();

		},

		hide: function() {

			this._domNode.hide();

		},

		addClass: function(clazz) {

			this._domNode.addClass(clazz);

		},

		removeClass: function(clazz) {

			this._domNode.removeClass(clazz);

		},

		hasClass: function(clazz) {

			return this._domNode.hasClass(clazz);

		},

		css: function(name, value) {

			return this._domNode.css.apply(this._domNode, arguments);

		},

		data: function(name, value) {

			return this._domNode.data.apply(this._domNode, arguments);

		},

		find: function(query) {

			return this._domNode.find(query);

		},

		html: function(innerHTML) {

			this._domNode.html(innerHTML);

		},

		attr: function(name, value) {

			this._domNode.attr(name, value);

		},

		append: function(value) {

			this._domNode.append(value);

		},

		setEnabled: function(value) {

			if (value)
				this._domNode.removeAttr("disabled");
			else
				this._domNode.attr("disabled", "disabled");

		}

	});

});