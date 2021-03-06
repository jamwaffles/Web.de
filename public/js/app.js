$('[data-toggle="tooltip"]').tooltip();
$('#statusbar > ul').tooltip({
	placement: 'bottom',
	selector: '> li > a',
	container: '#statusbar'
});
$('input.slider').mrslyde({
	snap: false
});

$('.datepicker-popup').supercal({
	mode: 'popup',
	dayHeader: false
}).on('dateselect', function(e, date) {
	var self = $(e.currentTarget);

	self.val(moment(date).format('L'));
});

$(".gridster > ul").gridster({
	widget_margins: [10, 10],
	autogenerate_stylesheet: false/*,
	widget_base_dimensions: [140, 140]*/
});

// Pairing new group button
$('#slideout-pairing .new-group').on('click', function(e) {
	e.preventDefault();
	
	$(this).closest('.row-fluid').next('input').toggle();
});

// Toggle header/footer bars
$('#statusbar .bar-toggle, #footerbar .bar-toggle').on('click', function(e) {
	e.preventDefault();

	var bar = $(this).closest('#statusbar, #footerbar');

	if($(this).hasClass('left')) {
		if(bar.hasClass('hide-right')) {
			bar.removeClass('hide-left hide-right');
		} else {
			bar.addClass('hide-left');
		}
	} else {
		if(bar.hasClass('hide-left')) {
			bar.removeClass('hide-left hide-right');
		} else {
			bar.addClass('hide-right');
		}
	}

	$('html').toggleClass(bar.attr('id').replace('#', '') + '-hidden');
});

/* Footer bar */
$('#toggle-progress-menu').on('click', function(e) {
	e.preventDefault();

	$(this).children().toggleClass('icon-chevron-down icon-chevron-up');

	$(this).next('ul').slideToggle();
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
	
	thisPanel.addClass('open').removeClass('closed');
	thisPanel.siblings().removeClass('open').addClass('closed');

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

$('dl.accordion').on('click', '> dt:not(.href)', function(e) {
	if($(e.target).is('button, a, .btn')) {
		return;
	}

	$(this).toggleClass('open');
	var content = $(this).next('dd');

	content.slideToggle();

	$(this).siblings('dd').not(content).slideUp();
	$(this).siblings('dt.open').removeClass('open');
});

// Stop Action title buttons toggling the action
$('#dln dl.accordion').on('click', ' > dt button', function(e) {
	e.stopPropagation();
});

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
$('#slideout-pairing select[name="method"]').on('change', function() {
	var inputs = $('#slideout-pairing').find('.sendonly');

	inputs.prop('disabled', $(this).val() != 'send');
});

$('#slideout-pairing button[name="gen-pin"]').on('click', function(e) {
	e.preventDefault();

	var input = $('#slideout-pairing').find('[name="device-pin"]');

	input.val(parseInt(1000 + (Math.random() * 8999)));
});

/* DLN menu */
function showDLN(show) {
	if(show == 'toggle') {
		$('#dln-menu > a').parent().toggleClass('open');
		$('a[data-open]').removeClass('open');
		$('#dln').toggleClass('closed');
	} else if(show == true) {
		$('#dln-menu > a').parent().addClass('open');
		$('a[data-open]').removeClass('open');
		$('#dln').removeClass('closed');
	} else {
		$('#dln-menu > a').parent().removeClass('open');
		$('a[data-open]').removeClass('open');
		$('#dln').addClass('closed');
	}
}

$('#dln-menu > a').on('click', function() {
	showDLN('toggle');
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