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

	}
});

var Folder = Backbone.Model.extend({
	defaults: {
		title: 'Folder title',
		children: undefined
	},
	initialize: function() {
		console.log(this.get('title'), this.get('children'));

		if(!this.get('children') instanceof Backbone.Collection) {
			this.set('children', new Backbone.Collection(this.get('childen')));
		}
	}
});

var TreeView = Backbone.View.extend({

});

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

$('#container').html(view.el);