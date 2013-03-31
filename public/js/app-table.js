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
		this.columns = options.columns !== undefined ? options.columns : this.columns;
		this.header = options.header !== undefined ? options.header : this.header;

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

/* Scheduled tasks table */
var ScheduledTasksTable = TableView.extend({
	className: 'scheduled-tasks',
	header: false,
	showAddNew: true,
	columns: {
		'Date': function(model) {
			return moment(model.get('time')).format('ddd MMMM Do');
		},
		'Time': function(model) {
			return moment(model.get('time')).format('h:mm A');
		},
		'Description': 'description',
		'Command': function(model) {
			return $('<code />').html(model.get('command'));
		},
		'Status': function(model) {
			switch(model.get('status')) {
				case 'ran':
					return 'Already run';
				case 'runing':
					return 'Running';
				default:
					return 'Not running';
			}
		}
	},
	initialize: function(options) {
		TableView.prototype.initialize.call(this, options);

		this.showAddNew = options.showAddNew !== undefined ? options.showAddNew : this.showAddNew;
	},
	render: function() {
		TableView.prototype.render.call(this, arguments);

		if(this.showAddNew) {
			var row = $('<tr />').addClass('add-new form-inline');

			// Date
			var date = $('<input />')
				.prop('name', 'date')
				.prop('type', 'text')
				.prop('placeholder', 'Date to run task')
				.addClass('datepicker');

			$('<td />').html(date).appendTo(row);

			// Time
			var hour = $('<select />').addClass('input-mini').prop('name', 'time-hour');

			for(var i = 0; i < 12; i++) {
				var text = ('0' + i).substr(-2);

				$('<option />').val(i).text(text).appendTo(hour);
			}

			var minute = $('<select />').addClass('input-mini').prop('name', 'time-minute');

			for(var i = 0; i < 60; i += 10) {
				var text = ('0' + i).substr(-2);

				$('<option />').val(i).text(text).appendTo(minute);
			}

			ampm = $('<select />')
				.addClass('input-mini')
				.prop('name', 'ampm')
				.append([
					$('<option />').val('am').text('AM'),
					$('<option />').val('pm').text('PM')
				]);

			$('<td />').html([ hour, ' : ', minute, ' ', ampm ]).appendTo(row);

			// Description
			$('<td />')
				.html($('<input />')
					.prop('type', 'text')
					.prop('name', 'description')
					.prop('placeholder', 'Description')
				)
				.appendTo(row);

			// Command
			$('<td />')
				// .html($('<textarea />')
				// 	.prop('name', 'command')
				// 	.prop('placeholder', 'Command(s) to run')
				// )
				.html($('<input />')
					.prop('type', 'text')
					.prop('name', 'command')
					.prop('placeholder', 'Command')
				)
				.appendTo(row);

			// Add button
			$('<td />')
				.html($('<button />')
					.addClass('btn btn-primary')
					.prop('name', 'save')
					.html('Add new task')
				)
				.appendTo(row);

			// Append to table
			this.$el.append(row);
		}

		return this;
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
