/****************
 * Package tree *
 ****************/
var PackageTreeTable = SpanTableTreeView.extend({
	checkboxes: true,
	columnClasses: [ 'span4', 'span3', 'span2', 'span3' ],
	events: {
		'change select': 'action',
		'click .sub-collapse-header': 'subToggle',
		'click .collapse-header': 'toggle',
		'click a.cancel': 'cancelAction'
	},
	action: function(e) {
		var self = $(e.currentTarget);
		var action = self.val();
		var form = self.parent();
		var progress = form.next();
		var model = this.model.getNode(self.data('id'));

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
		var model = this.model.getNode(form.find('select').data('id'));

		progress.fadeOut(function() {
			form.fadeIn();	
		});
	},
	columns: {
		'Package': function(model) {
			var a = $('<a />')
				.text(model.get('format') + ' ' + model.get('name'))
				.attr('data-toggle', 'modal')
				.prop('href', '#modal-dummy-package');

			return a;
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

/******************************
 * Settings table (tree view) *
 ******************************/
var SettingsTreeTable = SpanTableTreeView.extend({
	header: false,
	columnClasses: [ 'span3', 'span3', 'span3', 'span3' ],
	className: 'settings-tree container-fluid fluid-table tree-table hover',
	initialize: function() {
		this.events['click .btn-primary'] = 'configure';

		SettingsTreeTable.__super__.initialize.call(this, arguments);
	},
	configure: function() {
		$('#modal-dummy-configure').modal('show');
	},
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
						.html(text);

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
						return $('<button />')
							.text('Configure')
							.addClass('btn btn-primary');
				}
			} else {		// Generic "Configure" link
				return $('<button />')
					.text('Configure')
					.addClass('btn btn-primary');
			}	
		}
	}
});

/****************************
 * Device (and group) tree  *
 ****************************/
var DeviceTreeTable = SpanTableTreeView.extend({
	header: false,
	columnClasses: [ 'span4', 'span3', 'span2', 'span3' ],
	columns: {
		'Device': function(model) {
			if(model.get('uri')) {
				var a = $('<a />')
					.prop('href', model.get('uri'))
					.html(model.get('title'));

				if(model.get('newWindow')) {
					a.prop('target', 'mew');
				}

				return a;
			} else {
				return model.get('title');
			}
		},
		'Serial': 'serial',
		'Device file': function(model) {
			if(typeof model.get('mount') === 'string') {
				var div = $('<div />');

				// div.append([ $('<span />').text('/dev/'), ' ' ]);
				div.append($('<input />')
					.attr('value', model.get('mount').replace('/dev/', ''))
					.addClass('input-small')
					.prop('type', 'text'));

				return div.html();
			}
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
			var html;

			if(model.get('uri')) {
				html = $('<a />')
					.text(model.get('name'))
					.prop('href', model.get('uri'));

				if(model.get('newWindow')) {
					html.prop('target', 'new');
				}
			} else {
				html = model.get('name');
			}

			return html;
		},
		'Comment': function(model) {
			return model.get('comment');
		}
	}
});