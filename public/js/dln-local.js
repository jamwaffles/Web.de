/************
 * Attached *
 ************/
var localDevices = new Tree({
	children: [
		new Tree({
			title: 'Audio',
			children: [
				new Device({ name: 'Dave\'s iPod', serial: '1094820175', mount: '/dev/sda1' }),
				new Device({ name: 'Zune', serial: '0197-CD46-8PQR', mount: '/dev/sdb1' }),
			]
		}),
		new Tree({
			title: 'Printers &amp; Scanners',
			children: [
				new Device({ name: 'HP 895CSe', serial: '0sdf87shdf0', mount: '/dev/hp' }),
				new Device({ name: 'Mustek Bearpaw 1200 Plus', serial: '89DF:864C', mount: '/dev/scanner' })
			]
		}),
		new Tree({
			title: 'Storage',
			children: [
				new Device({ name: 'Seagate Lifebook 1TB', serial: 'SEAG-LB1TB', mount: '/dev/sdb1' }),
				new Device({ name: 'Kingston DataTraveller 16GB', serial: 'KGDT-16e9', mount: '/dev/sdc1' })
			]
		}),
		new Tree({
			title: 'Video',
			children: [
				new Device({ name: 'Nokia Lumia 820', serial: '8C4F673A', mount: '/dev/cam0' }),
				new Device({ name: 'Microsoft Lifecam Cinema', serial: 'MSLC-47638', mount: '/dev/video0' })
			]
		})
	]
});

var localDeviceTable = new DeviceTreeTable({
	model: localDevices
});

$('#local-attached').html(localDeviceTable.render().el);

/********
 * Data *
 ********/
// Nothing to do here yet

/************
 * Software *
 ************/
var software = new Tree({
	children: [
		new Tree({ title: 'Accessibility', children: [ new Package(), new Package() ] }),
		new Tree({ title: 'Development', children: [ new Package(), new Package() ] }),
		new Tree({ title: 'Education', children: [ new Package(), new Package() ] }),
		new Tree({ title: 'Games', children: [ new Package(), new Package() ] }),
		new Tree({ title: 'Miscellaneous', children: [ new Package(), new Package() ] }),
		new Tree({ title: 'Multimedia', children: [ new Package(), new Package() ] }),
		new Tree({ title: 'Network', children: [ new Package(), new Package() ] }),
		new Tree({ title: 'Productivity', children: [ new Package(), new Package() ] }),
		new Tree({ title: 'System', children: [ new Package(), new Package() ] }),
		new Tree({ title: 'Utilities', children: [ new Package(), new Package() ] })
	]
});

var softwareTable = new PackageTreeTable({
	header: false,
	model: software
});

$('#local-software').html(softwareTable.render().el);

/*************
 * Scheduled *
 *************/
var localTasks = new Backbone.Collection([
	new ScheduledTask({ command: 'ruby_clear_cache.sh', description: 'Backup', status: 'ran', time: new Date(2013, 2, 1, 18, 15, 0) }),
	new ScheduledTask({ command: 'sync_bitcoin.sh', description: 'Sync', status: 'running', time: new Date(2013, 3, 29, 14, 30, 0) })
]);

var localScheduled = new ScheduledTasksTable({
	collection: localTasks
});

$('#local-scheduled').html(localScheduled.render().el);

/************
 * Settings *
 ************/
var settings = new Tree({
	children: [
		new Tree({
			title: 'Account',
			children: [
				new Setting({ title: 'Language', value: 'en_US', values: { 'en_GB': 'English', 'en_US': 'English (US)', 'de_DE': 'Deutsch' } }),
				new Setting({ title: 'Keyboard', value: 'en_US', values: { 'en_GB': 'United Kingdom', 'en_US': 'United States', 'en_US_dvor': 'United States DVORAK' } }),
				new Setting({ title: 'Number format', value: 'en_US', values: { 'en_GB': 'United Kingdom', 'en_US': 'United States' } }),
				new Setting({ title: 'Currency', value: 'en_US', values: { 'en_US': '$ USD ($1234.56)', 'en_GB': '£ GBP (£1234.56)', 'de_DE': '€ GER (1234,56 €' } }),
				new Setting({ title: 'Date & Time', value: 'en_US', values: { 'en_US': 'US (28/10/2013 9:18 AM)', 'en_GB': '18/04/2013 9:18 AM', 'de_DE': 'Deutsch (2013-08-26 19:15)' } }),
				new Setting({ title: 'Sleep', value: '10', values: 'int' }),
				new Setting({ title: 'Theme', value: 'redmond', values: { 'murrina_orange': 'Murrina Orange', 'gnome': 'GOME Classic', 'redmond': 'Redmond' } }),
				new Setting({ title: 'Screensaver', value: 'bubbles', values: { 'pipes_1': 'Pipes', 'bubbles': 'Blubbles', 'patrick': 'Patric Star' } }),
			]
		}),
		new Tree({
			title: 'Software',
			children: [
				new Tree({
					title: 'SSH'
				}),
				new Tree({
					title: 'FileZilla'
				})
			]
		})
	]
});

$('#local-settings').html(new SettingsTreeTable({
	model: settings
}).render().el);