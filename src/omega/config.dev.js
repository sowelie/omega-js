// Sets the require.js configuration for your application.
require.config({

	baseUrl: "../src",
	urlArgs: "bust=" +  (new Date()).getTime(),

	// 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.8.2.min")
	paths: {

		// Core Libraries
		"jquery": "../bower_components/jquery/jquery",
		"text": "../bower_components/requirejs-text/text"

	}

});