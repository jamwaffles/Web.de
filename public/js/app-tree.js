var Tree = Backbone.Model.extend({
	title: undefined,
	children: '',
	initialize: function() {
		if(!(this.get('children') instanceof Backbone.Collection)) {
			this.set('children', new Backbone.Collection(this.get('children')));
		}
	}
});

var TopToggleRow = TableRow.extend({
	className: 'collapse-header'
});
var SubToggleRow = TopToggleRow.extend({
	classname: 'sub-collapse-header'
});

var TableTreeView = TableView.extend({
	className: 'tree'
});

var PackageTreeTable = TableTreeView.extend({
	className: 'package tree',
	tagName: 'table',
	columns: {
		'Package': function(model) {
			return model.get('format') + ' ' + model.get('name');
		},
		'Version': 'version',
		'Actions': function(model) {
			var form = $('<form />');

			$('<select />')
				.append([
					$('<option />').val('install').text('Install'),
					$('<option />').val('uninstall').text('Uninstall'),
					$('<option />').val('copy').text('Copy')
				])
				.appendTo(form);

			return form;
		}
	},
	initialize: function() {
		// Work out depth of tree

		// Prepend [depth] number of empty columns to this.columns for the toggle +/- icons
	},
	render: function() {
		var rows;

		// Header
		var header = $('<tr />');

		_.each(this.columns, function(func, heading) {
			$('<th />')
				.html(heading)
				.appendTo(header);
		}, this);

		this.$el.append(header);

		// Data
		

		return this;
	}
});

var testData = new Tree([
	new Package(),
	new Tree([
		new Package(),
		new Tree([
			new Package(),
			new Package()
		]),
		new Package()
	]),
	new Package(),
	new Package()
]);

var tree = new PackageTreeTable({
	model: testData
});

$('#container').html(tree.render().el);