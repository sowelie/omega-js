define([
	"omega/widgets/CheckList",
	"jquery",
	"omega/dom/events"
], function(CheckList, $, events) {

	return CheckList.extend({

		startup: function() {

			CheckList.prototype.startup.apply(this, arguments);

			this._domNode.addClass("ui-radio-list");

		},

		_onItemSelected: function(element) {

			this.setSelected(element);

			this.trigger("itemselected", { item: $(element), tag: $(element).attr("data-tag") });

		},

		_getInput: function() {
			return $("<input />").attr("type", "radio");
		},

		setSelected: function(element) {

			var selected = this._containerNode.find("li.ui-selected");

			if (selected.length > 0) {

				selected.removeClass("ui-selected");
				selected.find("input").get(0).checked = false;

			}

			if (typeof(element) == "string") {

				element = this._containerNode.find("li[data-id='" + element + "']");

			} else {

				element = $(element);

			}

			element.addClass("ui-selected");
			element.find("input").get(0).checked = true;

		}

	});

});