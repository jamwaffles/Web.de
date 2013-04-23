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

		this.setWidth(this.width);
	},
	render: function() {
		this.$el.html(new FilePaneHeader().el);

		this.$el.append(new FileTree({ model: this.model }).el)

		this.rendered = true;

		return this;
	},
	setWidth: function(width) {
		this.width = width;

		this.$el.css('width', this.width + '%');

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
	events: {
		'click .add': 'addPane',
		'click .removePane': 'removePane',
		'click .filepane': 'focusPane'
	},
	focusPane: function(e) {
		var self = $(e.currentTarget);

		// If add button, don't add focused class - the new pane needs to have that class instead
		if($(e.target).is('button.add') || $(e.target).closest('button.add').length) {
			console.log("Add");
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
		var paneIndex = pane.index();
		var newPane = new FilePane({ model: this.model, className: 'filepane new' });

		if(self.hasClass('left')) {
			pane.before(newPane.render().el);
		} else if(self.hasClass('right')) {
			pane.after(newPane.render().el);
		}

		this.$el.find('.filepane.focused').removeClass('focused');
		newPane.$el.addClass('focused');

		setTimeout(function() {
			newPane.$el.removeClass('new');
		}, 100);

		this.panes.splice(paneIndex, 0, newPane);
		this.numPanes++;
		this.setPaneWidths();
	},
	removePane: function(e) {
		var self = $(e.currentTarget);
		var pane = self.closest('.filepane');
		var paneIndex = pane.index();

		if(this.numPanes == 1) {
			return;
		}

		pane.remove();

		this.panes.splice(paneIndex - 1, 1);
		this.numPanes--;
		this.setPaneWidths();
	},
	initialize: function(options) {
		_.extend(this, options);

		for(var i = 0; i < this.numPanes; i++) {
			this.panes.push(new FilePane({ model: this.model }));
		}

		// this.panes[0].$el.addClass('focused');

		this.render();
	},
	render: function() {
		// Topbar
		this.$el.html(new FileBrowserTopBar().el);

		if(!this.rendered) {
			_.each(this.panes, function(pane) {
				this.$el.append(pane.setWidth(100 / this.numPanes).render().el);
			}, this);
		}

		this.rendered = true;

		return this;
	},
	setPaneWidths: function() {
		_.each(this.panes, function(pane) {
			pane.setWidth(100 / this.numPanes);
		}, this);
	}
});