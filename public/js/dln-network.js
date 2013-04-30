/*********
 * Apple *
 *********/
// TODO

/*********
 * Linux *
 *********/
var linuxNetwork = new Tree({
	children: [
		new Tree({
			title: 'Direct',
			children: [
				new Tree({
					title: 'WD Nas',
					children: [
						new NetworkDevice({ newWindow: true, uri: 'files.html', name: 'Toms share', comment: '500GB' }),
						new NetworkDevice({ newWindow: true, uri: 'files.html', name: 'Nancys share', comment: '500GB' }),
						new NetworkDevice({ newWindow: true, uri: 'files.html', name: 'Public', comment: '500GB' })
					]
				}),
				new Tree({
					title: 'WD Nas Backup',
					children: [
						new NetworkDevice({ newWindow: true, uri: 'files.html', name: 'Toms share', comment: '500GB' }),
						new NetworkDevice({ newWindow: true, uri: 'files.html', name: 'Nancys share', comment: '500GB' }),
						new NetworkDevice({ newWindow: true, uri: 'files.html', name: 'Public', comment: '500GB' })
					]
				})
			]
		}),
		new Tree({
			title: '123company.com',
			children: [
				new Tree({
					title: 'WD Nas',
					children: [
						new NetworkDevice({ newWindow: true, uri: 'files.html', name: 'Toms share', comment: '500GB' }),
						new NetworkDevice({ newWindow: true, uri: 'files.html', name: 'Nancys share', comment: '500GB' }),
						new NetworkDevice({ newWindow: true, uri: 'files.html', name: 'Public', comment: '500GB' })
					]
				}),
				new Tree({
					title: 'WD Nas Backup',
					children: [
						new NetworkDevice({ newWindow: true, uri: 'files.html', name: 'Toms share', comment: '500GB' }),
						new NetworkDevice({ newWindow: true, uri: 'files.html', name: 'Nancys share', comment: '500GB' }),
						new NetworkDevice({ newWindow: true, uri: 'files.html', name: 'Public', comment: '500GB' })
					]
				})
			]
		})
	]
});

var linuxTable = new NetworkTreeTable({
	model: linuxNetwork
});

$('#network-linux').html(linuxTable.render().el);

/*********
 * XiniX *
 *********/
var xinixNetwork = new Tree({
	children: [
		new Tree({
			title: 'Expensive phones',
			children: [
				new Tree({
					title: 'Lumia 820',
					children: [
						new NetworkDevice({ newWindow: true,  uri: 'files.html', name: 'Pictures', comment: '' }),
						new NetworkDevice({ newWindow: true,  uri: 'files.html', name: 'Documents', comment: 'Company phone' })
					]
				}),
				new Tree({
					title: 'Nexus 4',
					children: [
						new NetworkDevice({ newWindow: true,  uri: 'files.html', name: 'Pictures', comment: '' })
					]
				})
			]
		}),
		new Tree({
			title: 'Music stuff',
			children: [
				new Tree({
					title: 'Headphones',
					children: [
						new NetworkDevice({ name: 'Philips SBH9000', comment: '' })
					]
				}),
				new Tree({
					title: 'Speakers',
					children: [
						new NetworkDevice({ name: 'Foxl G290 Speakers', comment: '' })
					]
				})
			]
		})
	]
});

var xinixTable = new NetworkTreeTable({
	model: xinixNetwork
});

$('#network-xinix').html(xinixTable.render().el);


/***********
 * Windows *
 ***********/
var windowsNetwork = new Tree({
	children: [
		new Tree({
			title: 'ABCCompany.local',
			children: [
				new Tree({
					title: 'Dan\'s PC',
					children: [
						new NetworkDevice({ name: 'Drive C', comment: '' }),
						new NetworkDevice({ name: 'Software', comment: '' }),
						new NetworkDevice({ name: 'HP 895c', comment: '' })
					]
				}),
				new Tree({
					title: 'Database server',
					children: [
						new NetworkDevice({ name: 'Shard 0', comment: '' }),
						new NetworkDevice({ name: 'Shard 1', comment: 'Down for maintenance' })
					]
				})
			]
		}),
		new Tree({
			title: 'Workgroup',
			children: [
				new Tree({
					title: 'James-WINDOWS',
					children: [
						new NetworkDevice({ name: 'Drive C', comment: '80% fragmented' }),
						new NetworkDevice({ name: 'Software', comment: '' }),
						new NetworkDevice({ name: 'KeySonic 83X keyboard', comment: '' })
					]
				}),
				new Tree({
					title: 'VS2010 Buildbot',
					children: [
						new NetworkDevice({ name: 'Drive C', comment: '80% fragmented' }),
						new NetworkDevice({ name: 'Drive D', comment: '' }),
						new NetworkDevice({ name: 'ARM build card', comment: '2x ARM9 CPUs' })
					]
				})
			]
		}),
	]
});

var windowsTable = new NetworkTreeTable({
	model: windowsNetwork
});

$('#network-windows').html(windowsTable.render().el);


/*********
 * Other *
 *********/
var otherNetwork = new Tree({
	children: [
		new Tree({
			title: 'Dialup',
			children: [
				new NetworkDevice({ name: 'AOL', comment: '' }),
				new NetworkDevice({ name: 'AT&T', comment: 'No signal in the south building. Or anywhere else.' }),
			]
		}),
		new Tree({
			title: 'SSH Tunnels',
			children: [
				new NetworkDevice({ name: 'Imgurian.org', comment: 'My VPS' }),
				new NetworkDevice({ name: 'Home NAS', comment: 'The WD box under the telly' }),
			]
		}),
		new Tree({
			title: 'VPN',
			children: [
				new NetworkDevice({ name: 'Tor', comment: '' }),
				new NetworkDevice({ name: 'A magical place', comment: '' }),
				new NetworkDevice({ name: 'Alice\'s rabbit hole', comment: 'Quite slow' }),
			]
		})
	]
});

var otherTable = new NetworkTreeTable({
	model: otherNetwork
});

$('#network-other').html(otherTable.render().el);