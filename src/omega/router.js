define([
	"jquery",
	"./utils",
	"./loadingMessage",
	"./messageBus",
	"./dom/parser"
], function($, utils, loadingMessage, messageBus, parser) {

	return {

		_routes: { },
		_initialLoad: true,
		_currentRoute: "",

		add: function(name, page) {

			this._routes[name] = page;

		},

		initialize: function() {

			// execute the home route
			if (this._initialLoad) {
				this._initialLoad = false;

				var poundIndex = window.location.href.indexOf("#");

				// check to see if a route is in the anchor of the URL
				if (poundIndex >= 0)
					this.executeRoute(window.location.href.substring(poundIndex + 1));
				else
					this.executeRoute("home");
			}

			// find all links on the page
			$("a:link").each(utils.bind(function(index, element) {

				this.processLink(element);

			}, this));

		},

		processLink: function(element) {

			var $link = $(element);

			// check to see if the link has been initialized already
			if (!$link.data("router")) {

				// mark the link as having been initialized
				$link.data("router", { initialized: true });

				if ($link.attr("href").indexOf("#") == 0) {

					// when the link is clicked, show the appropriate page
					$link.click(utils.bind(function(e) {

						this.executeRoute($link.attr("href").substring(1));
						e.preventDefault();
						return false;

					}, this));

				}

			}

		},

		executeRoute: function(route, args) {

			if (route == this._currentRoute)
				return;

			var pageConstructor = this._routes[route];

			if (pageConstructor) {

				loadingMessage.show("Loading...");

				var page = new pageConstructor(args || {});
				page.initDomNode();

				parser.parse(page._domNode, page);

				if (page.isAsyncLoad) {
					// wire up to the load complete for any pages that have async loading
					page.on("loadComplete", function() {
						loadingMessage.hide();
						page.show();
					});

					page.startup();

				} else {
					loadingMessage.hide();
					page.startup();
					page.show();
				}

				this.initialize();
				this._currentRoute = route;

			}

			messageBus.publish("router/routeChanged", { rotue: route });

		},

		getCurrentRoute: function() {

			return this._currentRoute;

		}

	};

});