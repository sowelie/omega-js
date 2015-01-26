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

        setPagedResults: function(results) {

            var start = results.pageNumber * results.pageSize + 1,
                end = start + results.pageSize - 1;

            this._startNode.html(start);
            this._endNode.html(end);
            this._totalResultsNode.html(results.totalCount);

            if (start == 1)
                this._prevNode.hide();
            else
                this._prevNode.show();

            if (end >= results.totalCount)
                this._nextNode.hide();
            else
                this._nextNode.show();

            this._currentResults = results;

        },

        _prevClick: function() {

            var results = this._currentResults;

            if (results.pageNumber > 0) {

                this.trigger("pagechange", { pageNumber: results.pageNumber - 1 });

            }

        },

        _nextClick: function() {

            var results = this._currentResults;

            if (results.pageNumber < results.totalCount / results.pageSize) {

                this.trigger("pagechange", { pageNumber: results.pageNumber + 1 });

            }

        }

    }, "omega.widgets.Pager");

});