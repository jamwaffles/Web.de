$('#statusbar > ul').tooltip({
	placement: 'bottom',
	selector: '> li > a',
	container: '#statusbar'
});
$('input.slider').mrslyde({
	snap: false
});

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

$('#dln > li:first > a.section-toggle').trigger('click');

// Accordions
$('.accordion').on('click', 'dt', function() {
	$(this).toggleClass('open');
	var content = $(this).next('dd');

	content.slideToggle();

	$(this).siblings('dd').not(content).slideUp();
	$(this).siblings('dt.open').removeClass('open');
});

/* Mouse scroll */
/* TODO: Plugin-ify and optimise */
// var scrollTargets = $('#dln > li > div > dl');
var scrollTargets = $('#dln div.actions > dl');

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

$('.calendar').datePicker({
	footer: false
});

$('input[name="time-source"]').on('click', function() {
	var thisFieldset = $(this).parent().next('fieldset');
	var otherFieldsets = $(this).closest('form').find('fieldset').not(thisFieldset);

	thisFieldset.prop('disabled', false);
	otherFieldsets.prop('disabled', true);
});

/* Omnimenu */
$('#dln-menu > a').on('click', function(e) {
	e.preventDefault();

	$(this).parent().toggleClass('open');

	$('#dln').toggleClass('closed');
});

/* Statusbar menus */
$('a[href$="-menu"]').on('click', function(e) {
	var id = $(this).prop('href').split('#').slice(-1)[0].replace('-menu', '');

	var thisPanel = $('.panel').filter(function() {
		return $(this).data('menu') === id;
	}).addClass('open');

	console.log(id, thisPanel);

	$('.panel').not(thisPanel).removeClass('open');

	$('#dln').addClass('closed');
	$('#dln-menu').removeClass('open');
});

/* Generic slideout from left/right sidebar */
$('a[href^="#slideout-"]').on('click', function(e) {
	var id = '#' + $(this).prop('href').split('#').slice(-1);

	$(id).toggleClass('open');

	$('.slideout').not(id).removeClass('open');
});

$('.slideout div.slideout-close a').on('click', function(e) {
	e.preventDefault();

	$(this).closest('.slideout').removeClass('open');
});

// $(document).on('click', function(e) {
// 	if($('.slideout.open').length && !$(e.target).closest('.slideout').length) {
// 		$('.slideout.open').removeClass('open');
// 	}
// });