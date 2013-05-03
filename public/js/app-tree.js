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
		this.$el.html($('<i />').addClass('icon-plus'));

		this.$el.append(this.model.get('title'));

		return this;
	}
});

var TreeItem = Backbone.View.extend({
	tagName: 'li',
	render: function() {
		var li = $('<li />');

		// Icon
		$('<i />')
			.addClass('icon-' + this.model.get('icon'))
			.prependTo(this.$el);

		if(this.model.get('href')) {
			$('<a />')
				.prop('href', '#' + this.model.cid)
				.html(this.model.get('title'))
				.data('cid', this.model.cid)
				.appendTo(this.$el);
		} else {
			$('<span />')
				.html(this.model.get('title'))
				.appendTo(this.$el);
		}

		return this;
	}
});

/* Item specific to process list */
var TreeHeaderProcess = TreeHeader.extend({
	template: _.template($('#template-process').html()),
	render: function() {
		this.$el.prepend($('<i />').addClass('icon-plus'));

		this.$el.append(this.template(this.model.toJSON()));

		return this;
	}
});
var TreeItemProcess = TreeItem.extend({
	top: false,
	template: _.template($('#template-process').html()),
	initialize: function(options) {
		this.top = options.top !== undefined ? options.top : this.top;
	},
	render: function() {
		if(this.top) {
			this.$el.prepend($('<i />').addClass('icon-blank'));
		}

		this.$el.append(this.template(this.model.toJSON()));

		return this;
	}
});

var SubTreeView = Backbone.View.extend({
	tagName: 'ul',
	className: 'tree',
	open: false,
	itemView: TreeItem,
	headerView: TreeHeader,
	initialize: function(options) {
		this.itemView = options.itemView || this.itemView;
		this.headerView = options.headerView || this.headerView;
	},
	render: function() {
		this.model.get('children').each(function(item) {
			var li = $('<li />');

			if(item instanceof Tree) {
				var header = new this.headerView({ model: item }).render().$el;
				var subtree = new SubTreeView({ model: item, itemView: this.itemView }).render().$el;

				if(this.model.get('open')) {
					header.addClass('expanded');
					subtree.show();
				}

				li.html([ header, subtree ]);

				this.$el.append(li);
			} else {
				this.$el.append(new this.itemView({ model: item }).render().el);
			}
		}, this);

		return this;
	}
});

var TreeView = Backbone.View.extend({
	tagName: 'ul',
	className: 'tree tree-top',
	open: false,
	itemView: TreeItem,
	headerView: TreeHeader,
	events: {
		'click div.toggle': 'toggleTree',
		'click a': 'triggerAction'
	},
	initialize: function(options) {
		this.itemView = options.itemView || this.itemView;
		this.headerView = options.headerView || this.headerView;

		this.nodeSelect = options.nodeSelect;
		this.open = options.open !== undefined ? options.open : this.open;
	},
	toggleTree: function(e) {
		var self = $(e.currentTarget);

		self.toggleClass('expanded');
		self.children('i').toggleClass('icon-plus icon-minus');
		self.next('ul').slideToggle(200);
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
		if(this.model.get('title') !== undefined) {
			this.$el.append(new FixedTreeHeader({ model: this.model }).render().el);
		}

		this.model.get('children').each(function(item) {
			var li = $('<li />');

			if(item instanceof Tree) {
				var header = new this.headerView({ model: item }).render().$el;
				var subtree = new SubTreeView({ model: item, itemView: this.itemView }).render().$el;

				if(this.model.get('open')) {
					header.addClass('expanded');
					header.children('i').toggleClass('icon-plus icon-minus');
					subtree.show();
				}

				li.html([ header, subtree ]);

				this.$el.append(li);
			} else {
				this.$el.append(new this.itemView({ model: item }).render().el);
			}
		}, this);

		return this;
	}
});

var ProcessSubTreeView = SubTreeView.extend({
	headerView: TreeHeaderProcess,
	itemView: TreeItemProcess,
	render: function() {
		this.model.get('children').each(function(item) {
			var li = $('<li />');

			if(item instanceof Tree) {
				var header = new this.headerView({ model: item.get('process') }).render().$el;
				var subtree = new ProcessSubTreeView({ model: item, itemView: this.itemView }).render().$el;

				if(this.model.get('open')) {
					header.addClass('expanded');
					subtree.show();
				}

				li.html([ header, subtree ]);

				this.$el.append(li);
			} else {
				this.$el.append(new this.itemView({ model: item }).render().el);
			}
		}, this);

		return this;
	}
});

var ProcessTreeView = TreeView.extend({
	headerView: TreeHeaderProcess,
	itemView: TreeItemProcess,
	className: 'tree tree-top process-tree',
	render: function() {
		if(this.model.get('title') !== undefined) {
			this.$el.append(new FixedTreeHeader({ model: this.model }).render().el);
		}

		this.model.get('children').each(function(item) {
			var li = $('<li />');

			if(item instanceof Tree) {
				var header = new this.headerView({ model: item.get('process') }).render().$el;
				var subtree = new ProcessSubTreeView({ model: item, itemView: this.itemView }).render().$el;

				if(this.model.get('open')) {
					header.addClass('expanded');
					header.children('i').toggleClass('icon-plus icon-minus');
					subtree.show();
				}

				li.html([ header, subtree ]);

				this.$el.append(li);
			} else {
				this.$el.append(new this.itemView({ model: item, top: true }).render().el);
			}
		}, this);

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