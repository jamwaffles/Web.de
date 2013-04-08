var TableRow = Backbone.View.extend({
	tagName: 'tr',
	cellData: {},
	rendered: false,
	initialize: function(options) {
		this.cellData = {};		// Really not sure why this has to be here

		options.columns = _.filter(options.columns, function(column, key) { return key !== null });

		_.each(options.columns, function(column, key) {
			if(typeof column === 'function') {
				this.cellData[column] = column.call(this, this.model);
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
				this.cellData[column] = column.call(this, this.model);
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