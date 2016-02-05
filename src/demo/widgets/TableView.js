define([
    "omega/_Widget",
    "text!./templates/TableView.html",
    "omega/widgets/TableView"
], function(_Widget, template) {
    return _Widget.extend({
        templateString: template,

        startup: function() {
            this.inherited(arguments);

            this._tableNode.on("sort", function(e) {
               console.log(e);
            });

            this._tableNode.bind([
                { name: "test", value: "value" },
                { name: "test 2", value: "value 2" }
            ]);
        }
    })
});