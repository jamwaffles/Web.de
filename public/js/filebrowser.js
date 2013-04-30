var FilePaneHeader = Backbone.View.extend({
	rendered: false,
	className: 'header btn-group input-prepend input-append',
	template: _.template($('#template-filebrowser-header').html()),
	initialize: function() {
		this.render();
	},
	render: function() {
		if(!this.rendered) {
			this.$el.html(this.template());
		}

		this.rendered = true;

		return this;
	}
});

var FilePane = Backbone.View.extend({
	rendered: false,
	className: 'filepane',
	width: 100,
	initialize: function(options) {
		_.extend(this, options);
	},
	render: function() {
		this.$el.html(new FilePaneHeader().el);

		this.$el.append(new FileTree({ model: this.model }).el);

		this.rendered = true;

		return this;
	}
});

var FileBrowserTopBar = Backbone.View.extend({
	rendered: false,
	tagName: 'div',
	className: 'filebrowser-topbar',
	template: _.template($('#template-filebrowser-topbar').html()),
	initialize: function() {
		this.render();
	},
	render: function() {
		this.$el.html(this.template());

		return this;
	}
})

var FileBrowser = Backbone.View.extend({
	className: 'filebrowser',
	numPanes: 1,
	maxPanes: 5,
	rendered: false,
	panes: [],
	mousedownTimer: null,
	dragging: false,
	drag: {
		source: null,
		dest: null,
		clone: null,
		over: null,
		offset: { }
	},
	events: {
		'click .add': 'addPane',
		'click .removePane': 'removePane',
		'click .filepane': 'focusPane',
		'click .toggle, .file': 'stopDrag',
		'mouseup': 'stopDrag',
		'mousedown .file, .folder': 'startDrag',
		'mousemove': 'moveDrag',
		'mouseenter .toggle': 'dragEnter',
		'mouseleave .toggle': 'dragLeave'
	},
	startDrag: function(e) {
		if(e.button !== 0 || $(e.target).is('.dragging')) {
			return false;
		}

		this.drag.source = $(e.currentTarget);

		this.drag.clone = this.drag.source.clone();
		this.drag.clone.children().removeClass('drag-source');

		var self = this;

		e.preventDefault();

		this.mousedownTimer = setTimeout(function() {
			if(!self.dragging) {
				self.drag.source.addClass('drag-source');
				self.drag.clone
					.css({
						position: 'fixed',
						width: Math.min(500, self.drag.source.width())
					})
					.addClass('dragging')
					.appendTo(self.drag.source.closest('.file-tree'));

				self.dragging = true;

				self.drag.offset = {
					x: Math.min(e.pageX - self.drag.source.offset().left, 400),
					y: e.pageY - self.drag.source.offset().top
				}

				// Set initial position to be under the mouse
				self.drag.clone.css({
					left: e.pageX - self.drag.offset.x,
					top: e.pageY - self.drag.offset.y
				});
			}
		}, 150);
	},
	stopDrag: function(e) {
		clearTimeout(this.mousedownTimer);
		
		if(this.dragging) {
			this.dragging = false;
			this.drag.source.removeClass('drag-source');
			this.drag.clone.remove();
			
			var drops = this.$el.find('.drop-wrapper');

			if(drops.length) {
				drops.removeClass('drop-wrapper').children().removeClass('drag-source drag-drop-hover');

				this.$el.find('.was-hidden')
					.removeClass('was-hidden')
					.slideDown(100)

					.prev('.toggle')
					.children('i')
					.toggleClass('fam-folder_open fam-folder');

				if(this.drag.clone.hasClass('folder')) {
					drops.replaceWith(this.drag.source.parent().clone());

					this.drag.source.parent().remove();
				} else {
					this.drag.source.remove();
				}
			} else {
				this.$el.find('.was-hidden').removeClass('was-hidden').slideUp(100);
			}
		}
	},
	moveDrag: function(e) {
		if(this.dragging) {
			// Set position
			this.drag.clone.css({
				left: e.pageX - this.drag.offset.x,
				top: e.pageY - this.drag.offset.y
			});
		}
	},
	dragEnter: function(e) {
		if(this.dragging) {
			var self = $(e.currentTarget);

			// self.addClass('drag-target-hover');
			self.addClass('drag-focus');

			var ul = self.next('ul');
			var drop = $('<li />')
				.addClass('drop-wrapper')
				.html(this.drag.source
					.clone()
					.addClass('drag-drop-hover'));

			if(ul.children('.folder-wrapper').length) {
				ul.children('.folder-wrapper')
					.last()
					.after(drop);
			}  else if(ul.children('.file-wrapper').length) {
				ul.children('.file-wrapper')
					.last()
					.after(drop);
			} else {
				ul.prepend(drop);
			}

			if(!ul.is(':visible')) {
				ul.addClass('was-hidden').slideDown(100);
			}
		}
	},
	dragLeave: function(e) {
		if(this.dragging) {
			var self = $(e.currentTarget);

			self.removeClass('drag-focus');

			var ul = self.next('ul');

			ul.children('.drop-wrapper').remove();

			if(ul.hasClass('was-hidden')) {
				ul.removeClass('was-hidden').hide();
			}
		}
	},
	focusPane: function(e) {
		var self = $(e.currentTarget);

		// If add button, don't add focused class - the new pane needs to have that class instead
		if($(e.target).is('button.add') || $(e.target).closest('button.add').length) {
			e.preventDefault();

			return false;
		}

		this.$el.find('.filepane.focused').removeClass('focused');

		self.addClass('focused');
	},
	addPane: function(e) {
		// Only add if fewer than 5 panes
		if(this.numPanes >= this.maxPanes) {
			return;
		}

		var self = $(e.currentTarget);
		var pane = self.closest('.filepane');
		var paneIndex = pane.index() - 1;
		var newPane = new FilePane({ model: this.model, className: 'filepane new removed' });

		if(self.hasClass('left')) {
			pane.before(newPane.render().el);
		} else if(self.hasClass('right')) {
			pane.after(newPane.render().el);
		}

		this.$el.find('.filepane.focused').removeClass('focused');
		newPane.$el.addClass('focused');

		setTimeout(function() {
			newPane.$el.removeClass('new removed');
		}, 100);

		this.panes.splice(paneIndex, 0, newPane);
		this.numPanes++;
		this.setPaneWidths();
	},
	removePane: function(e) {
		var self = $(e.currentTarget);
		var pane = self.closest('.filepane');
		var paneIndex = pane.index() - 1;

		if(this.numPanes == 1) {
			return;
		}

		pane.remove();

		this.panes.splice(paneIndex, 1);
		this.numPanes--;
		this.setPaneWidths();
	},
	initialize: function(options) {
		_.extend(this, options);

		for(var i = 0; i < this.numPanes; i++) {
			this.panes.push(new FilePane({ model: this.model }));
		}

		this.panes[0].$el.addClass('focused');

		this.render();
	},
	render: function() {
		// Topbar
		this.$el.html(new FileBrowserTopBar().el);

		if(!this.rendered) {
			_.each(this.panes, function(pane) {
				this.$el.append(pane.render().el);
			}, this);

			this.setPaneWidths();
		}

		this.rendered = true;

		return this;
	},
	setPaneWidths: function() {
		this.$el.removeClass('panes1 panes2 panes3 panes4 panes5');

		this.$el.addClass('panes' + this.numPanes);
	}
});