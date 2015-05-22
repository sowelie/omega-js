define([
	"omega/_Widget",
	"text!./templates/TreeView.html",
	"omega/widgets/TreeView"
], function(_Widget, template) {
	return _Widget.extend({
		templateString: template
	})
});