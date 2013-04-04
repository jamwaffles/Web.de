var ProgressBar = Backbone.View.extend({
	tagName: 'div',
	className: 'progress progress-striped active',
	value: 0,
	initialize: function(options) {
		this.value = options.value !== undefined ? options.value : this.value;
	},
	render: function() {
		this.$el.html($('<div />').addClass('bar').css('width', (this.value * 100) + '%'));

		return this;
	}
});

var ActionProgressView = Backbone.View.extend({
	tagName: 'div',
	className: 'progress-wrapper progress-inline',
	value: 0,
	cancellable: true,
	events: {
		'click a.cancel': 'cancel'
	},
	initialize: function(options) {
		this.value = options.value !== undefined ? options.value : this.value;
	},
	setValue: function(value) {
		if(value > 1) {
			value /= 100;
		}

		this.value = value;
	},
	cancel: function(e) {
		var self = $(e.currentTarget);

		console.log("Cancel");
	},
	render: function() {
		this.$el.append(new ProgressBar({ value: this.value }).render().el);

		if(this.cancellable) {
			$('<a />')
				.prop('href', '#')
				.addClass('cancel')
				.html($('<i />').addClass('icon-ban-circle'))
				.appendTo(this.$el);
		}

		return this;
	}
});