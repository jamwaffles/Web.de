var testFiles = new Folder({
	children: [
		new Folder({
			title: 'Device',
			children: [
				new Folder({
					title: 'dev',
					children: [
						new File({ name: 'ttyUSB0' }),
						new File({ name: 'tty0' }),
						new File({ name: 'ttyUSB0' }),
						new File({ name: 'tty0' })
					]
				})
			]
		}),
		new Folder({
			title: 'usr',
			children: [
				new File({ name: 'Test file 3' }),
				new File({ name: 'Test file 4' })
			]
		}),
		new Folder({
			title: 'Device',
			children: [
				new Folder({
					title: 'dev',
					children: [
						new File({ name: 'ttyUSB0' }),
						new File({ name: 'tty0' }),
						new File({ name: 'ttyUSB0' }),
						new File({ name: 'tty0' })
					]
				})
			]
		}),
		new Folder({
			title: 'usr',
			children: [
				new File({ name: 'Test file 3' }),
				new File({ name: 'Test file 4' })
			]
		})
	]
});

$('#files-main').html(new FileBrowser({ model: testFiles }).el);