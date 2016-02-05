define([
	"omega/widgets/BorderContainer",
	"omega/utils",
	"omega/dom/events",
	"jquery",
	"omega/widgets/Tab",
	"text!./templates/TabContainer.html"
], function(BorderContainer, utils, events, $, Tab, template) {

	return BorderContainer.extend({

		options: {
			autoPosition: true
		},

		initialize: function() {

			this.inherited(arguments);

			this._mixinTemplateStrings.push(template);

		},

		startup: function() {

			this.inherited(arguments);

			var tabs = this._containerNode.children(),
				tabCount = 0;

			tabs.each(utils.bind(function(index, element) {

				var $element = $(element),
					title = $element.attr("data-title"),
                    titleElement = $element.find("> span.title");

				if (title || titleElement.length > 0) {

					var tab = new Tab({ title: title || titleElement });

					this.addChild(tab);

					tab._domNode.append($element.children());
					tab._domNode.addClass($element.attr("class"));
				}

				$element.detach();

			}, this));

			this.layoutChildren();

		},

		destroy: function() {

            this.inherited(arguments);

			this._childWidgets.forEach(function(tab) {

				events.off(tab.header, "click", this._tabClick, this);

			}, this);

		},

		addChild: function(tab) {

			var tabCount = this._childWidgets.length,
				header = $("<li />").appendTo(this._headerNode);

			header.append($("<a />").html(tab.title));

			// store the header node
			tab._headerNode = header;

			// add the tab's content to the container node
			tab.startup();
			this._containerNode.append(tab._domNode);

			tab.hide();
			tab.addClass("tab-body");
			tab.on("click", this._tabClick, this);
			tab.on("show", this._tabShow, this);

			if (tabCount == 0) {
				tab.show();
			}

			this.inherited(arguments);

			return tab;

		},

		clear: function() {

			this._childWidgets.forEach(function(widget) {

				widget.destroy();

			}, this);

			this._childWidgets = [];

		},

		setSelectedIndex: function(index) {

			if (index >= 0 && this._childWidgets.length > index) {

				var tab = this._childWidgets[index];

				this._tabClick(tab);
				tab.show();

			}

		},

		getSelectedIndex: function() {

			if (this._selectedTab)
				return this._childWidgets.indexOf(this._selectedTab);

		},

		_tabClick: function(tab) {

			this._headerNode.find(".active").removeClass("active");
			this._containerNode.children(".tab-body").hide();

			this._selectedTab = tab;

		},

		_tabShow: function(tab) {

			this.trigger("tabselected", { tab: tab });

		},

		layoutChildren: function() {

			if (this.autoPosition) {
                this.inherited(arguments);
            }

		}

	}, "widgets.TabContainer");

});