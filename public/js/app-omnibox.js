/* Models */
// Search result
var SearchItem = Backbone.Model.extend({
	defaults: {
		name: "Result"
	}
});

/* Collections */
// Collection of search results
var ResultsList = Backbone.Collection.extend({
	model: SearchItem,
	comparator: function(result) {
		return result.get('name');
	}
});

/* Views */
// Search result
var SearchItemView = Backbone.View.extend({
	tagName: 'li',
	render: function() {
		$('<a />')
			.prop('href', '#')
			.html(this.model.get('name'))
			.appendTo(this.$el);

		return this;
	}
});

// Search result list
var ResultsView = Backbone.View.extend({
	tagName: 'ul',
	rendered: false,
	index: 0,
	render: function() {
		if(this.rendered) {
			this.$el.empty();
		}

		this.collection.each(function(item, itemIndex) {
			var props = { model: item };

			if(itemIndex == this.index) {
				props.className = 'selected';
			}

			this.$el.append(new SearchItemView(props).render().el);
		}, this);

		if(!this.rendered) {
			this.setSelected(0, false);
		}

		this.rendered = true;

		return this;
	},
	setSelected: function(index, delta) {
		var items = this.$el.children();

		if(delta === undefined || !delta) {
			this.index = index;
		} else {
			if(items.filter('.selected').length) {
				this.index = items.filter('.selected').index() + index;
			} else {
				this.index = index > 0 ? 0 : items.length - 1;
			}
		}

		// Clamp index between 0 and length of results
		this.index = Math.max(0, Math.min(this.index, items.length - 1));

		return this;
	},
	getSelected: function() {
		return this.collection.at(this.index);
	}
});

// Wrapping search box view
var Omnibox = Backbone.View.extend({
	rendered: false,
	resultsView: null,
	hidden: false,
	results: new Backbone.Collection,
	template: _.template($('#template-omnibox').html()),
	events: {
		'keyup input': 'searchChange',
		'click ul > li': 'searchClick'
	},
	initialize: function() {
		this.resultsView = new ResultsView;
	},
	searchChange: function(e) {
		var self = $(e.currentTarget);
		var searchTerm = self.val();
		
		if(e.which == 27 || (e.ctrlKey || e.altKey || e.shiftKey)) {
			if(!this.hidden) {
				this.hideResults();
			} else {
				self.val('');
			}

			return false;
		}

		if(searchTerm.length < 3) {
			this.hideResults();

			return false;
		}

		this.resultsView.collection = this.getMatches(searchTerm).results;

		switch(e.which) {
			case 40:		// Down
				this.resultsView.setSelected(1, true);
			break;
			case 38:		// Up
				this.resultsView.setSelected(-1, true);
			break;
			case 13:
				this.onSelect();

				return true;
			break;
		}

		this.render();
		this.showResults();
	},
	searchClick: function(e) {
		this.resultsView.setSelected($(e.currentTarget).index(), false);
		this.render();

		this.onSelect();
	},
	onSelect: function() {
		this.setValue(this.resultsView.getSelected().get('name'));

		this.hideResults();
	},
	render: function() {
		if(!this.rendered) {
			this.$el.html(this.template({ list: '' }));
		} else {
			this.$el.find('.results').html(this.resultsView.render().el);
		}

		this.rendered = true;

		return this;
	},
	setValue: function(value) {
		this.$el.find('input').val(value);
	},
	getMatches: function(searchTerm) {
		// Note: This should probably move to the collection's fetch() method when the API is used

		var numMatches = 0;
		var resultsList = [
			'foo',
			'bar',
			'baz',
			'Hello',
			'World',
			'England',
			'America',
			'Germany',
			'Scottland',
			'Canada',
			'300.1080p.rip.mkv',
			'Wreck.It.Ralph.1080p.mkv',
			'Step.On.It.720p.mkv',
			'Bars',
			'Barry McKinton\'s Movie For Drunks'
		];

		this.results.reset();

		_.each(resultsList, function(item) {
			if(item.match(new RegExp('.*' + searchTerm + '.*', 'i')) && numMatches < 10) {
				this.results.push({ name: item });

				numMatches++;
			}
		}, this);

		return this;
	},
	hideResults: function() {
		this.$el.find('.results').hide();
		this.$el.removeClass('open');

		this.hidden = true;
	},
	showResults: function() {
		if(this.$el.find('.results li').length) {
			this.$el.find('.results').show();
			this.$el.addClass('open');

			this.hidden = false;
		} else {
			this.hideResults();
		}
	}
});

/* Logic */
new Omnibox({
	el: '#omnibox'
}).render();