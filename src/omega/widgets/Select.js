define([
	"omega/widgets/DropDownButton",
    "omega/widgets/SelectOption",
	"jquery"
], function(DropDownButton, SelectOption, $) {

	return DropDownButton.extend({
		startup: function() {
			this.inherited(arguments);

            this.addClass("select");

            var select = this;

            // check to see if any existing options need to be created
            this._containerNode.find("li").each(function(index) {
                var currentNode = $(this),
                    option = select.addOption(currentNode.html(), currentNode.attr("data-value"));

                if (index == 0) {
                    select._setSelectedNode(option);
                }

                currentNode.detach();
            });
		},

		addOption: function(label, value) {
            var option = new SelectOption({ label: label, value: value });
            this.addChild(option);

            option.on("click", this._optionClick, this);

            return option;
		},

        clear: function() {
            this.clearChildren();
        },

		getValue: function() {
			var option = this._containerNode.find("li.active").data("widget");

            if (option) {
                return option.value;
            }

            return null;
		},

		getDisplayedValue: function() {
            var option = this._containerNode.find("li.active").data("widget");

            if (option) {
                return option.label;
            }
		},

		setValue: function(value) {
            var result = null;

		    this.eachChild(function(child) {
                if (child.value == value) {
                    result = child;
                }
            }, this);

            if (result) {
                this._setSelectedNode(result);
            }
		},

        setSelectedIndex: function(index) {
            if (index >= 0 && this._childWidgets.length > index) {
                this._setSelectedNode(this._childWidgets[index]);
            }
        },

        getSelectedIndex: function() {
            var result = -1;

            this.eachChild(function(child, index) {
                if (child.hasClass("active")) {
                    result = index;
                    return true;
                }
            }, this);

            return result;
        },

        _optionClick: function(e) {
            this._setSelectedNode(e.widget);
        },

        _setSelectedNode: function(node) {
            this._containerNode.find(".active").removeClass("active");

            node.addClass("active");

            this._labelNode.html(node.label);

            this.trigger("change", { option: node });
        }
	});

});