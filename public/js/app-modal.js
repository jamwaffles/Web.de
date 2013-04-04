// Todo

var Modal = Backbone.View.extend({
	title: 'Title',
	body: 'Body text',
	events: {
		'click .confirm': 'confirm',	
	},
	confirm: function(e) {
		console.log("Confirmed");
	},
	cancel: function(e) {
		console.log("Cancel");
	},
	render: function() {
		return this;
	}
});