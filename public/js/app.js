$('#statusbar > ul').tooltip({
	placement: 'bottom',
	selector: '> li > a',
	container: '#statusbar'
});

var container = $('#sections');
var panel = container.children().not('.open').first();

var sections = {
	panelWidth: panel.outerWidth(),
	panelPadding: panel.outerWidth(true) - panel.width(),
	numPanels: container.children().length,
	duration: 600,
	easing: 'easeOutQuint'
};
sections.maxWidth = $(window).width() - (sections.panelWidth + sections.panelPadding) * (sections.numPanels) + sections.panelWidth;

// Set initial widths of panels
container.find('dl').width(sections.maxWidth);
container.children().width(sections.panelWidth);
container.children('.open').first().width(sections.maxWidth);

$(window).resize(function() {
	sections.maxWidth = $(window).width() - (sections.panelWidth + sections.panelPadding) * (sections.numPanels) + sections.panelWidth;

	// Set initial widths of panels
	container.find('dl').width(sections.maxWidth - sections.panelWidth - 20);
	container.children().width(sections.panelWidth);
	container.children('.open').first().width(sections.maxWidth);
});

$('#sections').on('click', '.section-toggle', function(e) {
	e.preventDefault();

	var panels = $(this).closest('ul').children();
	var thisPanel = $(this).closest('li');
	var otherPanels = panels.not(thisPanel);

	if(!thisPanel.hasClass('open')) {
		thisPanel.addClass('opening').animate({
			width: sections.maxWidth
		}, sections.duration, sections.easing, function() {
			$(this).addClass('open').removeClass('opening');
		});

		otherPanels.removeClass('open opening').animate({ width: sections.panelWidth }, sections.duration, sections.easing);
	}
});

// Actions
$('.accordion').on('click', 'dt', function() {
	$(this).toggleClass('open');
	var content = $(this).next('dd');

	content.slideToggle();

	$(this).siblings('dd').not(content).slideUp();
	$(this).siblings('dt.open').removeClass('open');
});

/* Mouse scroll */
/* TODO: Plugin-ify and optimise */
var scrollTargets = $('#sections > li');

$(document).on('mousemove', function(e) {
	var target = $(e.target);
	var scroller, container, containerHeight;
	var mousePos, mouseRatio, scrollTop;

	scrollTargets.each(function() {
		if(target.closest($(this)).length && !target.hasClass('section-toggle')) {
			container = $(this);
			return;
		}
	});

	if(!container) {
		return;
	}

	containerHeight = container.height();
	scroller = container.children('dl');

	if(scroller.height() < container.height()) {
		return;
	}

	var margin = 100;

	var rangeTop = container.offset().top + margin;
	var rangeBottom = rangeTop + container.height() - (margin * 2);
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
}, 1000);

$('#clock-popover').find('.calendar').datePicker({
	footer: false
});

$('#time a.clock').on('click', function(e) {
	e.preventDefault();

	$('#clock-popover').toggleClass('open');
});

$('#clock-popover div.close a').on('click', function(e) {
	e.preventDefault();

	$(this).closest('#clock-popover').removeClass('open');
});

/* Omnimenu */
$('#omnimenu > a').on('click', function(e) {
	e.preventDefault();

	// $(this).children().toggleClass('icon-chevron-down icon-chevron-up');
	$(this).parent().toggleClass('open');

	$(this).next('#omnimenu-popover').toggleClass('open');
});