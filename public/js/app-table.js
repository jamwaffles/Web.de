var TableRow = Backbone.View.extend({
	tagName: 'tr',
	cellData: {},
	rendered: false,
	initialize: function(options) {
		this.cellData = {};		// Really not sure why this has to be here

		_.each(options.columns, function(column, key) {
			if(typeof column === 'function') {
				this.cellData[column] = column.call(this.model, this.model);
			} else {
				this.cellData[column] = this.model.get(column);
			}
		}, this);
	},
	render: function() {
		if(!this.renderd) {
			_.each(this.cellData, function(value) {
				$('<td />')
					.html(value)
					.appendTo(this.$el);
			}, this);

			this.rendered = true;
		}

		return this;
	}
});

var TableView = Backbone.View.extend({
	tagName: 'table',
	columns: {},
	header: true,
	rendered: false,
	initialize: function(options) {
		this.columns = options.columns || this.columns;
		this.header = options.header || this.header;

		if(!(options.collection instanceof Backbone.Collection)) {
			var newCollection = [];

			_.each(options.collection, function(value, key) {
				newCollection.push({
					key: key,
					value: value
				});
			});

			this.collection = new Backbone.Collection(newCollection);
		}
	},
	render: function() {
		if(!this.rendered) {
			this.rendered = true;

			// Header
			if(this.header) {
				var header = $('<thead />');
				var headerRow = $('<tr />');

				_.each(this.columns, function(func, heading) {
					$('<th />')
						.html(heading)
						.appendTo(headerRow);
				}, this);
				headerRow.appendTo(header);

				this.$el.append(header);
			}

			// Data
			this.collection.each(function(item) {
				this.$el.append(new TableRow({ model: item, columns: this.columns }).render().el);
			}, this);
		}

		return this;
	}
});

/* Packages table */
var PackageTable = TableView.extend({
	className: 'package',
	columns: {
		'Name': function(model) {
			return model.get('format') + ' ' + model.get('name');
		},
		'Version': 'version',
		'License': function(model) {
			return $('<a />')
				.prop('href', model.get('licenseURL'))
				.prop('target', '_blank')
				.html(model.get('license'));
		},
		'Actions': function(model) {
			var form = $('<div />').addClass('form-inline');

			var select = $('<select />').append([
				$('<option />').val('').text('Choose action...'),
				$('<option />').val('install').text('Install'),
				$('<option />').val('remove').text('Uninstall'),
				$('<option />').val('copy').text('Copy')
			]);

			select.children().filter(function() {
				return this.value == model.get('state');
			}).prop('disabled', true);

			select.appendTo(form);

			return form;
		}
	}
});

/* Sandbox */
// var packages = new Backbone.Collection([ 
// 	new Package({ name: "Pkg 1" }),
// 	new Package({ name: "Pockayche", version: "1.4.6" }),
// 	new Package(),
// 	new Package()
// ]);

// var table = new PackageTable({
// 	collection: packages
// });

// $('#local-software').html(table.render().el);
