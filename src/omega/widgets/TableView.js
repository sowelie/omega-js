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
			displayHeaders: true
		},

		initialize: function() {

			this.inherited(_Widget, arguments);

			this._columnTemplates = [];

		},

		startup: function() {

			this.inherited(_Widget, arguments);

			// grab the column templates
			this._containerNode.find("*").each(utils.bind(function(index, element) {

				element = $(element);

				this._columnTemplates.push({
					template: element.html(),
					label: element.attr("data-title")
				});

			}, this));

			// remove the container node
			this._containerNode.detach();

			// draw the headers
			this._drawHeaders();

		},

		addColumn: function(template, label, width) {

			this._columnTemplates.push({
				template: template,
				label: label,
				width: width
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

		bind: function(data) {

			this._destroyRows();
			this._drawHeaders();
			this._bodyNode.empty();

			// loop through each row
			data.forEach(function(item) {

				var row = new DOMWidget({ nodeName: "tr", parentNode: this._bodyNode });
				row.startup();

				// loop through each column
				this._columnTemplates.forEach(function(columnTemplate) {

					var value = utils.template(columnTemplate.template, item, true);

					var td = new DOMWidget({
						nodeName: "td",
						innerHTML: value
					});

					row.addChild(td);

					if (columnTemplate.width) {

						td.css("width", columnTemplate.width + "px");
						td.attr("title", value);

					}

					this.trigger("bindcell", {

						cell: td,
						item: item,
						label: columnTemplate.label

					});

				}, this);

				row.on("click", this._rowClick, this);

				// store the item as a part of the row
				row.data("dataItem", item);

				this.addChild(row);

			}, this);

		},

		bindPaged: function(data) {

			this.bind(data.list);

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

			this._bodyNode.find("tr.ui-state-focus").removeClass("ui-state-focus");

			row.addClass("ui-state-focus");

			this.trigger("itemselected", { dataItem: row.data("dataItem"), row: row });

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
						.data("columnTemplate", column)
						.addClass("ui-button-inverse")
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