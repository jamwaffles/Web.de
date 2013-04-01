/************
 * Attached *
 ************/
var localDevices = new Tree({
	children: [
		new Tree({
			title: 'Audio',
			children: [
				new Device({ name: 'Dave\'s iPod', serial: '1094820175', mount: '/dev/sda1' }),
				new Device({ name: 'Zune', serial: '0197-CD46-8PQR', mount: '/dev/sdb1' })
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
	columns: [ 'span3', 'span3', 'span3', 'span3' ],
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