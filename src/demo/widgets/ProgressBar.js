define([
	"omega/_Widget",
	"omega/widgets/AlertDialog",
	"omega/utils",
	"text!./templates/ProgressBar.html",
	"omega/widgets/ProgressBar",
	"omega/widgets/Button",
	"omega/widgets/TextBox"
], function(_Widget, AlertDialog, utils, template) {

	return _Widget.extend({

		templateString: template,

		startup: function() {

			this.inherited(_Widget, arguments);

			this._runButtonNode.on("click", this._runClick, this);

		},

		destroy: function() {

			this.inherited(_Widget, arguments);

			this._runButtonNode.off("click", this._runClick, this);

		},

		_runClick: function() {

			var seconds = parseInt(this._runForNode.getValue());

			if (seconds) {

				this._progressNode.setValue(0);

				clearInterval(this._runInterval);

				this._progressNode.setIndeterminate(false);

				var totalSeconds = 0;

				this._runInterval = setInterval(utils.bind(function() {

					totalSeconds++;

					this._progressNode.setValue(Math.round(totalSeconds / seconds * 100));

					if (totalSeconds >= seconds) {

						this._progressNode.setValue(100);
						clearInterval(this._runInterval);

					}

				}, this), 1000);

			} else {

				new AlertDialog({ message: "Please enter a valid number of seconds.", destroyOnHide: true }).show();

			}

		}

	});

})