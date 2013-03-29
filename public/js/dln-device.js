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