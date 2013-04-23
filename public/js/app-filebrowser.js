var testFiles = new Folder({
	children: [
		new Folder({
			title: 'Device',
			children: [
				new Folder({ title: 'bin' }),
				new Folder({ title: 'dev' }),
				new Folder({ title: 'etc' }),
				new Folder({ title: 'var' })
			]
		}),
		new Folder({
			title: 'Local',
			open: true,
			children: [
				new Folder({ title: 'Attached' }),
				new Folder({ 
					title: 'Data',
					open: true,
					children: [
						new Folder({ title: 'Audio' }),
						new Folder({ title: 'Desktop' }),
						new Folder({ title: 'Documents' }),
						new Folder({ 
							title: 'Video',
							open: true,
							children: [
								new Folder({ title: '80s classics' }),
								new Folder({ title: 'Alien Trilogy' }),
								new File({ name: 'Zoolander.mp4' })
							]
						})
					]
				})
			]
		}),
		new Folder({
			title: 'Network',
			children: [
				new Folder({ title: 'Apple' }),
				new Folder({ title: 'Linux' }),
				new Folder({ title: 'XiniX' }),
				new Folder({ 
					title: 'Windows',
					children: [
						new Folder({ title: 'ABCCopmany.local' }),
						new Folder({ title: 'Workgroup' })
					] 
				}),
				new Folder({ 
					title: 'Other',
					children: [
						new Folder({ title: 'GoDaddy' }),
						new Folder({ title: 'Office' }),
						new Folder({ title: 'Dreamhost FTP' }),
						new Folder({ title: 'Amazon S3 cloud' })
					] 
				})
			]
		}),
		new Folder({
			title: 'Backups',
			children: [
				new Folder({ 
					title: 'Server',
					children: [
						new File({ title: 'Backup 1' }),
						new File({ title: 'Backup 2' }),
					] 
				}),
				new Folder({ 
					title: 'Restore points',
					children: [
						new File({ title: 'Point 1' }),
						new File({ title: 'Point 2' }),
					] 
				}),
				new Folder({ title: 'Amazoon S3 storage' }),
				new Folder({ 
					title: 'LOF DPIES',
					children: [
						new Folder({ title: 'DBServer' }),
						new Folder({ 
							title: 'March 23, 2012 13:05',
							children: [
								new Folder({ title: 'Some_backed_up_dir' }),
								new Folder({ title: 'Other stuff' }),
								new File({ title: 'backedUpFile.txt' })
							]
						}),
						new Folder({ title: 'TSServer' }),
					] 
				})
			]
		}),
		new Folder({
			title: 'Duplicates',
			children: [
				new Folder({ 
					title: 'Software RAID',
					children: [
						new File({ title: '/dev/sda1' }),
						new File({ title: '/dev/sdb1' })
					]
				}),
				new Folder({ title: 'DPIES' }),	
				new Folder({ title: 'Net-GR3 Configs, docs, videos' }),	
			]
		})
	]
});

$('#files-main').html(new FileBrowser({ model: testFiles }).el);