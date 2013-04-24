/**************
 * Table tree *
 **************/
var TopToggleRow = TableRow.extend({
	className: 'collapse-header',
	initialize: function() { },
	render: function() {
		$('<td />')
			.html(this.model.get('title'))
			.prop('colspan', 100)
			.appendTo(this.$el);

		return this;
	}
});
var SubToggleRow = TopToggleRow.extend({
	className: 'sub-collapse-header',
	render: function() {
		$('<td />')
			.html(this.model.get('title'))
			.prop('colspan', 100)
			.appendTo(this.$el);

		return this;
	}
});

var TableTreeView = TableView.extend({
	className: 'tree',
	tagName: 'table',
	rowView: TableRow,
	depth: 0,
	events: {
		'click .sub-collapse-header i': 'subToggle',
		'click .collapse-header i': 'toggle'
	},
	toggle: function(e) {
		var self = $(e.currentTarget);
		var row = self.closest('.row-fluid');

		row.toggleClass('expanded');
		self.toggleClass('icon-plus icon-minus');

		if(row.hasClass('expanded')) {		// Show
			var rows = row.nextUntil('.collapse-header').filter('.collapse-row, .sub-collapse-header, .sub-collapse-row').show();

			// Hide closed sub-items
			rows.filter('.sub-collapse-header:not(.expanded)').each(function() {
				$(this).nextUntil(':not(.sub-collapse-row)').hide();
			});
		} else {		// Hide
			row.nextUntil('.collapse-header').filter('.collapse-row, .sub-collapse-header, .sub-collapse-row').hide();
		}
	},
	subToggle: function(e) {
		var self = $(e.currentTarget);
		var row = self.closest('.row-fluid');

		row.toggleClass('expanded');
		self.toggleClass('icon-plus icon-minus');

		row.nextUntil(':not(.sub-collapse-row)').toggle();
	},
	render: function() {
		var rows = [];

		// Loop through top level model.children - non-collapsible items and top level headings
		this.model.get('children').each(function(item) {
			if(item instanceof Tree) {
				if(this.depth === 0) {
					this.depth = 1;
				}

				// Add top-level collapse headers
				rows.push(new TopToggleRow({ model: item, columns: this.columns }).render().$el);

				// Loop through second level item.children - second-level items and sub-headings
				item.get('children').each(function(subitem) {
					if(subitem instanceof Tree) {
						this.depth = 2;

						// Add sub-level collapse headers
						rows.push(new SubToggleRow({ model: subitem, columns: this.columns }).render().$el.hide());

						// Loop through third level - all third level items (i.e. those under sub headings)
						subitem.get('children').each(function(subsubitem) {
							// Append normal row
							rows.push(new this.rowView({ 
								model: subsubitem, 
								columns: this.columns, 
								className: 'sub-collapse-row' 
							}).render().$el.hide());
						}, this);
					} else {
						// Append normal row
						rows.push(new this.rowView({ 
							model: subitem, 
							columns: this.columns, 
							className: 'collapse-row' 
						}).render().$el.hide());
					}
				}, this);
			} else {
				// Append normal row
				rows.push(new this.rowView({ 
					model: item,
					columns: this.columns 
				}).render().$el);
			}
		}, this);

		// Header
		if(this.header) {
			var header = $('<tr />');

			for(var i = 0; i < this.depth; i++) {
				$('<th />')
					.addClass('toggle-column')
					.appendTo(header);
			}

			_.each(this.columns, function(func, heading) {
				$('<th />')
					.html(heading)
					.appendTo(header);
			}, this);

			this.$el.html($('<thead />').html(header));
		}

		// Add expand/contract (or empty filler) cells
		_.each(rows, function(row) {
			for(var i = 0; i < this.depth; i++) {
				var cell = $('<td />');

				if(i == 0) {
					cell.addClass('toggle-column');
				}

				if(row.hasClass('collapse-header') && (i == 1 || this.depth == 1)) {
					$('<i />')
						.addClass('icon-plus')
						.appendTo(cell);
				} else if(row.hasClass('sub-collapse-header') && i == 0) {
					$('<i />')
						.addClass('icon-plus')
						.appendTo(cell);
				}

				cell.prependTo(row);
			}
		}, this);

		this.$el.append($('<tbody />').html(rows));

		return this;
	}
});

/*************************
 * Span-based table tree *
 *************************/
var SpanTreeTableToggle = SpanTableRow.extend({
	className: 'row-fluid collapse-header',
	render: function() {
		var titleHtml;

		if(this.model.get('uri')) {
			titleHtml = $('<a />')
				.text(this.model.get('title'))
				.prop('href', this.model.get('uri'));

			if(this.model.get('newWindow')) {
				titleHtml.prop('target', 'new');
			}
		} else {
			titleHtml = this.model.get('title');
		}

		$('<div />')
			.addClass('span12')
			.html(titleHtml)
			.appendTo(this.$el);

		return this;
	}
});

var SpanTreeTableSubToggle = SpanTableRow.extend({
	className: 'row-fluid sub-collapse-header',
	render: function() {
		var titleHtml;

		if(this.model.get('uri')) {
			titleHtml = $('<a />')
				.text(this.model.get('title'))
				.prop('href', this.model.get('uri'));

			if(this.model.get('newWindow')) {
				titleHtml.prop('target', 'new');
			}
		} else {
			titleHtml = this.model.get('title');
		}

		$('<div />')
			.addClass('span12')
			.html(titleHtml)
			.appendTo(this.$el);

		return this;
	}
});

var SpanTableTreeView = Backbone.View.extend({
	className: 'container-fluid fluid-table tree-table hover',
	tagName: 'div',
	columns: {},
	columnClasses: [],
	header: true,
	checkboxes: false,
	depth: 0,
	events: {
		'click i.sub-toggle': 'subToggle',
		'click i.toggle': 'toggle'
	},
	initialize: function(options) {
		this.header = options.header !== undefined ? options.header : this.header;

		if(this.columnClasses.length != this.columns.length) {
			return false;
		}
	},
	toggle: function(e) {
		var self = $(e.target);
		var row = self.closest('.row-fluid');

		row.toggleClass('expanded');
		self.toggleClass('icon-plus icon-minus');

		if(row.hasClass('expanded')) {		// Show
			var rows = row.nextUntil('.collapse-header').filter('.collapse-row, .sub-collapse-header, .sub-collapse-row').show();

			// Hide closed sub-items
			rows.filter('.sub-collapse-header:not(.expanded)').each(function() {
				$(this).nextUntil(':not(.sub-collapse-row)').hide();
			});
		} else {		// Hide
			row.nextUntil('.collapse-header').filter('.collapse-row, .sub-collapse-header, .sub-collapse-row').hide();
		}
	},
	subToggle: function(e) {
		var self = $(e.target);
		var row = self.closest('.row-fluid');

		self.toggleClass('icon-plus icon-minus');
		row.toggleClass('expanded');

		row.nextUntil(':not(.sub-collapse-row)').toggle();
	},
	render: function() {
		var rows = [];

		// Loop through top level model.children - non-collapsible items and top level headings
		this.model.get('children').each(function(item) {
			if(item instanceof Tree) {
				if(this.depth === 0) {
					this.depth = 1;
				}

				// Add top-level collapse headers
				rows.push(new SpanTreeTableToggle({ model: item, columns: this.columns }).render().$el);

				// Loop through second level item.children - second-level items and sub-headings
				item.get('children').each(function(subitem) {
					if(subitem instanceof Tree) {
						this.depth = 2;

						// Add sub-level collapse headers
						rows.push(new SpanTreeTableSubToggle({ model: subitem, columns: this.columns }).render().$el.hide());

						// Loop through third level - all third level items (i.e. those under sub headings)
						subitem.get('children').each(function(subsubitem) {
							// Append normal row
							rows.push(new SpanTableRow({ 
								model: subsubitem, 
								columns: this.columns, 
								columnClasses: this.columnClasses,
								className: 'row-fluid sub-collapse-row' 
							}).render().$el.hide());
						}, this);
					} else {
						// Append normal row
						rows.push(new SpanTableRow({ 
							model: subitem, 
							columns: this.columns, 
							columnClasses: this.columnClasses,
							className: 'row-fluid collapse-row' 
						}).render().$el.hide());
					}
				}, this);
			} else {
				// Append normal row
				rows.push(new SpanTableRow({ 
					model: item,
					columns: this.columns,
					columnClasses: this.columnClasses,
				}).render().$el);
			}
		}, this);

		// Header
		if(this.header) {
			rows.unshift(new SpanTableHeader({ columns: this.columns, columnClasses: this.columnClasses }).render().$el);
		}

		// Add expand/contract (or empty filler) cells, and checkboxes if enabled
		_.each(rows, function(row) {
			for(var i = 0; i < this.depth; i++) {
				var cell = $('<div />').addClass('toggle-column');

				if(row.hasClass('collapse-header') && (i == 1 || this.depth == 1)) {
					$('<i />')
						.addClass('icon-plus toggle')
						.appendTo(cell);
				} else if(row.hasClass('sub-collapse-header') && i == 0) {
					$('<i />')
						.addClass('icon-plus sub-toggle')
						.appendTo(cell);
				} else if(this.checkboxes) {
					cell = $('<label />');

					$('<input />')
						.prop('type', 'checkbox')
						.appendTo(cell);
				}

				cell.prependTo(row.children().first());
			}
		}, this);

		this.$el.html(rows);

		return this;
	}
});