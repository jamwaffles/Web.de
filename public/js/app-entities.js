var Package = Backbone.Model.extend({
	defaults: {
		format: 'tar',
		name: 'Package',
		version: '0.1.2',
		license: 'GPL v3',
		fullname: ''
	},
	initialize: function() {
		this.set('fullname', this.get('format') + ' ' + this.get('name') + ' ' + this.get('version'));
	},
	install: function() {
		console.log('Install', this.get('name'));
	},
	uninstall: function() {
		console.log('Uninstall', this.get('name'));
	},
	copy: function() {
		console.log('Copy');
	},
	fetch: function() {
		console.log("Fetch");
	}
});

var User = Backbone.Model.extend({
	defaults: {
		first: 'Firsty',
		middle: 'Middlen',
		last: 'Lastington',
		suffix: 'Mr',
		email: 'user@domain.org',
		mobiile: '07712345678',
		office: '01234567890',
		extension: '123',
		username: 'username123',
		href: '#',
		flags: {
			sms: true,
			email: true,
			disabled: false,
			expires: false
		}
	},
	initialize: function() {
		this.set('title', this.get('suffix') + ' ' + this.get('first') + ' ' + this.get('middle') + ' ' + this.get('last'));
		this.set('firstlast',  this.get('first') + ' ' + this.get('last'));
	}
});