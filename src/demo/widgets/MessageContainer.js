define([
    "omega/_Widget",
    "text!./templates/MessageContainer.html",
    "omega/widgets/MessageContainer"
], function(_Widget, template) {

    return _Widget.extend({
        templateString: template,

        startup: function() {
            this.inherited(arguments);

            this._messageContainerNode.addError("OH NO!");
        }
    })

});