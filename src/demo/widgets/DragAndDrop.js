define([
    "omega/_Widget",
    "text!./templates/DragAndDrop.html",
    "omega/widgets/ListView"
], function(_Widget, template) {

    return _Widget.extend({

        templateString: template,

        startup: function() {

            this.inherited(arguments);

        }

    });

});