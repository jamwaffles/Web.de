var Tree = Backbone.Model.extend({
	title: undefined,
	children: '',
	initialize: function(options) {
		if(options instanceof Array) {
			this.set('children', new Backbone.Collection(options));
		} else if(!(this.get('children') instanceof Backbone.Collection)) {
			this.set('children', new Backbone.Collection(this.get('children')));
		}
	},
	getNode: function(cid) {
		return _.findWhere(this.flatten(), { cid: cid });
	},
	flatten: function() {
		var flat = [];

		this.get('children').each(function(item) {
			if(item instanceof Tree) {
				flat = flat.concat(item.flatten());
			} else {
				flat.push(item);
			}
		});

		return flat;
	}
});

var FixedTreeHeader = Backbone.View.extend({
	tagName: 'div',
	className: 'fixed',
	render: function() {
		this.$el.html(this.model.get('title'));

		return this;
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
				.prop('href', '#' + this.model.cid)
				.html(this.model.get('title'))
				.data('cid', this.model.cid)
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
	top: true,
	events: {
		'click div.toggle': 'toggleTree',
		'click a': 'triggerAction'
	},
	initialize: function(options) {
		this.nodeSelect = options.nodeSelect;
	},
	toggleTree: function(e) {
		var self = $(e.currentTarget);

		self.toggleClass('expanded');
		self.next('ul').toggle();
	},
	triggerAction: function(e) {		// Triggered when any clickable item is... clicked
		var node = e.currentTarget;
		var cid = $(node).data('cid');
		var model = this.model.getNode(cid);

		if(model !== null && this.nodeSelect !== undefined && typeof this.nodeSelect === 'function') {
			this.nodeSelect.call(node, model, this.$el);
		}
	},
	render: function() {
		if(this.top && this.model.get('title') !== undefined) {
			this.$el.append(new FixedTreeHeader({ model: this.model }).render().el);
		}

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
		$('<div />')
			.addClass('span12')
			.html(this.model.get('title'))
			.appendTo(this.$el);

		return this;
	}
});

var SpanTreeTableSubToggle = SpanTableRow.extend({
	className: 'row-fluid sub-collapse-header',
	render: function() {
		$('<div />')
			.addClass('span12')
			.html(this.model.get('title'))
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
	depth: 0,
	events: {
		'click .sub-collapse-header': 'subToggle',
		'click .collapse-header': 'toggle'
	},
	initialize: function(options) {
		this.header = options.header !== undefined ? options.header : this.header;

		if(this.columnClasses.length != this.columns.length) {
			return false;
		}
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

		// Add expand/contract (or empty filler) cells
		_.each(rows, function(row) {
			for(var i = 0; i < this.depth; i++) {
				var cell = $('<div />').addClass('toggle-column');

				if(row.hasClass('collapse-header') && (i == 1 || this.depth == 1)) {
					$('<i />')
						.addClass('icon-plus')
						.appendTo(cell);
				} else if(row.hasClass('sub-collapse-header') && i == 0) {
					$('<i />')
						.addClass('icon-plus')
						.appendTo(cell);
				}

				cell.prependTo(row.children().first());
			}
		}, this);

		this.$el.html(rows);

		return this;
	}
});

/****************
 * Package tree *
 ****************/
var PackageTreeTable = SpanTableTreeView.extend({
	columnClasses: [ 'span3', 'span3', 'span3', 'span3' ],
	columns: {
		'Package': function(model) {
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

/******************************
 * Settings table (tree view) *
 ******************************/
var SettingsTreeTable = SpanTableTreeView.extend({
	header: false,
	columnClasses: [ 'span3', 'span3', 'span3', 'span3' ],
	columns: {
		'Setting': function(model) {
			return model.get('title');
		},
		'Value': function(model) {
			if(typeof model.get('values') == 'object') {		// Values - can be select box
				var select = $('<select />').prop('name', model.get('name'));

				_.each(model.get('values'), function(text, value) {
					var opt = $('<option />')
						.val(value)
						.html(text)

					if(value == model.get('value')) {
						opt.prop('selected', true);
					}

					opt.appendTo(select);
				});

				return select;
			} else if(typeof model.get('values') === 'string') {
				switch(model.get('values')) {
					case 'int':
					case 'float':
						return $('<input />')
							.prop('type', 'text')
							.val(model.get('value'));
					break;
					default:
						return $('<a />')
							.prop('href', '#')
							.html('Configure &raquo;');
				}
			} else {		// Generic "Configure" link
				return $('<a />')
					.prop('href', '#')
					.html('Configure &raquo;');
			}	
		}
	}
});

/****************************
 * Device (and group) tree  *
 ****************************/
var DeviceTreeTable = SpanTableTreeView.extend({
	header: false,
	columnClasses: [ 'span4', 'span2', 'span3', 'span3' ],
	columns: {
		'Device': 'title',
		'Serial': 'serial',
		'Mount point': function(model) {
			return $('<code />').text(model.get('mount'));
		},
		'Actions': function(model) {
			return $('<select />').html($('<option />').text("Actions go here"));
		}
	}
});

/************************
 * Network device tree  *
 ************************/
var NetworkTreeTable = SpanTableTreeView.extend({
	header: false,
	columnClasses: [ 'span4', 'span8' ],
	columns: {
		'Name': function(model) {
			return model.get('name');
		},
		'Comment': function(model) {
			return model.get('comment');
		}
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