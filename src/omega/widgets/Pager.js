define([
    "omega/_Widget",
    "omega/dom/events",
    "text!./templates/Pager.html"
], function(_Widget, events, template) {

    return _Widget.extend({

        templateString: template,

        startup: function() {

            this.inherited(_Widget, arguments);

            events.on(this._prevNode, "click", this._prevClick, this);
            events.on(this._nextNode, "click", this._nextClick, this);

        },

        destroy: function() {

            this.inherited(_Widget, arguments);

            events.off(this._prevNode, "click", this._prevClick, this);
            events.off(this._nextNode, "click", this._nextClick, this);

        },

        setOptions: function(options) {

            var start = options.pageNumber * options.pageSize + 1,
                end = start + options.pageSize - 1;

            this._startNode.html(start);
            this._endNode.html(options.totalCount < end ? options.totalCount : end);
            this._totalResultsNode.html(options.totalCount);

            if (options.totalCount < options.pageSize) {
                this._prevNode.hide();
                this._nextNode.hide();
            } else {
                this._prevNode.show();
                this._nextNode.show();
            }

            if (start == 1)
                this._prevNode.addClass("disabled");
            else
                this._prevNode.removeClass("disabled");

            if (end >= options.totalCount)
                this._nextNode.addClass("disabled");
            else
                this._nextNode.removeClass("disabled");

            this._currentOptions = options;

        },

        getPageNumber: function() {
            if (this._currentOptions) {
                return this._currentOptions.pageNumber;
            }

            return 0;
        },

        _prevClick: function() {

            var results = this._currentOptions;

            if (results.pageNumber > 0) {

                this._currentOptions.pageNumber--;

                this.trigger("pagechange", { pageNumber: results.pageNumber });

            }

        },

        _nextClick: function() {

            var results = this._currentOptions;

            if (results.pageNumber < results.totalCount / results.pageSize) {

                this._currentOptions.pageNumber++;

                this.trigger("pagechange", { pageNumber: results.pageNumber });

            }

        }

    }, "omega.widgets.Pager");

});