define([
	"omega/_Widget",
	"omega/utils",
	"jquery",
	"omega/dom/parser",
	"omega/dom/events",
	"omega/widgets/DOMWidget",
	"text!./templates/TableView.html"
],function(_Widget, utils, $, parser, events, DOMWidget, template) {

	return _Widget.extend({

		templateString: template,

		options: {
			displayHeaders: true,
			allowSelect: true
		},

		initialize: function() {

			this.inherited(_Widget, arguments);

			this._columnTemplates = [];

		},

		startup: function() {

			this.inherited(_Widget, arguments);

			// grab the column templates
			this._containerNode.find("> *").each(utils.bind(function(index, element) {

				element = $(element);

				this._columnTemplates.push({
					template: element.html(),
					label: element.attr("data-title"),
                    width: element.attr("data-width"),
                    updateValue: element.attr("data-update-value")
				});

			}, this));

			// remove the container node
			this._containerNode.detach();

			// draw the headers
			this._drawHeaders();

		},

        filter: function(filter) {
            this.eachChild(function(row) {
                var dataItem = row.data("dataItem"),
                    isMatch = true;

                for (var name in filter) {
                    if (dataItem[name].indexOf(filter[name]) == -1) {
                        isMatch = false;
                    }
                }

                if (!isMatch) {
                    row.hide();
                }
            }, this);
        },

        clearFilter: function() {
            this._bodyNode.children().show();
        },

		addColumn: function(template, label, width, updateValue) {

			this._columnTemplates.push({
				template: template,
				label: label,
				width: width,
                updateValue: updateValue
			});

		},

		clearColumns: function() {

			this._columnTemplates = [];

		},

		destroy: function() {

			this.inherited(_Widget, arguments);

			this._destroyRows();

		},

		clear: function() {

			this.clearColumns();
			this._destroyRows();
			this._drawHeaders();
			this._bodyNode.empty();

		},

		bind: function(data, idProperty) {

			this._destroyRows();
			this._drawHeaders();
			this._bodyNode.empty();

			// loop through each row
			data.forEach(function(item) {

				this.updateRow(item, idProperty, false);

			}, this);

		},

		bindPaged: function(data) {

			this.bind(data.list);

		},

        updateRow: function(item, idProperty, checkExists) {

            var row = null;

            // default checkExists to true
            if (typeof(checkExists) == "undefined") {
                checkExists = true;
            }

            // check to see if the table should be updated
            if (idProperty && checkExists) {

                var id = utils.bindField(item, idProperty);

                // find the row with the specified id
                this._childWidgets.some(function(otherRow) {

                    if (otherRow.attr("data-row-id") == id) {

                        row = otherRow;
                        return true;

                    }

                });

            }

            // if no row was found, create a blank one
            if (!row) {

                row = new DOMWidget({nodeName: "tr", parentNode: this._bodyNode});
                row.startup();
                row.on("click", this._rowClick, this);
                this.addChild(row);

            }

            if (idProperty) {
                row.attr("data-row-id", utils.bindField(item, idProperty));
            }

            // loop through each column
            this._columnTemplates.forEach(function(columnTemplate, index) {

                var value = utils.template(columnTemplate.template, item, true),
                    td = row.getChild(index),
                    updateValue = true,
                    triggerBind = false;

                if (typeof(columnTemplate.updateValue) != "undefined") {
                    updateValue = columnTemplate.updateValue == "true";
                }

                if (td == null) {

                    td = new DOMWidget({
                        nodeName: "td",
                        innerHTML: value
                    });

                    row.addChild(td);
                    triggerBind = true;

                } else if (updateValue) {

                    td.html(value);
                    triggerBind = true;

                }

				// find any child elements with an attach point
				td.find("*[data-cell-attach-point]").each(function() {
					var attachPoint = $(this).attr("data-cell-attach-point"),
						widget = $(this);

					if (widget.data("widget")) {
						widget = widget.data("widget");

						// make sure any events have helpful arguments
						widget._mixinArgs = { tableViewItem: item };
					}

					// set the cell attach point
					td["_" + attachPoint] = widget;
				});

                if (columnTemplate.width) {

                    td.css("width", columnTemplate.width + "px");
                    td.attr("title", value);

                }

                if (triggerBind) {
                    this.trigger("bindcell", {

                        cell: td,
                        row: row,
                        item: item,
                        label: columnTemplate.label

                    });
                }

            }, this);

            // store the item as a part of the row
            row.data("dataItem", item);

        },

		setSelectedIndex: function(index) {

			if (index >= 0 && index < this._childWidgets.length - 1) {

				this._setSelectedRow(this._childWidgets[index]);

			}

		},

		_rowClick: function(e) {

			this._setSelectedRow(parser.get($(e.target).parents("tr")));

		},

		_setSelectedRow: function(row) {

			if (this.allowSelect) {
				this._bodyNode.find("tr.bg-primary").removeClass("bg-primary");

				row.addClass("bg-primary");

				this.trigger("itemselected", {dataItem: row.data("dataItem"), row: row});
			}

		},

		_destroyRows: function() {

			this._childWidgets.forEach(utils.bind(function(element) {

				element.off("click", this._rowClick, this);
				element.destroy();

			}, this));

		},

		_drawHeaders: function() {

			this._headerNode.empty();

			if (this.displayHeaders) {

				this._headerNode.show();

				this._columnTemplates.forEach(function(column) {

					var header = $("<th />")
						.html(column.label)
						.attr("title", column.label)
						.data("columnTemplate", column)
						.addClass("btn-inverse")
						.appendTo(this._headerNode);

					if (column.width) {

						header.width(column.width);

						// set the layout to fixed
						this._tableNode.css("table-layout", "fixed");

						// add the name as a title
						header.attr("title", column.label);
					}

				}, this);

			} else {

				this._headerNode.hide();

			}

		}

	});

});