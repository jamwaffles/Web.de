/************
 * Accounts *
 ************/
var users = new Tree({
	children: [
		new Tree({
			title: 'Users',
			children: [
				new User(),
				new User(),
				new Tree({
					title: 'More users',
					children: [
						new User(),
						new User()
					]
				})
			]
		}),
		new User(),
		new User()
	]
});

var treeView = new TreeView({
	model: users
});

$('#users-list').html(treeView.render().el);

/************
 * Firmware *
 ************/
var firmwarePackages = new Backbone.Collection([
	new Package({ name: 'GNU', version: '1.4', license: 'GPL v3' }),
	new Package({ name: 'Busybox', version: '3.5.22', license: 'GPL v2', state: 'install' }),
	new Package({ name: 'Toolkit', version: '5.7', license: 'CPL v1|2' })
]);

var firmwareTable = new PackageTable({
	collection: firmwarePackages,
	className: 'table block table-striped table-hover'
});

$('#firmware-packages').html(firmwareTable.render().el);

/************
 * Hardware *
 ************/
var devices = new Tree([
	new Tree({
		title: 'Dell Dimension 8100',
		children: [
			new Tree({
				title: 'Video',
				children: [
					new Device({ manufacturer: 'nVidia', name: 'nVidia GTX 560 OC' })
				]
			}),
			new Tree({
				title: 'Audio',
				children: [
					new Device({ manufacturer: 'Creative', name: 'Sound Blaster Audigy SE' }),
					new Device({ manufacturer: 'Phillips', name: 'SBH 400 USB' })
				]
			})
		]
	}),
	new Tree({
		title: 'Butterfly Labs Jalapeno',
		children: [
			new Tree({
				title: 'Connectivity',
				children: [
					new Device({ manufacturer: 'BFL', name: 'Backplane 101-C' })
				]
			}),
			new Tree({
				title: 'Hashing Engines',
				children: [
					new Device({ manufacturer: 'BFL', name: 'ASIC 101-A' }),
					new Device({ manufacturer: 'BFL', name: 'ASIC 101-B' })
				]
			})
		]
	})
]);

$('#hardware-device').html(new TreeView({ 
	model: devices,
	nodeSelect: function(model, tree) {
		var propertiesTable = $(tree).closest('.row-fluid').find('table');
		var propertiesHeader = propertiesTable.prev();

		propertiesHeader.html(model.get('title'));

		var newTable = new TableView({
			className: 'table table-striped',
			columns: {
				'Field': function(model) {
					return $('<strong />').html(model.get('value')[0]);
				},
				'Value': function(model) {
					return model.get('value')[1];
				},
			},
			header: false,
			collection: model.get('properties')
		});

		propertiesTable.replaceWith(newTable.render().el);
	} 
}).render().el);