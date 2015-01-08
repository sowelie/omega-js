define([
	"omega/_Widget",
	"jquery",
	"omega/utils",
	"omega/dom/events",
	"text!./templates/CheckList.html"
], function(_Widget, $, utils, events, template) {

	return _Widget.extend({

		templateString: template,

		startup: function() {

			_Widget.prototype.startup.apply(this, arguments);

			this._containerNode.find("li").each(utils.bind(function(index, element) {

				element = $(element);

				this._processItem(element);

			}, this));

		},

		_onItemSelected: function(element) {

			this.setSelected(element);

			if ($(element).hasClass("ui-selected"))
				this.trigger("itemselected", { item: $(element), tag: $(element).data("checklist_tag") });
			else
				this.trigger("itemDeselected", { item: $(element), tag: $(element).data("checklist_tag") });

		},

		clearItems: function() {

			this._containerNode.empty();

		},

		addItem: function(label, tag, checked) {

			var listItem = $("<li />").html(label).data("checklist_tag", tag).appendTo(this._containerNode);

			this._processItem(listItem);

			if (checked) {
				listItem.addClass("ui-selected");
				listItem.find("input").get(0).checked = true;
			}

		},

		getValue: function() {

			var value = [];

			this._containerNode.find("> li.ui-selected").each(function(index, element) {

				console.log(element, $(element).data("checklist_tag"));

				value.push($(element).data("checklist_tag"));

			});

			return value;

		},

		setSelected: function(element, selected) {

			if (typeof(element) == "string") {

				this._containerNode.find("> li").each(function(index, childElement) {

					if ($(childElement).data("checklist_tag") == element)
						element = $(childElement);

				});

			} else {

				element = $(element);

			}

			var checkBox = element.find("input").get(0);

			if (typeof(selected) == "undefined") {

				if (checkBox.checked) {
					element.removeClass("ui-selected");
					checkBox.checked = false;
				} else {
					element.addClass("ui-selected");
					checkBox.checked = true;
				}

			} else {

				if (selected) {
					element.addClass("ui-selected");
					checkBox.checked = true;
				} else {
					element.removeClass("ui-selected");
					checkBox.checked = false;
				}

			}

		},

		_processItem: function(element) {

			var anchor = $("<a />").attr("href", "#").addClass("ui-corner-all").html(element.html());
			element.empty();
			anchor.appendTo(element);

			anchor.hover(function() {
				anchor.addClass("ui-state-focus");
			}, function() {
				anchor.removeClass("ui-state-focus");
			});

			var checkbox = this._getInput(element);
			anchor.prepend(checkbox);

			element.data("checklist_tag", $(element).attr("data-tag"));
			element.addClass("ui-menu-item");

			events.on(element, "click", this._elementClick, this);

			if (element.attr("data-selected")) {
				element.addClass("ui-selected");
				checkbox.get(0).checked = true;
			}

		},

		_getInput: function(element) {

			var result = $("<input />").attr("type", "checkbox");

			if (element.attr("data-selected"))
				result.attr("checked", "checked");

			return result;

		},

		_elementClick: function(e) {

			e.preventDefault();
			this._onItemSelected($(e.currentTarget));
			return false;

		}

	});

});