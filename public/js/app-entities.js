var Package = Backbone.Model.extend({
	defaults: {
		format: 'tar',
		name: 'Package',
		version: '0.1.2',
		fullname: ''
	},
	initialize: function() {
		this.set('fullname', this.get('format') + ' ' + this.get('name') + ' ' + this.get('version'));
	}
});