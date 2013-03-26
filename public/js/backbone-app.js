String.prototype.toTitleCase = function () {
	return this.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

var SoftwarePackage = Backbone.Model.extend({
	defaults: {
		format: 'tar',
		name: 'Software Package',
		version: '0.1.2'
	},
	install: function() {
		console.log('Install', this.get('name'));
	},
	uninstall: function() {
		console.log('Uninstall', this.get('name'));
	},
	copy: function() {
		console.log('Copy');
	},
	fetch: function() {
		console.log("Fetch");
	}
});

var PackageList = Backbone.Collection.extend({
	model: SoftwarePackage
});

var ModalView = Backbone.View.extend({
	modal: null,
	template: _.template($('#template-modal').html()),
	templateVars: {
		title: 'Modal Title',
		content: 'Content',
		buttons: ''
	},
	buttonConfig: { },
	events: { },
	initialize: function() {
		// Generate HTML from buttons object
		this.templateVars.buttons = _.map(this.buttonConfig, function(classes, text) {
			return $('<button />').text(text).addClass(classes)[0].outerHTML;
		}).join('');
	},
	render: function() {
		this.$el.html(this.template(this.templateVars));

		this.rendered = true;

		return this;
	},
	show: function() {
		if(!this.rendered) {
			$('body').append(this.render().el);
		}

		this.modal = this.$el.children().modal('show');
	}
});

var PackageConfirmModal = ModalView.extend({
	action: 'install',
	actionText: '',
	packageString: '',
	events: {
		'click .btn.cancel': 'cancelAction',
		'click .btn-primary': 'confirmAction'
	},
	buttonConfig: {
		'Cancel': 'btn cancel'
	},
	initialize: function() {
		this.actionText = this.action.toTitleCase();
		this.packageString = this.model.get('format') + ' ' + this.model.get('name') + ' ' + this.model.get('version');

		this.buttonConfig[this.actionText] = 'btn btn-primary';

		// Set title and contents
		_.extend(this.templateVars, {
			title: this.actionText + ' package',
			content: 'Do you really want to ' + this.action + ' ' + this.packageString + '?'
		});

		ModalView.prototype.initialize.apply(this, arguments);
	},
	confirmAction: function() {
		this.model[this.action]();

		this.modal.modal('hide');
	},
	cancelAction: function() {
		this.model[this.action]();

		this.modal.modal('hide');
	}
});

var PackageListItem = Backbone.View.extend({
	el: 'li',
	className: 'package',
	selectable: true,
	render: function() {
		var label = $('<label />').text(this.model.get('format') + ' ' + this.model.get('name') + ' ' + this.model.get('version'));

		if(this.selectable) {
			var checkbox = $('<input />')
				.prop('type', 'checkbox');

			label.prepend(checkbox);
		}

		this.$el.html(label);

		console.log(this.el);

		return this;
	}
});
var PackageListModal = ModalView.extend({

});

/* Sandbox */
var testPackage = new SoftwarePackage({
	format: 'bzip',
	name: 'Foobar',
	version: '3.2.1'
});

var listItem = new PackageListItem({
	model: testPackage
});
// $('body').html(listItem.render().el);

var modal = new PackageConfirmModal({
	model: testPackage,
	action: 'install'
});
// modal.show();