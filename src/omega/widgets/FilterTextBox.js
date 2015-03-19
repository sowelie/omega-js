define([
    "omega/widgets/SearchTextBox",
    "omega/widgets/Menu",
    "omega/widgets/MenuItem",
    "omega/widgets/DOMWidget",
    "omega/dom/events",
    "omega/_Widget"
], function(SearchTextBox, Menu, MenuItem, DOMWidget, events, _Widget) {

    var FilterValue = _Widget.extend({
        templateString: "<div class=\"filterValue ui-button ui-button-primary ui-corner-all\">" +
            "<span class=\"name\">{name}</span>: <span class=\"value\">{value}</span><span data-attach-point=\"closeNode\" class=\"ui-button-icon-primary ui-icon ui-icon-closethick close\"></span></div>",

        startup: function() {

            this.inherited(_Widget, arguments);

            events.on(this._closeNode, "click", this._closeClick, this);

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
            placeholder: "Filter"
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
            this._valueContainerNode = new DOMWidget({ nodeName: "div", className: "valueContainer" });
            this.addChild(this._valueContainerNode);

            this._domNode.addClass("ui-filter-textbox ui-autocomplete-input");

            this.on("focus", this._searchKeyUp, this);

            events.on(this._domNode, "click", this._domClick, this);
            events.on(document, "click", this._documentClick, this);

        },

        destroy: function() {

            events.off(this._domNode, "click", this._domClick, this);
            events.off(document, "click", this._documentClick, this);

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
                    value = this.getValue().trim().toLowerCase();
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

                var value = this.getValue().trim().toLowerCase();

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

            var value = this.inherited(arguments),
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
            this.clear();

        },

        _addValue: function(field, value) {

            // create the filter value widget
            var node = new FilterValue({ name: field.label, value: value.label });

            node.on("removeclick", this._removeValueClick, this);

            // add it to the value container
            this._valueContainerNode.addChild(node);

            // keep track of all of the values
            this._values.push({ field: field, value: value, domNode: node });

            this._resize();

            this.trigger("filterchange", this._values);

        },

        _removeValueClick: function(e) {

            this._values.some(function(value, index) {

                if (value.field.label == e.name && value.value.label == e.value) {

                    // remove the dom node
                    value.domNode.destroy();

                    // remove the value
                    this._values.splice(index, 1);

                    this._resize();

                    return true;

                }

                return false;

            }, this);

            this.trigger("filterchange", this._values);

        },

        _resize: function() {

            // pad the text box over so the values don't hide it
            this._textNode.css("margin-left", this._valueContainerNode._domNode.width());

            // set the width of the text box

        },

        _searchKeyUp: function(e) {

            this.inherited(SearchTextBox, arguments);

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
                    var value = this.getValue();

                    this._addValue(this._currentField, { label: value, value: value });
                    this._currentField = null;
                    this.clear();
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