Number.prototype.toHuman = function() {
	if(this > 1000) {
		return this + ' KB';
	} else if(this > 1000000) {
		return this + ' MB';
	} else {
		return this + ' B';
	}
}

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
		permissionsString: '-rwxr-xr-x',
		owner: 'James'
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
		permissionsString: '-rwxr-xr-x'
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

		// Set paths of all children _only_ if this is the parent node (with no title)
		if(!this.get('title')) {
			this.setChildPaths();
		}
	},
	setChildPaths: function() {
		this.get('children').each(function(item) {
			if(item instanceof Folder) {
				item.set('path', this.get('path') + '/' + item.get('title'));

				item.setChildPaths();
			} else {
				item.set('path', this.get('path'));
			}
		}, this);
	},
	details: function() {
		return {
			'Permissions': this.get('permissionsString'),
			'Modified': moment(this.get('modified')).format('L'),
			'Created': moment(this.get('created')).format('L'),
		};
	}
});

var FileView = Backbone.View.extend({
	icon: null,
	template: _.template($('#template-filetree-file').html()),
	checkboxes: true,
	details: true,
	tagName: 'li',
	initialize: function() {
		this.render();
	},
	render: function() {
		// Details
		var detailsList = $('<span />').addClass('details');

		if(this.details) {
			_.each(this.model.details(), function(value, title) {
				$('<span />')
					.text(value)
					.prop('title', title)
					.appendTo(detailsList);
			});
		}

		this.$el.html(this.template({
			icon: iconMap[this.model.get('mime')],
			filename: this.model.get('name'),
			details: detailsList.html(),
			created: moment(this.model.get('created')).format('L HH:mm:ss'),
			modified: moment(this.model.get('modified')).format('L HH:mm:ss'),
			size: this.model.get('size'),
			owner: this.model.get('owner')
		}));

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
	template: _.template($('#template-filetree-folder').html()),
	initialize: function(options) {
		this.render();

		return this;
	},
	render: function() {
		if(!this.rendered) {
			// Details
			var detailsList = $('<span />').addClass('details');

			if(this.details) {
				_.each(this.model.details(), function(value, title) {
					$('<span />')
						.text(value)
						.prop('title', title)
						.appendTo(detailsList);
				});
			}

			this.$el.html(this.template({
				title: this.model.get('title'),
				icon: this.model.get('title') ? 'folder' : 'folder_open',
				filename: this.model.get('name'),
				details: detailsList.html(),
				created: moment(this.model.get('created')).format('L HH:mm:ss'),
				modified: moment(this.model.get('modified')).format('L HH:mm:ss'),
				children: 150,
				owner: this.model.get('owner')
			}));

			return this;
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
	},
	toggleTree: function(e) {
		var self = $(e.currentTarget);

		// Don't toggle tree if context menu button is clicked
		if($(e.target).hasClass('dropdown-toggle') || $(e.target).closest('.dropdown').length) {
			return;
		}

		self.next('ul').toggle();
		self.toggleClass('expanded');
		self.find('i').first().toggleClass('fam-folder fam-folder_open');
	},
	toggleCheckbox: function(e) {
		e.stopPropagation();

		var self = $(e.currentTarget);
		var li = self.closest('li');
		var state = self.prop('checked');
		var thisIndex = li.index();
		var that = li.siblings('.last-selected')
		var thatIndex = that.index();

		li.addClass('last-selected').siblings('.last-selected').removeClass('last-selected');

		self.closest('.toggle').next('ul').find('input[type="checkbox"]').prop('checked', state);

		if(e.shiftKey && thatIndex !== -1) {
			var rangeStart = Math.min(thisIndex, thatIndex);
			var rangeEnd = Math.max(thisIndex, thatIndex);
			var items = li.closest('ul').children();

			items.slice(rangeStart, rangeEnd).find('input[type="checkbox"]').prop('checked', state);
		}
	},
	render: function() {
		if(this.rendered) {
			return this;
		}

		// Title
		this.$el.append(new FolderTitle({ model: this.model }).el);

		// Children
		var ul = $('<ul />').addClass('sub');

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

		var ul = $('<ul />').addClass('sub').hide();

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