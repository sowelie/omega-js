define([
    "omega/_Widget",
    "text!./templates/Select.html",
    "omega/widgets/Select"
], function(_Widget, template) {
    return _Widget.extend({
        templateString: template,

        startup: function() {
            this.inherited(arguments);

            this._selectNode.on("change", this._selectChange, this);
        },

        _selectChange: function(e) {
            this._outputNode.html("Label: " + e.option.getLabel() + " value: " + e.option.getValue());
        }
    })
});