define([
    "omega/_Widget",
    "omega/dom/events",
    "omega/utils"
], function(_Widget, events, utils) {
    return _Widget.extend({
        templateString: '<li><a href="javascript:void(0)" data-attach-point="containerNode">{label}</a>',

        startup: function() {
            this.inherited(arguments);

            events.on(this._containerNode, "click", this._click, this);
        },

        destroy: function() {
            events.off(this._containerNode, "click", this._click, this);

            this.inherited(arguments);
        },

        getValue: function() {
            return this.value;
        },

        getLabel: function() {
            return this._containerNode.html();
        },

        setLabel: function(label) {
            this._containerNode.html(label);
        },

        setValue: function(value) {
            this.value = value;
        },

        _click: function(e) {
            utils.extend(e, { widget: this });

            this.trigger("click", e);
        }
    }, "omega.widgets.SelectOption");
});