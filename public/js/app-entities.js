var BaseModel = Backbone.Model.extend({
	
});

var Package = BaseModel.extend({
	defaults: {
		format: 'tar',
		name: 'Package',
		version: '0.1.2',
		license: 'GPL v3',
		licenseURL: 'http://www.gnu.org/licenses/gpl.html',
		fullname: '',
		state: 'uninstall'
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

var User = BaseModel.extend({
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

var Device = BaseModel.extend({
	defaults: {
		name: 'Generic 100',
		manufacturer: 'ACME Labs',
		href: '#',
		properties: {
			refresh: [ 'Refresh rate', '60Hz', [ '60Hz', '70Hz', '75Hz' ]],
			resolution: [ 'Resolution', '3840x1080' ],
			depth: [ 'Color depth', '32 bit' ],
			powersave: [ 'Powersaver', '15 minutes' ]
		}
	}, 
	initialize: function() {
		this.set('title', this.get('manufacturer') + ' ' + this.get('name'));
	}
});

var ScheduledTask = BaseModel.extend({
	defaults: { 
		command: 'command.sh',
		description: 'Scheduled task',
		status: '',
		time: new Date()
	}
});

var Setting = BaseModel.extend({
	defaults: {
		'name': 'setting',
		'title': 'Generic setting',
		'value': undefined
	},
	displayValue: function() {
		var value = this.get('value');

		if(typeof value == 'boolean') {
			value = value ? 'On' : 'Off'
		}

		return value;
	}
});

// var SettingsGroup = Backbone.Collection.extend({
// 	model: Setting
// });