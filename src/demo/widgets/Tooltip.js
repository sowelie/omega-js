define([
    "omega/_Widget",
    "omega/utils",
    "omega/widgets/Tooltip",
    "text!./templates/Tooltip.html"
], function(_Widget, utils, Tooltip, template) {

    return _Widget.extend({

        templateString: template,

        startup: function() {

            this.inherited(_Widget, arguments);

            var topTooltip = new Tooltip({ text: "top", position: "top", parentNode: document.body });
            topTooltip.attachTo(this._topButtonNode, false);

            var bottomTooltip = new Tooltip({ text: "bottom", position: "bottom", parentNode: document.body });
            bottomTooltip.attachTo(this._bottomButtonNode, false);

            var leftTooltip = new Tooltip({ text: "left", position: "left", parentNode: document.body });
            leftTooltip.attachTo(this._leftButtonNode, false);

            var rightTooltip = new Tooltip({ text: "right", position: "right", parentNode: document.body });
            rightTooltip.attachTo(this._rightButtonNode, false);

            var hoverTooltip = new Tooltip({ text: "hover", position: "bottom", parentNode: document.body });
            hoverTooltip.attachTo(this._hoverButtonNode, true);

            this._tooltips = [
                topTooltip,
                bottomTooltip,
                leftTooltip,
                rightTooltip,
                hoverTooltip
            ];

        },

        destroy: function() {
            this.inherited(_Widget, arguments);

            this._tooltips.forEach(function(tooltip) {
                tooltip.destroy();
            });
        }

    });

});