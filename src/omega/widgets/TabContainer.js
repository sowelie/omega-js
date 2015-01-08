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

			this.inherited(BorderContainer, arguments);

			this._mixinTemplateStrings.push(template);

		},

		startup: function() {

			this.inherited(BorderContainer, arguments);

			var tabs = this._containerNode.children(),
				tabCount = 0;

			tabs.each(utils.bind(function(index, element) {

				var $element = $(element),
					title = $element.attr("data-title");

				if (title) {

					var tab = new Tab({ title: title });

					this.addChild(tab);

					tab._domNode.append($element);
				}

			}, this));

			this.layoutChildren();

		},

		destroy: function() {


			this._childWidgets.forEach(function(tab) {

				events.off(tab.header, "click", this._tabClick, this);

			}, this);

		},

		addChild: function(tab) {

			var tabCount = this._childWidgets.length,
				header = $("<li />").addClass("ui-state-default ui-corner-top").appendTo(this._headerNode);

			header.append($("<a />").addClass("ui-tabs-anchor").html(tab.title));

			// store the header node
			tab._headerNode = header;

			// add the tab's content to the container node
			tab.startup();
			this._containerNode.append(tab._domNode);

			tab.hide();
			tab.addClass("ui-tab-body");
			tab.on("click", this._tabClick, this);
			tab.on("show", this._tabShow, this);

			if (tabCount == 0) {

				tab.show();

			}

			this.inherited(BorderContainer, arguments);

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

			this._headerNode.find(".ui-tabs-active").removeClass("ui-tabs-active ui-state-active");
			this._containerNode.children(".ui-tab-body").hide();

			this._selectedTab = tab;

		},

		_tabShow: function(tab) {

			this.trigger("tabselected", { tab: tab });

		},

		layoutChildren: function() {

			if (this.autoPosition)
				this.inherited(BorderContainer, arguments);

		}

	}, "widgets.TabContainer");

});