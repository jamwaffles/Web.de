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
	hide: false,
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
		var self = this;

		this.$el.find('.progress').toggleClass('active progress-striped progress-warning');

		// Dummy fadeout effect
		setTimeout(function() {
			self.$el.fadeOut(function() {
				$(this).empty().html('Cancelled').fadeIn(function() {
					var msg = $(this);

					setTimeout(function() {
						msg.fadeOut();
					}, 1000);
				});
			});
		}, 500);
	},
	render: function() {
		this.$el.hide();

		this.$el.append(new ProgressBar({ value: this.value }).render().el);

		if(this.cancellable) {
			$('<a />')
				.prop('href', '#')
				.addClass('cancel')
				.html($('<i />').addClass('icon-ban-circle'))
				.appendTo(this.$el);
		}

		if(!this.hide) {
			console.log("fadein");
			this.$el.fadeIn();
		}

		return this;
	}
});

/* Packages table */
var PackageTable = SpanTable.extend({
	className: 'package container-fluid fluid-table striped hover',
	columnClasses: [ 'span3', 'span2', 'span2', 'span5' ],
	header: false,
	checkboxes: true,
	events: {
		'change select': 'action'
	},
	action: function(e) {
		var self = $(e.currentTarget);
		var action = self.val();
		var model = this.collection.get(self.data('id'));

		if(!action) {
			return;
		}

		if(confirm('Really ' + action + ' ' + model.get('name') + '?')) {
			if(model[action] !== undefined) {
				model[action]();
			}

			self.next().html(new ActionProgressView({ value: 0.4 }).render().el);
		}
	},
	columns: {
		'Name': function(model) {
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

			select.data('id', model.cid);

			select.appendTo(form);

			// Progress meter container
			form.append($('<div />').addClass('progress-container'));

			return form;
		}
	}
});

/* Scheduled tasks table */
var ScheduledTasksTable = SpanTable.extend({
	checkboxes: true,
	className: 'scheduled-tasks container-fluid fluid-table striped',
	columnClasses: [ 'span2', 'span3', 'span2', 'span3', 'span2' ],
	header: false,
	showAddNew: true,
	columns: {
		'Date': function(model) {
			return moment(model.get('time')).format('ddd MMMM Do');
		},
		'Time': function(model) {
			return moment(model.get('time')).format('h:mm A');
		},
		'Description': 'description',
		'Command': function(model) {
			return $('<code />').html(model.get('command'));
		},
		'Status': function(model) {
			switch(model.get('status')) {
				case 'ran':
					return 'Already run';
				case 'runing':
					return 'Running';
				default:
					return 'Not running';
			}
		}
	},
	initialize: function(options) {
		SpanTable.prototype.initialize.call(this, options);

		this.showAddNew = options.showAddNew !== undefined ? options.showAddNew : this.showAddNew;
	},
	render: function() {
		SpanTable.prototype.render.call(this, arguments);

		if(this.showAddNew) {
			var row = $('<div />').addClass('add-new form-inline row-fluid');

			// Date
			var date = $('<input />')
				.prop('name', 'date')
				.prop('type', 'text')
				.prop('placeholder', 'Date to run task')
				.addClass('datepicker input-medium');

			$('<div />').addClass(this.columnClasses[0]).html(date).appendTo(row);

			// Time
			var hour = $('<select />').addClass('input-mini').prop('name', 'time-hour');

			for(var i = 0; i < 12; i++) {
				var text = ('0' + i).substr(-2);

				$('<option />').val(i).text(text).appendTo(hour);
			}

			var minute = $('<select />').addClass('input-mini').prop('name', 'time-minute');

			for(var i = 0; i < 60; i += 10) {
				var text = ('0' + i).substr(-2);

				$('<option />').val(i).text(text).appendTo(minute);
			}

			ampm = $('<select />')
				.addClass('input-mini')
				.prop('name', 'ampm')
				.append([
					$('<option />').val('am').text('AM'),
					$('<option />').val('pm').text('PM')
				]);

			$('<div />').addClass(this.columnClasses[1]).html([ hour, ' : ', minute, ' ', ampm ]).appendTo(row);

			// Description
			$('<div />')
				.addClass(this.columnClasses[2])
				.html($('<input />')
					.prop('type', 'text')
					.prop('name', 'description')
					.prop('placeholder', 'Description')
					.addClass('input-medium')
				)
				.appendTo(row);

			// Command
			$('<div />')
				.addClass(this.columnClasses[3])
				.html($('<input />')
					.prop('type', 'text')
					.prop('name', 'command')
					.prop('placeholder', 'Command')
				)
				.appendTo(row);

			// Add button
			$('<div />')
				.addClass(this.columnClasses[4])
				.html($('<button />')
					.addClass('btn btn-primary')
					.prop('name', 'save')
					.html('Add new task')
				)
				.appendTo(row);

			// Append to table
			this.$el.append(row);
		}

		return this;
	}
});