define([], function() {
	
	var getStringValue = function(value) {
		
		if (typeof(value) == "object") {
			return JSON.stringify(value);
		}
		
		return value;
		
	};
	
	var getParsedValue = function(value) {
		
		try {
			return JSON.parse(value);
		} catch(ex) {
			return value;
		}
		
	};
	
	return function(key, value) {
		
		if (!localStorage)
			return;
		
		if (typeof(value) != "undefined")
			localStorage[key] = getStringValue(value);
		else
			return getParsedValue(localStorage[key]);
		
	};
	
});