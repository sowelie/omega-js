// Sets the require.js configuration for your application.
require.config({

	baseUrl: "js",

	// 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.8.2.min")
	paths: {

		"jquery": "empty:",
		"text": "../bower_components/requirejs-text/text"

	}

});