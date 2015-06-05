define([
	"jquery",
	"omega/utils"
],
function($, utils) {

	return {

		parse: function(node, parentWidget) {

			var $node = null;

			if (node.jquery)
				$node = node;
			else
				$node = $(node);

			// parse any children
			$node.find("*[data-widget-class]").each(utils.bind(function(index, element) {

				this._parseElement(element, parentWidget);

			}, this));

		},

		_parseElement: function(element, parentWidget) {

			var $element = $(element);

			// check to see if the element has a widget class
			if ($element.attr("data-widget-class")) {
				var widgetConstructor = require($element.attr("data-widget-class")),
					arguments = $element.attr("data-widget-args"),
					widget = $element.data("widget");

				// make sure the widget hasn't already been parsed
				if (!widget) {

					if (arguments) {

                        // check to see if the {} are there
                        if (!arguments.startsWith("{")) {
                            arguments = "{" + arguments + "}";
                        }

						// add quotes
						arguments = arguments.replace(/(\{|,)\s*([\w\d_]*)\:/g, "$1\"$2\":");
						arguments = arguments.replace(/'/g, "\"");
						arguments = $.parseJSON(arguments);
					}

					if (arguments)
						widget = new widgetConstructor(arguments);
					else
						widget = new widgetConstructor();

					widget.initDomNode();

					// attach any non-widget elements
					widget.attachElements();

					// parse any child widgets
					this.parse(widget._domNode, widget);

					// check to see if the widget has any content, and if it has a "containerNode"
					if (widget._containerNode) {

						if ($element.children().length > 0)
							utils.getDOMNode(widget._containerNode).append($element.children());
						else
							utils.getDOMNode(widget._containerNode).append($element.html());

					}

					// copy over the id and class
					if ($element.attr("id"))
						widget._domNode.attr("id", $element.attr("id"));

					if ($element.attr("class"))
						widget._domNode.addClass($element.attr("class"));

					// carry over the attached data
					widget._domNode.data($element.data());

					// carry over data attributes
					for (var i = 0; i < element.attributes.length; i++) {

						var attr = element.attributes[i];

						if (attr.specified && attr.name.indexOf("data-") == 0) {

							widget._domNode.attr(attr.name, attr.value);

						}

					}

					// update node attachment
					if (parentWidget) {
						parentWidget._attachElement(widget._domNode);
					}

					$element.replaceWith(widget._domNode);

					widget.startup();

					if (parentWidget)
						parentWidget.addChild(widget);

				}
			}

		},

		get: function(element) {

			if (typeof(element) == "string")
				element = $("#" + element);

			if (!element.jquery)
				element = $(element);

			return element.data("widget");

		}

	};

});