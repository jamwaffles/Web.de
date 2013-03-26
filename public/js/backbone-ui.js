var Package = Backbone.Model.extend({
	defaults: {
		format: 'tar',
		name: 'Package',
		version: '0.1.2'
	},
	initialize: function() {
		this.title = this.get('format') + ' ' + this.get('name') + ' ' + this.get('version');
	}
});

var Tree = Backbone.Model.extend({
	defaults: {
		children: undefined
	},
	initialize: function() {
		if(!(this.get('children') instanceof Backbone.Collection)) {
			this.set('children', new Backbone.Collection(this.get('children')));
		}
	}
});

var Folder = Backbone.Model.extend({
	defaults: {
		title: 'Folder title',
		children: undefined
	},
	initialize: function() {
		if(!(this.get('children') instanceof Backbone.Collection)) {
			this.set('children', new Backbone.Collection(this.get('children')));
		}
	}
});

var FolderView = Backbone.View.extend({
	tagName: 'ul',
	className: 'tree',
	initialize: function() {
		if(!(this.model.get('children') instanceof Backbone.Collection)) {
			this.model.set('children', new Backbone.Collection(this.model.get('children')));
		}
	},
	render: function() {
		this.model.get('children').each(function(item) {
			if(item instanceof Folder) {
				// Make a new list
				$('<div />')
					.html(item.get('title'))
					.addClass('toggle')
					.appendTo(this.$el);

				this.$el.append(new FolderView({ model: item }).render().el);
			} else {
				// Render item
				var link = $('<a />')
					.prop('href', '#')
					.html(item.title)

				$('<li />')
					.append(link)
					.appendTo(this.$el);
			}
		}, this);

		return this;
	}
});

var TreeView = Backbone.View.extend({
	tagName: 'ul',
	className: 'tree tree-top',
	initialize: function() {
		// this.render();
	},
	render: function() {
		this.model.get('children').each(function(item) {
			if(item instanceof Folder) {
				// Make a new sub list
				this.$el
					.append($('<li />')
					.html(new FolderView({ model: item }).render().el));
			} else {
				// Render item
				$('<li />')
					.text(item.title)
					.appendTo(this.$el);
			}
		}, this);

		return this;
	}
});

/* SANDBOX */
var simpler_data = {
	"children": [
		new Folder({
			"title": "Status Folder 1",
			"children": [ new Package(), new Package() ]
		}),
		new Folder({
			"title": "Folder 2",
			"children": [
				new Folder({
					"title": "Folder 3",
					"children": [ new Package(), new Package(), new Package() ]
				}),
				new Package()
			]
		}),
		new Package()
	]
};

tree = new Tree(simpler_data);

var view = new TreeView({
	model: tree
});

$('#container').html(view.render().el);