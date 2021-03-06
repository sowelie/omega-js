define([
    "omega/_Widget",
    "text!./templates/FilterTextBox.html",
    "omega/widgets/FilterTextBox"
], function(_Widget, template) {

    return _Widget.extend({

        templateString: template,

        startup: function() {

            this.inherited(arguments);

            this._filterNode.on("listfields", function(value) {
                this._filterNode.showFieldMenu([{ label: "Fruits" }, { label: "People" }]);
            }, this);

            this._filterNode.on("listvalues", function(field) {
                if (field.label == "Fruits") {
                    this._filterNode.showValuesMenu([{ label: "Banana" }, { label: "Apple" }]);
                }
            }, this);

            this._autoCompleteNode.on("listfields", function() {
                this._autoCompleteNode.showValuesMenu([{ label: "Apple", value: 0 }, { label: "Banana", value: 1 } ])
            }, this);

            this._filterNode.on("filterchange", function(e) {
                console.log(e);
            });

            this._autoCompleteNode.on("filterchange", function(e) {
                console.log(e);
            });

        }

    });

});