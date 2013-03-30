_.templateSettings = {
	interpolate : /\{\$(.+?)\}/g
};

$('[data-toggle="tooltip"]').tooltip();
$('#statusbar > ul').tooltip({
	placement: 'bottom',
	selector: '> li > a',
	container: '#statusbar'
});
$('input.slider').mrslyde({
	snap: false
});

$('table .datepicker').supercal({
	mode: 'popup'
}).on('dateselect', function(e, date) {
	var self = $(e.currentTarget);

	self.val(moment(date).format('L'));
});

// var modals = {
// 	confirmPackageAction: $('#confirm-package-action')
// };
// $('[name="package-actions"]').on('change', function() {
// 	// var pkg = ;
// 	var action = $(this).children(':selected').text();

// 	modals.confirmPackageAction

// 	modals.confirmPackageAction.modal({
// 		show: true
// 	});
// });

var container = $('#dln');
var panels = container.children();

var dln = {
	minWidth: panels.first().children().first().outerWidth(),
	numPanels: panels.length,
	duration: 600,
	easing: 'easeOutQuint'
}
dln.panelWidth = $(window).width() - (dln.minWidth * dln.numPanels);

// Initialise panels
panels.each(function(index) {
	$(this).css({ width: $(window).width() - (dln.minWidth * (dln.numPanels - 1)) });
	$(this).data('original-left', index * dln.minWidth);
	$(this).data('pushed-left', (index * dln.minWidth) + dln.panelWidth);

	$(this).css({ left: index * dln.minWidth });
});

$(window).on('resize', function() {
	dln.panelWidth = $(window).width() - (dln.minWidth * dln.numPanels);

	panels.each(function(index) {
		$(this).css({ width: $(window).width() - (dln.minWidth * (dln.numPanels - 1)) });

		$(this).data('pushed-left', (index * dln.minWidth) + dln.panelWidth);
	});

	panels.filter('.open').nextAll().each(function() {
		var panel = $(this);
		panel.css({ left: panel.data('pushed-left') });
	});
});

container.on('click', '.section-toggle', function(e) {
	var thisPanel = $(this).closest('li');

	if(thisPanel.hasClass('open')) {
		e.preventDefault();

		return;
	}
	
	thisPanel.addClass('open');
	thisPanel.siblings().removeClass('open');

	var prevPanels = thisPanel.prevAll();
	var nextPanels = thisPanel.nextAll();

	thisPanel.css({ left: thisPanel.data('original-left') });

	prevPanels.each(function() {
		var panel = $(this);
		panel.css({ left: panel.data('original-left') });
	});

	nextPanels.each(function(index) {
		var panel = $(this);
		panel.css({ left: panel.data('pushed-left') });
	});
});

// Open the first .open panel by default
$('#dln > li.default > a.section-toggle').first().trigger('click');

// Accordions
$('dl.accordion').children('dt.open').next('dd').show();

$('dl.accordion').on('click', '> dt:not(.href)', function() {
	$(this).toggleClass('open');
	var content = $(this).next('dd');

	content.slideToggle();

	$(this).siblings('dd').not(content).slideUp();
	$(this).siblings('dt.open').removeClass('open');
});

// Table "accordion"
$('table.accordion').on('click', 'tr.accordion-header', function() {
	$(this).find('i').first().toggleClass('icon-plus icon-minus');

	if(!$(this).hasClass('sub')) {		// Top level
		$(this).nextUntil('.accordion-header:not(.sub)').not('.sub-row').toggle();
	} else {		// Sub level
		$(this).nextUntil('.accordion-header').filter('.sub-row').toggle();
	}
});

// Tree views
// $('.tree').find('.toggle.expanded').next('ul').show();

// $('.tree.tree-top').on('click', '.toggle', function() {
// 	$(this).toggleClass('expanded');
// 	$(this).next('ul').toggle();
// });

/* Mouse scroll */
/* TODO: Plugin-ify and optimise */
// var scrollTargets = $('#dln > li > div > dl');
var scrollTargets = $('#dln div.actions > dl, .mouse-scroll-container > *');

$(document).on('mousemove', function(e) {
	var target = $(e.target);
	var container, scroller;
	var containerHeight, scrollerHeight;
	var margin = 100;

	scrollTargets.each(function() {
		if(target.closest($(this)).length) {
			container = $(this).parent();
			return;
		}
	});

	if(!container) {
		return;
	}

	scroller = container.children();

	containerHeight = container.height();
	scrollerHeight = scroller.height();

	if(scrollerHeight <= containerHeight) {
		return;
	}

	var rangeTop = container.offset().top + margin;
	var rangeBottom = rangeTop + containerHeight - (margin * 2);
	mousePos = e.pageY - rangeTop;
	mouseRatio = Math.max(0, Math.min(mousePos / (rangeBottom - rangeTop), 1));

	scrollTop = (scroller.outerHeight() - containerHeight) * mouseRatio;

	container.scrollTop(scrollTop);
});

/* Calendar sidebar thingy */
// Time
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

setInterval(function() {
	var now = new Date();

	$('.clock span').text(months[now.getMonth()] + ' ' + ('0' + now.getDate()).substr(-2) + ' ' + ('0' + now.getHours()).substr(-2) + ':' + ('0' + now.getMinutes()).substr(-2));

	$('#slideout-clock .calendar-time').text(moment().format('ddd MMM DD YYYY hh:mm A'));
}, 1000);

$('.calendar').supercal({
	footer: false
});

$('#slideout-clock .supercal').on('click', 'td', function() {
	var epoch = moment($(this).data('date'));

	$('#slideout-clock').find('.manual-date .date').html(epoch.format('MM/DD/YY'));
});

$('input[name="time-source"]').on('click', function() {
	var thisFieldset = $(this).parent().next('fieldset');
	var otherFieldsets = $(this).closest('form').find('fieldset').not(thisFieldset);

	thisFieldset.prop('disabled', false);
	otherFieldsets.prop('disabled', true);
});

/* Pairing slideout */
$('#slideout-pairing select[name="mode"]').on('change', function() {
	var inputs = $('#slideout-pairing').find('.sendonly');

	inputs.prop('disabled', $(this).val() == 'receive');
});

$('#slideout-pairing button[name="gen-pin"]').on('click', function(e) {
	e.preventDefault();

	var input = $('#slideout-pairing').find('[name="device-pin"]');

	input.val(parseInt(1000 + (Math.random() * 8999)));
});

/* Omnimenu */
$('#dln-menu > a').on('click', function() {
	$(this).parent().toggleClass('open');

	$('a[data-open]').removeClass('open');

	$('#dln').toggleClass('closed');
});

/* Statusbar menus */
$('a[data-open]').on('click', function(e) {
	var id = $(this).data('open');

	$(this).addClass('open');
	$('a[data-open]').not($(this)).removeClass('open');

	var thisPanel = $('.panel').filter(function() {
		return $(this).data('menu') === id;
	}).addClass('open');

	$('.panel').not(thisPanel).removeClass('open');

	$('#dln').addClass('closed');
	$('#dln-menu').removeClass('open');
});

/* Generic slideout from left/right sidebar */
$('a[data-slideout]').on('click', function(e) {
	var id = '#slideout-' + $(this).data('slideout');

	$(id).toggleClass('open');
	$(this).toggleClass('open');

	$('#statusbar > ul > li > a[data-slideout]').not($(this)).removeClass('open');
	$('.slideout').not(id).removeClass('open');
});

$('.slideout div.slideout-close a').on('click', function(e) {
	e.preventDefault();

	var id = $(this).closest('div.slideout').prop('id').replace('slideout-', '');

	$('a[data-slideout="' + id + '"]').trigger('click');

	window.location.hash = '';
});