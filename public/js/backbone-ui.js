// Base objects
var BaseModel = Backbone.Model.extend({
	apiURL: '',
	fetch: function() {
		console.log("Fetching data");
	}
});
var BaseCollection = Backbone.Collection.extend({

});
var BaseView = Backbone.View.extend({

});

/* Models */
// User model
var User = BaseModel.extend({
	firstName: '',
	lastname: ''
	// Etc etc
});

// Software package
var Package = BaseModel.extend({
	defaults: {
		format: 'tar',
		name: 'Package',
		version: '0.1.2'
	},
	name: function() {
		return this.get('format') + ' ' + this.get('name') + ' ' + this.get('version');
	},
	install: function() {

	},
	uninstall: function() {

	},
	copy: function() {

	}
});

// Scheduled task
var Task = BaseModel.extend({
	command: 'run_comm.sh',
	running: false,
	description: 'Command',
	runAt: 1234567890,		// Epoch
	running: function() {
		return this.get('running');
	}
});

// Hardware item
var HardwareComponent = BaseModel.extend({
	properties: { }
});

/* Collections */
// List of components
var DeviceList = BaseCollection.extend({
	name: 'Hardware list',
	model: HardwareComponent
});

// Collapsible collection (can be nested)
var Tree = BaseCollection.extend({
	root: true,
	children: null
});

/* UI elements (views) */
/* Table row types */
// Table row
var TableRow = Backbone.View.extend({
	el: 'tr'
});

// Table row -> Package
var PackageRow = TableRow.extend({

});

// Table row -> Generic label/input (input/select/textarea/link)
var InputRow = TableRow.extend({

});

// Table row -> Scheduled
var ScheduleRow = TableRow.extend({
	editable: false
});

// Table row -> Device
var DeviceRow = TableRow.extend({

});

// Table row -> Collapse header
var CollapseHeaderRow = TableRow.extend({
	topLevel: true,
	rendered: false,
	render: function() {
		if(!this.rendered) {
			this.rendered = true;

			var row = this.$el;

			$('<td />')
				.html($('<i />').addClass('icon-plus'))
				.appendTo(row);

			if(this.topLevel) {
				$('<td />')
					.prependTo(row);
			}
		}

		return this;
	}
});

/* Table */
// Normal table
var TableView = Backbone.View.extend({
	columns: [
		'Column 1',
		'Column 2'
	],
	rowView: TableRow
});

// Collapsible table
var CollapsibleTable = TableView.extend({
	collection: null,
	hasCollapsibles: false,
	hasSubCollapsibles: false,
	events: {
		'click tr.accordion-header': 'collapse'
	},
	initialize: function() {
		this.collection.each(function(item) {
			if(item.) {

			}
		});	

		this.render();
	},
	collapse: function() {
		$(this).find('i').first().toggleClass('icon-plus icon-minus');

		if(!$(this).hasClass('sub')) {		// Top level
			$(this).nextUntil('.accordion-header:not(.sub)').not('.sub-row').toggle();
		} else {		// Sub level
			$(this).nextUntil('.accordion-header').filter('.sub-row').toggle();
		}
	},
	render: function() {
		// Header
		var thead = $('<thead />');

		_.each(this.columns, function(column), function() {

		});

		thead.appendTo(this.$el);

		// Rows
		var tbody = $('<tbody />');

		this.collection.each(function(item) {
			var row = $('<tr />');

			$('<td />').appendTo(row);

			if(!this.collection.root) {
				$('<td />').appendTo(row);
			}

			$('<td />')
				.text(item.name())
				.appendTo(row);

			row.appendTo(tbody);
		}, this);

		tbody.appendTo(this.$el);

		return this;
	}
});

// Collapsible table -> collapsible package table

/* Tree */
// Normal tree

// Table view -> Table tree

/* Form - must specify template (so many different layouts possible) */

// SANDBOX

var rows = new Tree([
	new Package(),
	new Package()
]);

var windowsNetwork = new CollapsibleTable({
	el: $('table#windowsNetwork'),
	collection: rows
});