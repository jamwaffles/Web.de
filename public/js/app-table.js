var TableRow = Backbone.View.extend({
	tagName: 'tr',
	cellData: {},
	rendered: false,
	initialize: function(options) {
		this.cellData = {};		// Really not sure why this has to be here

		options.columns = _.filter(options.columns, function(column, key) { return key !== null });

		_.each(options.columns, function(column, key) {
			if(typeof column === 'function') {
				this.cellData[column] = column.call(this.model, this.model);
			} else {
				this.cellData[column] = this.model.get(column);
			}
		}, this);
	},
	render: function() {
		if(!this.rendered) {
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
	columnClasses: [],
	header: true,
	rendered: false,
	initialize: function(options) {
		this.columns = options.columns !== undefined ? options.columns : this.columns;
		this.header = options.header !== undefined ? options.header : this.header;
		this.columnClasses = options.columnClasses !== undefined ? options.columnClasses : this.columnClasses;

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
				var index = 0;

				_.each(this.columns, function(func, heading) {
					var th = $('<th />')
						.html(heading);

					if(this.columnClasses[index] !== undefined) {
						th.addClass(this.columnClasses[index]);
					}

					th.appendTo(headerRow);

					index++;
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

var SpanTableHeader = Backbone.View.extend({
	tagName: 'div',
	className: 'thead row-fluid',
	columns: [],
	columnClasses: [],
	rendered: false,
	initialize: function(options) {
		this.cellData = {};		// Really not sure why this has to be here

		this.columns = _.keys(options.columns !== undefined ? options.columns : this.columns);
		this.columnClasses = options.columnClasses !== undefined ? options.columnClasses : this.columnClasses;
	},
	render: function() {
		if(!this.rendered) {
			_.each(this.columns, function(value, index) {
				$('<div />')
					.addClass(this.columnClasses[index])
					.html(value)
					.appendTo(this.$el);
			}, this);

			this.rendered = true;
		}

		return this;
	}
});

var SpanTableRow = Backbone.View.extend({
	tagName: 'div',
	className: 'row-fluid',
	cellData: {},
	columnClasses: [],
	rendered: false,
	checkbox: false,
	initialize: function(options) {
		this.cellData = {};		// Really not sure why this has to be here

		this.columns = _.keys(options.columns !== undefined ? options.columns : this.columns);
		this.columnClasses = options.columnClasses !== undefined ? options.columnClasses : this.columnClasses;
		this.checkbox = options.checkbox !== undefined ? options.checkbox : this.checkbox;

		_.each(options.columns, function(column, key) {
			if(typeof column === 'function') {
				this.cellData[column] = column.call(this.model, this.model);
			} else {
				this.cellData[column] = this.model.get(column);
			}
		}, this);
	},
	render: function() {
		if(!this.rendered) {
			var index = 0;

			_.each(this.cellData, function(value) {
				var cell = $('<div />')
					.addClass(this.columnClasses[index])
					.html(value)
					.appendTo(this.$el);

				if(this.checkbox && index == 0) {
					$('<label />')
						.html($('<input />').prop('type', 'checkbox'))
						.prependTo(cell);
				}

				index++;
			}, this);

			this.rendered = true;
		}

		return this;
	}
});

/* Table made out of Bootstrap columns (EUGH), required for headers in DLN Action headers */
var SpanTable = Backbone.View.extend({
	className: 'container-fluid fluid-table',
	tagName: 'div',
	columns: {},
	columnClasses: [],
	checkboxes: false,
	header: true,
	initialize: function(options) {
		this.columns = options.columns !== undefined ? options.columns : this.columns;
		this.header = options.header !== undefined ? options.header : this.header;
		this.columnClasses = options.columnClasses !== undefined ? options.columnClasses : this.columnClasses;
		this.checkboxes = options.checkboxes !== undefined ? options.checkboxes : this.checkboxes;

		if(this.columnClasses.length != this.columns.length) {
			return false;
		}

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
		// Header
		if(this.header) {
			this.$el.append(new SpanTableHeader({ columns: this.columns, columnClasses: this.columnClasses }).render().el);
		}

		// Data
		this.collection.each(function(item) {
			this.$el.append(new SpanTableRow({ model: item, checkbox: this.checkboxes, columns: this.columns, columnClasses: this.columnClasses }).render().el);
		}, this);

		return this;
	}
});

/* Packages table */
var PackageTable = SpanTable.extend({
	className: 'package container-fluid fluid-table striped hover',
	columnClasses: [ 'span3', 'span2', 'span2', 'span5' ],
	header: false,
	checkboxes: true,
	columns: {
		'Name': function(model) {
			return model.get('format') + ' ' + model.get('name');
		},
		'Version': function(model) {
			return $('<input />')
				.prop('type', 'text')
				.addClass('input-small')
				.val(model.get('version'));
		},
		'License': function(model) {
			if(model.get('licenseURL')) {
				return $('<a />').html(model.get('license')).prop('href', model.get('licenseURL')).prop('target', '_blank');
			} else {
				return model.get('license')
			}
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
var ScheduledTasksTable = SpanTable.extend({
	checkboxes: true,
	className: 'scheduled-tasks container-fluid fluid-table striped',
	columnClasses: [ 'span2', 'span3', 'span2', 'span3', 'span2' ],
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
		SpanTable.prototype.initialize.call(this, options);

		this.showAddNew = options.showAddNew !== undefined ? options.showAddNew : this.showAddNew;
	},
	render: function() {
		SpanTable.prototype.render.call(this, arguments);

		if(this.showAddNew) {
			var row = $('<div />').addClass('add-new form-inline row-fluid');

			// Date
			var date = $('<input />')
				.prop('name', 'date')
				.prop('type', 'text')
				.prop('placeholder', 'Date to run task')
				.addClass('datepicker input-medium');

			$('<div />').addClass(this.columnClasses[0]).html(date).appendTo(row);

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

			$('<div />').addClass(this.columnClasses[1]).html([ hour, ' : ', minute, ' ', ampm ]).appendTo(row);

			// Description
			$('<div />')
				.addClass(this.columnClasses[2])
				.html($('<input />')
					.prop('type', 'text')
					.prop('name', 'description')
					.prop('placeholder', 'Description')
					.addClass('input-medium')
				)
				.appendTo(row);

			// Command
			$('<div />')
				.addClass(this.columnClasses[3])
				.html($('<input />')
					.prop('type', 'text')
					.prop('name', 'command')
					.prop('placeholder', 'Command')
				)
				.appendTo(row);

			// Add button
			$('<div />')
				.addClass(this.columnClasses[4])
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