var iconMap = {
	'text/plain': 'page_white_text',
	'text/html': 'page_white_code',
	'text/javascript': 'script_code'
};

var File = Backbone.Model.extend({
	defaults: {
		name: 'File',
		mime: 'text/plain',
		created: new Date,
		modified: new Date,
		size: 1234,
		path: '',
		permissions: 755,
		permissionsString: '-rwxr-xr-x'
	},
	details: function() {
		return {
			'MIME': this.get('mime'),
			'Permissions': this.get('permissionsString'),
			'Modified': moment(this.get('modified')).format('L HH:mm:ss'),
			'Created': moment(this.get('created')).format('L HH:mm:ss'),
		};
	}
});
var Symlink = Backbone.Model.extend({
	defaults: {
		source: '/path/to/symlink',
		name: 'Symlink',
		permissions: 755,
		permissionsString: '-rwxr-xr-x'
	},
	details: function() {
		return {
			'Permissions': this.get('permissionsString'),
			'Modified': moment(this.get('modified')).format('L HH:mm:ss'),
			'Created': moment(this.get('created')).format('L HH:mm:ss'),
		};
	}
});
var Folder = Backbone.Model.extend({
	defaults: {
		children: [],
		title: '',
		mime: null,
		size: 4096,
		path: '',
		created: new Date,
		modified: new Date,
		permissions: 755,
		permissionsString: 'drwxr-xr-x'
	},
	initialize: function(options) {
		if(!(options.children instanceof Folder)) {
			this.set('children', new Backbone.Collection(options.children));
		}
	},
	details: function() {
		return {
			'Permissions': this.get('permissionsString'),
			'Modified': moment(this.get('modified')).format('L HH:mm:ss'),
			'Created': moment(this.get('created')).format('L HH:mm:ss'),
		};
	}
});

var FileView = Backbone.View.extend({
	icon: null,
	checkboxes: true,
	details: true,
	tagName: 'li',
	initialize: function() {
		this.icon = 'fam fam-' + iconMap[this.model.get('mime')];

		this.render();
	},
	render: function() {
		var link = $('<a />').prop('href', '#');

		// Checkbox
		if(this.checkboxes) {
			$('<input />')
				.prop('type', 'checkbox')
				.val('todo')
				.appendTo(link);
		}

		// Icon
		$('<i />')
			.addClass(this.icon)
			.appendTo(link);

		$('<span />')
			.text(this.model.get('name'))
			.appendTo(link);

		// Details
		if(this.details) {
			var details = $('<span />').addClass('details');

			_.each(this.model.details(), function(value, title) {
				$('<span />')
					.text(value)
					.prop('title', title)
					.appendTo(details);
			});

			details.appendTo(link);
		}

		this.$el.html(link);

		return this;
	}
});
var SymlinkView = FileView.extend({
	icon: 'link',
	initialize: function() { }
});
var FolderTitle = Backbone.View.extend({
	checkboxes: true,
	details: true,
	rendered: false,
	tagName: 'div',
	className: 'toggle',
	initialize: function(options) {
		this.render();

		return this;
	},
	render: function() {
		if(!this.rendered) {
			var title = $('<a />')
				.prop('href', '#')
				.text(this.model.get('title'));

			$('<i />')
				.addClass('fam ' + (this.model.get('title') === 'Root' ? 'fam-folder_open' : 'fam-folder'))
				.prependTo(title);

			if(this.checkboxes) {
				$('<input />')
					.prop('type', 'checkbox')
					.val('todo')
					.prependTo(title);
			}

			// Details
			if(this.details) {
				var details = $('<span />').addClass('details');

				_.each(this.model.details(), function(value, title) {
					$('<span />')
						.text(value)
						.prop('title', title)
						.appendTo(details);
				});

				details.appendTo(title);
			}

			this.$el.html(title);
		}

		this.rendered = true;

		return this;
	}
});

// File tree view
var FileTree = Backbone.View.extend({
	tagName: 'div',
	className: 'file-tree',
	rendered: false,
	checkboxes: true,
	details: true,
	events: {
		'click .toggle': 'toggleTree',
		'click input[type="checkbox"]': 'toggleCheckbox'
	},
	initialize: function() {
		this.render();

		return this;
	},
	toggleTree: function(e) {
		var self = $(e.currentTarget);

		self.next('ul').toggle();
		self.toggleClass('expanded');
		self.find('i').toggleClass('fam-folder fam-folder_open');
	},
	toggleCheckbox: function(e) {
		e.stopPropagation();

		var self = $(e.currentTarget);

		self.closest('.toggle').next('ul').find('input[type="checkbox"]').prop('checked', self.prop('checked'));
	},
	render: function() {
		if(this.rendered) {
			return this;
		}

		// Title
		this.$el.append(new FolderTitle({ model: this.model }).el);

		// Children
		var ul = $('<ul />');

		this.model.get('children').each(function(item) {
			if(item instanceof Folder) {
				ul.append(new FileSubTree({ model: item, checkboxes: this.checkboxes }).el);
			} else {
				ul.append(new FileView({ model: item, checkboxes: this.checkboxes }).el);
			}
		}, this);

		this.$el.append(ul);

		this.rendered = true;

		return this;
	}
});

// Sub-trees of a file tree
var FileSubTree = Backbone.View.extend({
	tagName: 'li',
	checkboxes: true,
	details: true,
	initialize: function() {
		this.render();

		return this;
	},
	render: function() {
		// Title
		this.$el.append(new FolderTitle({ model: this.model }).el);

		var ul = $('<ul />').hide();

		// Children
		this.model.get('children').each(function(item) {
			if(item instanceof Folder) {
				ul.append(new FileSubTree({ model: item, checkboxes: this.checkboxes }).el);
			} else {
				ul.append(new FileView({ model: item, checkboxes: this.checkboxes }).el);
			}
		}, this);

		this.$el.append(ul);

		return this;
	}
});

// Wrapping view for the whole lot
var BrowserPane = Backbone.View.extend({

});

// Logic
var testFiles = new Folder({
	title: '',
	children: [
		new Folder({
			title: 'Device',
			children: [
				new Folder({
					title: 'dev',
					children: [
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

$('body').html(new FileTree({
	model: testFiles
}).render().el);