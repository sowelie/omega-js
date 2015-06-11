define([
    "omega/_Widget",
    "text!./templates/Buttons.html",
    "omega/widgets/DropDownButton"
], function(_Widget, template) {
    return _Widget.extend({
        templateString: template
    })
});