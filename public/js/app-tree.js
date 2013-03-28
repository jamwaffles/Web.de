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
	events: {
		'click .sub-collapse-header': 'subToggle',
		'click .collapse-header': 'toggle'
	},
	toggle: function(e) {
		var self = $(e.currentTarget);

		self.toggleClass('expanded');

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

		self.nextUntil(':not(.sub-collapse-row)').toggle();
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

		// Tree item depth counters
		var levelCounts = {
			first: 0,
			second: 0,
			third: 0
		};

		// Loop through top level model.children - non-collapsible items and top level headings
		this.model.get('children').each(function(item) {
			if(item instanceof Tree) {
				// Add top-level collapse headers
				this.$el.append(new TopToggleRow({ model: item, columns: this.columns }).render().el);

				// Loop through second level item.children - second-level items and sub-headings
				item.get('children').each(function(subitem) {
					if(subitem instanceof Tree) {
						// Add sub-level collapse headers
						this.$el.append(new SubToggleRow({ model: subitem, columns: this.columns }).render().$el.hide());

						// Loop through third level - all third level items (i.e. those under sub headings)
						subitem.get('children').each(function(subsubitem) {
							// Append normal row
							this.$el.append(new this.rowView({ model: subsubitem, columns: this.columns, className: 'sub-collapse-row' }).render().$el.hide());
						}, this);
					} else {
						// Append normal row
						this.$el.append(new this.rowView({ model: subitem, columns: this.columns, className: 'collapse-row' }).render().$el.hide());
					}
				}, this);
			} else {
				// Append normal row
				this.$el.append(new this.rowView({ model: item, columns: this.columns }).render().el);
			}
		}, this);

		return this;
	}
});

var testData = new Tree({
	children: [
		new Package({ name: 'Uncollapsible package 1' }),
		new Tree({
			title: 'Top level item 1',
			children: [
				new Package({ name: 'Sub package 1' }),
				new Tree({
					title: 'Sub level 1',
					children: [
						new Package({ name: 'Sub sub package 1' }),
						new Package({ name: 'Sub sub package 2' })
					]
				}),
				new Tree({
					title: 'Sub level 2',
					children: [
						new Package({ name: 'Sub sub package 3' }),
						new Package({ name: 'Sub sub package 4' })
					]
				}),
				new Package({ name: 'Sub package 2' })
			]
		}),
		new Package({ name: 'Uncollapsible package 2' }),
		new Package({ name: 'Uncollapsible package 3' })
	]
});

var tree = new PackageTreeTable({
	model: testData
});

$('#container').html(tree.render().el);