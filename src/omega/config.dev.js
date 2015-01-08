// Sets the require.js configuration for your application.
require.config({

	baseUrl: "js",
	urlArgs: "bust=" +  (new Date()).getTime(),

	// 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.8.2.min")
	paths: {

		// Core Libraries
		"jquery": "lib/jquery/jquery",
		"jquery-easing": "lib/jquery/jquery-easing",
		"jquery-animate-enhanced": "lib/jquery/jquery-animate-enhanced",
		"text": "lib/require/text"

	}

});