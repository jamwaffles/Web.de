var Tree = Backbone.Model.extend({
	defaults: {
		children: undefined
	},
	initialize: function() {
		if(!(this.get('children') instanceof Backbone.Collection)) {
			this.set('children', new Backbone.Collection(this.get('children')));
		}
	}
});

var Folder = Backbone.Model.extend({
	defaults: {
		title: 'Folder title',
		children: undefined
	},
	initialize: function() {
		if(!(this.get('children') instanceof Backbone.Collection)) {
			this.set('children', new Backbone.Collection(this.get('children')));
		}
	}
});

var TreeListItem = Backbone.View.extend({
	tagName: 'ul',
	className: 'tree',
	render: function() {
		this.model.get('children').each(function(item) {
			if(item instanceof Folder) {
				// Make a new list
				$('<div />')
					.html(item.get('title'))
					.addClass('toggle')
					.appendTo(this.$el);

				this.$el.append(new TreeListItem({ model: item }).render().el);
			} else {
				// Render item
				var link = $('<a />')
					.prop('href', '#')
					.html(item.title)

				$('<li />')
					.append(link)
					.appendTo(this.$el);
			}
		}, this);

		return this;
	}
});

var TreeTableRow = TableRow.extend({
	depth: 2,
	columns: {
		'Package details': 'title',
		'Package name': 'name'
	},
	render: function() {
		for(var i = 0; i < this.depth; i++) {
			this.$el.append('<td />');
		}

		// $('<td />')
		// 	.html(this.model.get('fullname'))
		// 	.appendTo(this.$el);

		// $('<td />')
		// 	.html(this.model.get('name'))
		// 	.appendTo(this.$el);

		_.each(this.columns, function(title, field) {
			$('<td />')
				.html(this.model.get(field))
				.appendTo(this.$el);
		}, this);

		return this;
	}
});

var TreeTableHeader = TreeTableRow.extend({
	// columns: {
	// 	'Column': 'fullname'
	// },
	initialize: function(options) {
		this.columns = options.columns;
	},
	render: function() {
		for(var i = 0; i < this.depth; i++) {
			this.$el.append('<th />');
		}
		console.log(this.columns);
		_.each(this.columns, function(field, header) {
			$('<th />')
				.html(header)
				.appendTo(this.$el);
		}, this);

		return this;
	}
});

var TreeTableAccordionHeader = TreeTableRow.extend({
	className: 'accordion-header top',
	render: function() {
		$('<td />')
			.addClass('toggle-icon')
			.html($('<i />').addClass('icon-plus'))
			.appendTo(this.$el);

		$('<td />')
			.appendTo(this.$el);

		$('<td />')
			.prop('colspan', 100)
			.html(this.model.get('title'))
			.appendTo(this.$el);

		return this;
	}
});
var TreeTableAccordionSubHeader = TreeTableRow.extend({
	className: 'accordion-header sub',
	render: function() {
		$('<td />')
			.appendTo(this.$el);

		$('<td />')
			.addClass('toggle-icon')
			.html($('<i />').addClass('icon-plus'))
			.appendTo(this.$el);

		$('<td />')
			.prop('colspan', 100)
			.html(this.model.get('title'))
			.appendTo(this.$el);

		return this;
	}
});

// 2 level table display of tree data
var TreeTableView = TableView.extend({
	tagName: 'table',
	className: 'accordion',
	rowView: TreeTableRow,
	events: {
		'click .accordion-header.top': 'toggleTop',
		'click .accordion-header.sub': 'toggleSub'
	},
	toggleTop: function(e) {
		var self = $(e.currentTarget);
		var rows = self.nextUntil('.accordion-header:not(.sub)').filter('.row, .accordion-header');

		self.find('i').first().toggleClass('icon-plus icon-minus');
		self.toggleClass('expanded');

		if(self.hasClass('expanded')) {		// Show
			rows.filter('.accordion-header.sub').show();
			rows.filter('.row').not('.sub').show();

			// Re-show open sub-accordion items
			rows.filter('.accordion-header.expanded').nextUntil('.accordion-header, .row:not(.sub)').show();
		} else {							// Hide
			rows.hide();
		}
	},
	toggleSub: function(e) {
		var self = $(e.currentTarget);
		var rows = self.nextUntil(':not(.sub.row)');

		self.find('i').first().toggleClass('icon-plus icon-minus');
		self.toggleClass('expanded');

		rows.toggle();
	},
	render: function() {
		var subChildren = false;

		// Rows
		this.model.get('children').each(function(item) {
			if(item instanceof Folder) {
				// Sub-row header
				this.$el.append(new TreeTableAccordionHeader({ model: item }).render().el);

				// Loop through sub-rows and append
				item.get('children').each(function(subitem) {
					if(subitem instanceof Folder){
						this.$el.append(new TreeTableAccordionSubHeader({ model: subitem }).render().$el.hide());

						subitem.get('children').each(function(subsubitem) {
							this.$el.append(new this.rowView({ model: subsubitem, className: 'row sub', depth: 2 }).render().$el.hide());
						}, this);
					} else {
						this.$el.append(new this.rowView({ model: subitem, className: 'row' }).render().$el.hide());
					}
				}, this);
			} else {
				// Normal row
				this.$el.append(new this.rowView({ model: item }).render().el);
			}
		}, this);

		// Header
		this.$el.prepend(new TreeTableHeader({ 
			columns: this.columns
		}).render().el);

		return this;
	}
});

/* SANDBOX */
var simpler_data = {
	"children": [
		new Folder({
			"title": "Status Folder 1",
			"children": [ new Package({ name: "Sub 1" }), new Package({ name: "Sub 2" }) ]
		}),
		new Folder({
			title: "Top folder ",
			children: [
				new Folder({
					title: "Sub folder 1",
					children: [
						new Package({ name: "Sub sub 1 "}), new Package()
					]
				}),
				new Folder({
					title: "Sub folder 2",
					children: [
						new Package({ name: "Sub sub 2 "}), new Package()
					]
				}),
				new Package({ name: "Foobar 10 "}), 
				new Package({ name: "Foobar 20 "})
			]
		}),
		new Folder({
			"title": "Folder 2",
			"children": [ new Package({ name: "Ohai" }), new Package({ name: "sub 3" }), new Package() ]
		}),
		new Package({ name: "Top level 1" }),
		new Package({ name: "Top level 2" })
	]
};

tree = new Tree(simpler_data);

var view = new TreeTableView({
	model: tree
});

$('#container').html(view.render().el);