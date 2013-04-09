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
	columnClasses: [ 'span5', 'span2', 'span2', 'span3' ],
	header: false,
	checkboxes: true,
	events: {
		'change select': 'action',
		'click a.cancel': 'cancelAction'
	},
	action: function(e) {
		var self = $(e.currentTarget);
		var action = self.val();
		var form = self.parent();
		var progress = form.next();
		var model = this.collection.get(form.find('select').data('id'));
		
		if(!action) {
			return;
		}

		if(confirm('Really ' + action + ' ' + model.get('name') + '?')) {
			if(model[action] !== undefined) {
				model[action]();
			}

			form.hide();
			progress.html(new ActionProgressView({ value: 0.4 }).render().el).show();
		}
	},
	cancelAction: function(e) {
		var self = $(e.currentTarget);
		var progress = self.parent().parent();
		var form = progress.prev();
		var model = this.collection.get(form.find('select').data('id'));

		progress.fadeOut(function() {
			form.fadeIn();	
		});
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
			var form = $('<div />');

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
			return $('<div />').addClass('form-inline').html([ form, $('<div />').addClass('progress-container').hide() ]);
		}
	}
});

/* Scheduled tasks table */
var ScheduledTasksTable = SpanTable.extend({
	checkboxes: true,
	className: 'scheduled-tasks container-fluid fluid-table striped',
	columnClasses: [ 'span3', 'span5', 'span2', 'span2' ],
	header: false,
	showAddNew: true,
	columns: {
		'Command': function(model) {
			// return $('<code />').html(model.get('command'));

			return $('<input />')
				.prop('type', 'text')
				.prop('name', 'command')
				.prop('placeholder', 'Command');
		},
		'Epoch': function(model) {
			return moment(model.get('time')).format('ddd MMMM Do h:mm A');
		},
		'Queue': function(model) {
			return $('<input />')
				.prop('type', 'text')
				.addClass('input-mini')
				.val('a');
		},
		'Status': function(model) {
			switch(model.get('status')) {
				case 'ran':
					return 'Already run';
				case 'running':
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

			// Command
			$('<div />')
				.addClass(this.columnClasses[0])
				.html($('<input />')
					.prop('type', 'text')
					.prop('name', 'command')
					.prop('placeholder', 'Command')
				)
				.appendTo(row);

			// Date
			var date = $('<input />')
				.prop('name', 'date')
				.prop('type', 'text')
				.prop('placeholder', 'Date to run')
				.addClass('datepicker-popup input-small');

			// $('<div />').addClass(this.columnClasses[0]).html(date).appendTo(row);

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

			var second = $('<input />')
				.prop('name', 'seconds')
				.prop('type', 'text')
				.val('00')
				.addClass('input-mini');

			var ampm = $('<select />')
				.addClass('input-mini')
				.prop('name', 'ampm')
				.append([
					$('<option />').val('am').text('AM'),
					$('<option />').val('pm').text('PM')
				]);

			$('<div />').addClass(this.columnClasses[1]).html([ date, ' ', hour, ' : ', minute, ' : ', second, ' ', ampm ]).appendTo(row);

			// Queue
			$('<div />')
				.addClass(this.columnClasses[2])
				.html($('<input />')
					.prop('type', 'text')
					.prop('name', 'queue')
					.addClass('input-mini')
				)
				.appendTo(row);

			// Add button
			$('<div />')
				.addClass(this.columnClasses[3])
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