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
	render: function() {
		this.collection.each(function(item) {
			this.$el.append(new SearchItemView({ model: item }).render().el);
		}, this);

		return this;
	}
});

// Wrapping search box view
var Omnibox = Backbone.View.extend({
	rendered: false,
	results: new Backbone.Collection,
	template: _.template($('#template-omnibox').html()),
	events: {
		'keyup input': 'searchChange'
	},
	searchChange: function(e) {
		var self = $(e.currentTarget);
		var searchTerm = self.val();

		if(searchTerm.length < 3 || e.which === 27) {
			this.hideResults();

			return false;
		}

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
			'Step.On.It.720p.mkv'
		];

		this.results.reset();

		_.each(resultsList, function(item) {
			if(item.match(new RegExp('.*' + searchTerm + '.*', 'i'))) {
				this.results.push({ name: item });
			}
		}, this);

		this.render();
	},
	render: function() {
		if(!this.rendered) {
			this.$el.html(this.template({ list: '' }));
		} else {
			this.$el.find('.results').html(new ResultsView({ collection: this.results }).render().el);
		}

		this.rendered = true;

		return this;
	},
	hideResults: function() {
		this.$el.find('.results').hide();
	},
	showResults: function() {
		this.$el.find('.results').show();
	}
});

/* Logic */
var omni = new Omnibox({
	el: '#omnibox'
});
omni.render();