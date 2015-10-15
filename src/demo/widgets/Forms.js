define([
    "omega/_Widget",
    "text!./templates/Forms.html",
    "omega/widgets/TextBox"
], function(_Widget, template) {
    return _Widget.extend({
        templateString: template,

        startup: function() {
            this.inherited(arguments);

            this._textNode.setState("error", "This textbox has an error.");
        }
    })
});