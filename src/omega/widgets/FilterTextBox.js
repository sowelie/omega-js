define([
    "omega/widgets/SearchTextBox",
    "omega/widgets/Menu",
    "omega/widgets/MenuItem",
    "omega/widgets/DOMWidget",
    "omega/widgets/Tooltip",
    "omega/dom/events",
    "omega/utils",
    "omega/_Widget"
], function(SearchTextBox, Menu, MenuItem, DOMWidget, Tooltip, events, utils, _Widget) {

    var FilterValue = _Widget.extend({
        templateString: "<div class=\"filter-value label label-primary\">" +
        "<span class=\"name\" data-attach-point=\"nameNode\">{name} :</span> <span class=\"value\">{value}</span><span data-attach-point=\"closeNode\" class=\"glyphicon glyphicon-remove filter-remove\"></span></div>",

        startup: function() {

            this.inherited(_Widget, arguments);

            events.on(this._closeNode, "click", this._closeClick, this);

            if (!this.name) {
                this._nameNode.hide();
            }

        },

        destroy: function() {

            this.inherited(_Widget, arguments);

            events.off(this._closeNode, "click", this._closeClick, this);

        },

        _closeClick: function() {

            this.trigger("removeclick", { name: this.name, value: this.value });

        }
    });

    return SearchTextBox.extend({

        options: {
            placeholder: "Filter",
            singleValue: false
        },

        startup: function() {

            this.inherited(SearchTextBox, arguments);

            this._currentField = null;
            this._values = [];
            this._menuIndex = 0;

            // set up the menu which will show autocomplete values
            this._menuNode = new Menu({ parentNode: this._domNode });
            this._menuNode.startup();
            this._menuNode.hide();

            // create the node that will contain selected filters
            this._valueContainerNode = new DOMWidget({ nodeName: "div", className: "value-container" });
            this.addChild(this._valueContainerNode);

            this._valueOverflowNode = new Tooltip();
            this.addChild(this._valueOverflowNode);
            this._valueOverflowNode.addClass("value-overflow");

            this._overflowIndicatorNode = new DOMWidget({ nodeName: "span", className: "filter-value overflow-indicator label label-primary", innerHTML: "..." });
            this._valueContainerNode.addChild(this._overflowIndicatorNode);
            this._overflowIndicatorNode.hide();
            this._valueOverflowNode.attachTo(this._overflowIndicatorNode, false);

            this._domNode.addClass("filter-textbox");

            this.on("focus", this._searchKeyUp, this);

            events.on(this._domNode, "click", this._domClick, this);
            events.on(document, "click", this._documentClick, this);
            events.on(this._textNode, "focus", this._textNodeFocus, this);
            events.on(this._textNode, "blur", this._textNodeBlur, this);

            if (this.singleValue) {
                this.addClass("filter-textbox-single-value");
            }

        },

        destroy: function() {

            events.off(this._domNode, "click", this._domClick, this);
            events.off(document, "click", this._documentClick, this);
            events.off(this._textNode, "focus", this._textNodeFocus, this);
            events.off(this._textNode, "blur", this._textNodeBlur, this);

        },

        _textNodeFocus: function() {
            this._domNode.addClass("filter-textbox-focus");
        },

        _textNodeBlur: function() {
            this._domNode.removeClass("filter-textbox-focus");
        },

        _documentClick: function() {

            this._menuNode.hide();

        },

        _domClick: function(e) {

            e.preventDefault();
            e.stopPropagation();

            this._textNode.focus();

            return false;

        },

        showFieldMenu: function(fields) {
            this._menuIndex = 0;

            if (typeof(fields.forEach) == "function") {
                var menu = this._menuNode,
                    value = this.getDisplayedValue().trim().toLowerCase();
                menu.clearItems();

                fields.forEach(function(field) {
                    // check to see if the user's input matches the current value
                    // also make sure the user hasn't already selected this filter
                    if ((field.label.toLowerCase().indexOf(value) != -1 || value.length == 0)
                        && !this._hasFilter(field)) {
                        var menuItem = new MenuItem({ label: field.label, dataItem: field });
                        menuItem.on("click", this._fieldClick, this);
                        menu.addItem(menuItem);
                    }
                }, this);

                this._menuNode.setSelectedIndex(this._menuIndex);

                menu.show();
            }
        },

        _hasFilter: function(field) {

            var result = false;

            this._values.some(function(value) {

                if ((value.field.value != null && value.field.value == field.value)
                    || (value.field.label != null && value.field.label == field.label)) {
                    result = true;
                    return true;
                }

                return false;

            }, this);

            return result;
        },

        _fieldClick: function(e) {

            this.setValue(e.menuItem.dataItem.label + ": ");
            this._currentField = e.menuItem.dataItem;
            this._menuNode.hide();
            this.focus();

        },

        on: function(event) {

            // intercept the search event
            if (event == "listfields" || event == "listvalues" || event == "filterchange")
                _Widget.prototype.on.apply(this, arguments);
            else
                SearchTextBox.prototype.on.apply(this, arguments);

        },

        showValuesMenu: function(values) {
            this._menuIndex = 0;

            if (typeof(values.forEach) == "function") {
                var menu = this._menuNode;
                menu.clearItems();

                var value = this.getDisplayedValue().trim().toLowerCase();

                values.forEach(function(valueName) {
                    if (valueName.label.toLowerCase().indexOf(value) != -1 || value.length == 0) {
                        var menuItem = new MenuItem({label: valueName.label, dataItem: valueName});
                        menuItem.on("click", this._valueClick, this);
                        menu.addItem(menuItem);
                    }
                }, this);

                this._menuNode.setSelectedIndex(this._menuIndex);

                menu.show();
            }
        },

        getValue: function() {
            if (this.singleValue) {
                if (this._values.length > 0) {
                    return this._values[0];
                } else {
                    return null;
                }
            } else {
                return this._values;
            }
        },

        getDisplayedValue: function() {

            var value = this.getRawValue(),
                colonIndex = value.indexOf(":");

            if (colonIndex >= 0) {
                value = value.substring(colonIndex + 1).trim();
            }

            return value;

        },

        getRawValue: function() {

            return SearchTextBox.prototype.getValue.apply(this, arguments);

        },

        _valueClick: function(e) {

            this._addValue(this._currentField, e.menuItem.dataItem);
            this._currentField = null;
            this._menuNode.hide();
            this.setValue("");

        },

        _displayOverflow: function() {
            this._overflowIndicatorNode.show();
            // make sure the value indicator node is always last
            this._valueContainerNode.addChild(this._overflowIndicatorNode, true);
        },

        _hideOverflow: function() {
            this._overflowIndicatorNode.hide();
            this._resize();

            // move any of the previous values that were in the overflow container to the regular container
            this._values.forEach(function(value) {
                if (value.domNode.overflow) {
                    this._valueContainerNode.addChild(value.domNode, true);
                    value.domNode.overvlow = false;
                }
            }, this);
        },

        _addValue: function(field, value) {

            if (this._valueExists(field, value)) {
                return;
            }

            var textBoxWidth = this._domNode.width();

            // create the filter value widget
            var node = new FilterValue({
                name: field ? field.label : "",
                value: value.label
            });

            node.on("removeclick", this._removeValueClick, this);

            // add it to the value container
            this._valueContainerNode.addChild(node);

            // keep track of all of the values
            this._values.push({
                field: field,
                value: value,
                domNode: node
            });

            if (this._getValueContainerWidth() > parseInt(this._domNode.width())) {
                node.overflow = true;
                this._valueContainerNode.removeChild(node);
                this._valueOverflowNode.addChild(node, true);
                this._displayOverflow();
                this._resize();
            } else {
                this._hideOverflow();
            }

            this._resize();

            this.trigger("filterchange", this._values);

            this.addClass("filter-textbox-with-value");

            // if it is a single value filter, size the value appropriately
            if (this.singleValue) {
                node._domNode.outerWidth(textBoxWidth);
            }

        },

        _valueExists: function(field, value) {
            var result = false;

            this._values.some(function(entry) {
                if (utils.equals(entry.field, field) && utils.equals(entry.value, value)) {
                    result = true;
                    return true;
                }
            });

            return result;
        },

        _getValueContainerWidth: function() {
            var result = this._textNode.width();

            // make sure the tooltip is displaed for the width calculation
            this._valueOverflowNode.show();

            this._values.forEach(function(value) {
                result += value.domNode._domNode.outerWidth();
            });

            this._valueOverflowNode.hide();

            return result;
        },

        clear: function() {
            this.inherited(arguments);

            this._values.forEach(function(value) {
                value.domNode.destroy();
            });

            this._values = [];
            this._resize();
            this.removeClass("filter-textbox-with-value");
            this.trigger("filterchange", this._values);
        },

        _removeValueClick: function(e) {

            this._values.some(function(value, index) {

                if ((value.field == null || value.field.label == e.name) && value.value.label == e.value) {

                    // remove the dom node
                    value.domNode.destroy();

                    // remove the value
                    this._values.splice(index, 1);

                    this._resize();

                    if (this._values.length == 0) {
                        this.removeClass("filter-textbox-with-value");
                    }

                    return true;

                }

                return false;

            }, this);

            if (this._getValueContainerWidth() < parseInt(this.css("max-width"))) {
                this._hideOverflow();
                this._resize();
            }

            this.trigger("filterchange", this._values);

        },

        _resize: function() {

            // pad the text box over so the values don't hide it
            if (!this.singleValue) {
                this._textNode.css("margin-left", this._valueContainerNode._domNode.width());
            }

        },

        _searchKeyUp: function(e) {

            this.inherited(SearchTextBox, arguments);

            if (this.singleValue && this._values.length > 0) {
                return;
            }

            if (e.keyCode == 38) {
                if (this._menuIndex > 0) {
                    this._menuIndex--;
                }
            } else if (e.keyCode == 40) {
                if (this._menuIndex + 1 < this._menuNode.getItems().length) {
                    this._menuIndex++;
                }
            } else if (e.keyCode == 13) {
                if (this._menuNode.isVisible()) {
                    this._menuNode.select();
                } else {
                    var value = this.getDisplayedValue();

                    this._addValue(this._currentField, { label: value, value: value });
                    this._currentField = null;
                    this.setValue("");
                }
            } else {
                if (this.getRawValue().indexOf(":") == -1) {
                    this.trigger("listfields", this.getValue());
                } else {
                    this.trigger("listvalues", this._currentField);
                }
            }

            this._menuNode.setSelectedIndex(this._menuIndex);

        }

    }, "omega.widgets.FilterTextBox");

});