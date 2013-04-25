Number.prototype.toHuman = function() {
	if(this > 1000) {
		return (this / 1000).toFixed(2) + ' KB';
	} else if(this > 1000000) {
		return (this / 1000000).toFixed(2) + ' MB';
	} else {
		return this + ' B';
	}
}

var iconMap = {
	'text/plain': 'page_white_text',
	'text/html': 'page_white_code',
	'text/javascript': 'script_code'
};

var FileView = Backbone.View.extend({
	icon: null,
	template: _.template($('#template-filetree-file').html()),
	checkboxes: true,
	details: true,
	tagName: 'li',
	className: 'file-wrapper',
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
			shortCreated: moment(this.model.get('created')).format('L'),
			modified: moment(this.model.get('modified')).format('L HH:mm:ss'),
			size: this.model.get('size').toHuman(),
			owner: this.model.get('owner'),
			group: this.model.get('group'),
			permissions: this.model.get('permissionsString')
		}));

		return this;
	},
	showExtras: function(show) {
		if(show) {
			this.$el.find('.extras').show();
		} else {
			this.$el.find('.extras').hide();
		}
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
				created: moment(this.model.get('created')).format('L HH:mm:ss'),
				modified: moment(this.model.get('modified')).format('L HH:mm:ss'),
				children: this.model.get('numChildren'),
				owner: this.model.get('owner')
			}));

			// If tree is pre-open, change folder icon to folder open icon
			if(this.model.get('open')) {
				this.$el.find('i').first().toggleClass('fam-folder fam-folder_open');
			}

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
	animate: true,
	events: {
		'click .toggle': 'toggleTree',
		'click input[type="checkbox"]': 'toggleCheckbox',
	},
	initialize: function() {
		this.model.set('open', true);

		this.render();
	},
	toggleTree: function(e) {
		var self = $(e.currentTarget);

		// Don't toggle tree if context menu button is clicked
		if($(e.target).hasClass('dropdown-toggle') || $(e.target).closest('.dropdown').length) {
			return;
		}

		if(this.animate) {
			self.next('ul').slideToggle(200);
		} else {
			self.next('ul').toggle();
		}

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

		var items;

		if(e.shiftKey && thatIndex !== -1) {
			var rangeStart = Math.min(thisIndex, thatIndex);
			var rangeEnd = Math.max(thisIndex, thatIndex);

			items = li.closest('ul').children().slice(rangeStart, rangeEnd);

			items.find('input[type="checkbox"]').prop('checked', state);
		} else if(!self.closest('.file').length) {
			items = self.closest('div.toggle').next('ul').find('.extras');

			state ? items.show() : items.hide();
		} else {
			var extras = self.closest('.file').find('.extras');

			state ? extras.show() : extras.hide();
		}
	},
	clearMousedown: function(e) {
		clearTimeout(this.mousedownTimer);
	},
	render: function() {
		if(this.rendered) {
			return this;
		}

		// Title
		this.$el.append(new FolderTitle({ model: this.model }).el);

		// Children
		var ul = $('<ul />').addClass('sub');

		if(!this.model.get('open')) {
			ul.hide();
		}

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
	className: 'folder-wrapper',
	initialize: function() {
		this.render();

		return this;
	},
	render: function() {
		// Title
		this.$el.append(new FolderTitle({ model: this.model }).el);

		var ul = $('<ul />').addClass('sub');

		if(!this.model.get('open')) {
			ul.hide();
		}

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