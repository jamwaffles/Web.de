var TableRow = Backbone.View.extend({
	tagName: 'tr',
	cellData: {},
	initialize: function(options) {
		_.each(options.columns, function(column, key) {
			if(typeof column === 'function') {
				this.cellData[column] = column.call(this.model, this.model);
			} else {
				this.cellData[column] = this.model.get(column);
			}
		}, this);
	}	
});

var TableView = Backbone.View.extend({
	columns: {}
});

/* Packages table */
// Row view
var PackageRow = TableRow.extend({
	tagName: 'tr',
	render: function() {
		_.each(this.cellData, function(value) {
			$('<td />')
				.html(value)
				.appendTo(this.$el);
		}, this);

		return this;
	}
});

// Table
var PackageTable = TableView.extend({
	tagName: 'table',
	className: 'package',
	columns: {
		'Category': function(model) {
			return model.get('format') + ' ' + model.get('name');
		},
		'Version': 'version',
		'License': 'license',
		'Actions': function(model) {
			var form = $('<form />').addClass('form-inline');

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
		this.collection.each(function(item) {
			this.$el.append(new PackageRow({ model: item, columns: this.columns }).render().el);
		}, this);

		return this;
	}
});

var packages = new Backbone.Collection([ 
	new Package({ name: "Pkg 1" }),
	new Package({ name: "Pockayche", version: "1.4.6" }),
	new Package(),
	new Package()
]);

var table = new PackageTable({
	collection: packages
});

// $('#local-software').html(table.render().el);