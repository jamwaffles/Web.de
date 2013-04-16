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
	className: 'filebrowser',
	// template: _.template($('#template-filebrowser-pane').html()),
	initialize: function() {
		this.render();
	},
	render: function() {
		this.$el.html(new FilePaneHeader().el);

		this.$el.append(new FileTree({ model: this.model }).el)

		this.rendered = true;

		return this;
	}
});

$('body').html(new FilePane({
	model: testFiles
}).el);