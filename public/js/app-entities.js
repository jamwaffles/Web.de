_.templateSettings = {
	interpolate : /\{\$(.+?)\}/g
};

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
		state: 'uninstall',
		icon: ''
	},
	initialize: function() {
		this.set('fullname', this.get('format') + ' ' + this.get('name') + ' ' + this.get('version'));
	},
	install: function() {
		console.log('Install', this.get('name'));
	},
	remove: function() {
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
		icon: 'user',
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
		serial: '5UP3R-53R14L',
		mount: '/dev/mnt0',
		icon: 'hdd',
		uri: '',
		newWindow: false,
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

var NetworkDevice = BaseModel.extend({
	defaults: {
		ip: '192.168.0.1',
		uri: null,
		name: 'Network device',
		comment: 'Attached to the core router'
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
		'value': undefined,
		'values': undefined
	},
	displayValue: function() {
		var value = this.get('value');

		if(typeof value == 'boolean') {
			value = value ? 'On' : 'Off'
		}

		return value;
	}
});

var File = Backbone.Model.extend({
	defaults: {
		name: 'File',
		mime: 'text/plain',
		created: new Date,
		modified: new Date,
		size: 1234,
		path: '',
		permissions: 755,
		permissionsString: '-rwxr-xr-x',
		owner: 'James',
		group: 'administrators'
	},
	details: function() {
		return {
			// 'MIME': this.get('mime'),
			'Permissions': this.get('permissionsString'),
			'Modified': moment(this.get('modified')).format('L'),
			'Created': moment(this.get('created')).format('L')
		};
	}
});
var Symlink = Backbone.Model.extend({
	defaults: {
		source: '/path/to/symlink',
		name: 'Symlink',
		permissions: 755,
		permissionsString: '-rwxr-xr-x',
		owner: 'James',
		group: 'administrators'
	},
	details: function() {
		return {
			'Permissions': this.get('permissionsString'),
			'Modified': moment(this.get('modified')).format('L'),
			'Created': moment(this.get('created')).format('L')
		};
	}
});
var Folder = Backbone.Model.extend({
	defaults: {
		children: [],
		title: '/',
		mime: null,
		size: 4096,
		path: '',
		created: new Date,
		modified: new Date,
		permissions: 755,
		permissionsString: 'drwxr-xr-x',
		owner: 'James',
		group: 'administrators',
		open: false,
		numChildren: 0
	},
	initialize: function(options) {
		if(!(options.children instanceof Folder)) {
			this.set('children', new Backbone.Collection(options.children));
		}

		this.set('numChildren', this.get('children').length);

		// Set paths of all children _only_ if this is the root node
		if(this.get('root')) {
			this.setChildPaths();
		}
	},
	setChildPaths: function() {
		this.get('children').each(function(item) {
			if(item instanceof Folder) {
				item.set('path', this.get('path') + '/' + item.get('title'));

				item.setChildPaths();

				this.set('numChildren', this.get('numChildren') + item.get('numChildren'));
			} else {
				item.set('path', this.get('path'));
			}
		}, this);
	},
	details: function() {
		return {
			'Items': this.get('numChildren'),
			'Permissions': this.get('permissionsString'),
			'Modified': moment(this.get('modified')).format('L'),
			'Created': moment(this.get('created')).format('L'),
			'Owner': this.get('owner')
		};
	}
});

var Process = Backbone.Model.extend({
	defaults: {
		comm: 'nginx',
		pid: '316',
		user: 'root',
		ram: '1.2',
		cpu: '0.6',
		time: '00:00:01'
	}
});