var Tree = Backbone.Model.extend({
	title: undefined,
	children: '',
	initialize: function() {
		if(!(this.get('children') instanceof Backbone.Collection)) {
			this.set('children', new Backbone.Collection(this.get('children')));
		}
	}
});

var TreeHeader = Backbone.View.extend({
	tagName: 'div',
	className: 'toggle',
	render: function() {
		this.$el.html(this.model.get('title'));

		return this;
	}
});

var TreeItem = Backbone.View.extend({
	tagName: 'li',
	render: function() {
		var li = $('<li />');

		if(this.model.get('href')) {
			$('<a />')
				.prop('href', '#')
				.html(this.model.get('title'))
				.appendTo(li);
		} else {
			$('<span />')
				.html(this.model.get('title'))
				.appendTo(li);
		}

		li.appendTo(this.$el);

		return this;
	}
});

var SubTreeView = Backbone.View.extend({
	tagName: 'ul',
	className: 'tree',
	render: function() {
		this.model.get('children').each(function(item) {
			var li = $('<li />');

			if(item instanceof Tree) {
				li.html(new TreeHeader({ model: item }).render().el);

				li.append(new SubTreeView({ model: item }).render().el);

				this.$el.append(li);
			} else {
				this.$el.append(new TreeItem({ model: item }).render().el);
			}
		}, this);

		return this;
	}
});

var TreeView = Backbone.View.extend({
	tagName: 'ul',
	className: 'tree tree-top',
	events: {
		'click div.toggle': 'toggleTree'
	},
	toggleTree: function(e) {
		var self = $(e.currentTarget);

		self.toggleClass('expanded');
		self.next('ul').toggle();
	},
	render: function() {
		this.model.get('children').each(function(item) {
			var li = $('<li />');

			if(item instanceof Tree) {
				li.html(new TreeHeader({ model: item }).render().el);

				li.append(new SubTreeView({ model: item }).render().el);

				this.$el.append(li);
			} else {
				this.$el.append(new TreeItem({ model: item }).render().el);
			}
		}, this);

		return this;
	}
});

/**************
 * Table tree *
 **************/
var TopToggleRow = TableRow.extend({
	className: 'collapse-header',
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
	className: 'tree'
});

var PackageTreeTable = TableTreeView.extend({
	className: 'package tree',
	tagName: 'table',
	rowView: PackageRow,
	depth: 0,
	columns: {
		'Package': function(model) {
			return model.get('format') + ' ' + model.get('name');
		},
		'Version': 'version',
		'Actions': function(model) {
			var form = $('<div />').addClass('form-inline');

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
	events: {
		'click .sub-collapse-header': 'subToggle',
		'click .collapse-header': 'toggle'
	},
	toggle: function(e) {
		var self = $(e.currentTarget);

		self.toggleClass('expanded');
		self.find('i').first().toggleClass('icon-plus icon-minus');

		if(self.hasClass('expanded')) {		// Show
			var rows = self.nextUntil('.collapse-header').filter('.collapse-row, .sub-collapse-header, .sub-collapse-row').show();

			// Hide closed sub-items
			rows.filter('.sub-collapse-header:not(.expanded)').each(function() {
				$(this).nextUntil(':not(.sub-collapse-row)').hide();
			});
		} else {		// Hide
			self.nextUntil('.collapse-header').filter('.collapse-row, .sub-collapse-header, .sub-collapse-row').hide();
		}
	},
	subToggle: function(e) {
		var self = $(e.currentTarget);

		self.toggleClass('expanded');
		self.find('i').first().toggleClass('icon-plus icon-minus');

		self.nextUntil(':not(.sub-collapse-row)').toggle();
	},
	render: function() {
		var rows = [];

		// Loop through top level model.children - non-collapsible items and top level headings
		this.model.get('children').each(function(item) {
			if(item instanceof Tree) {
				this.depth = 1;

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

		// Add expand/contract (or empty filler) cells
		_.each(rows, function(row) {
			for(var i = 0; i < this.depth; i++) {
				var cell = $('<td />');

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

/***********
 * Sandbox *
 ***********/
// var testData = new Tree({
// 	children: [
// 		new Package({ name: 'Uncollapsible package 1' }),
// 		new Tree({
// 			title: 'Top level item 1',
// 			children: [
// 				new Package({ name: 'Sub package 1' }),
// 				new Tree({
// 					title: 'Sub level 1',
// 					children: [
// 						new Package({ name: 'Sub sub package 1' }),
// 						new Package({ name: 'Sub sub package 2' })
// 					]
// 				}),
// 				new Tree({
// 					title: 'Sub level 2',
// 					children: [
// 						new Package({ name: 'Sub sub package 3' }),
// 						new Package({ name: 'Sub sub package 4' })
// 					]
// 				}),
// 				new Package({ name: 'Sub package 2' })
// 			]
// 		}),
// 		new Package({ name: 'Uncollapsible package 2' }),
// 		new Package({ name: 'Uncollapsible package 3' })
// 	]
// });

// var tree = new PackageTreeTable({
// 	model: testData
// });

// $('#local-software').html(tree.render().el);