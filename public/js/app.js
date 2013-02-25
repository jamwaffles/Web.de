var container = $('#sections');
var panel = container.children().not('.open').first();

var sections = {
	panelWidth: panel.width(),
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

	// Set widths of panels
	container.find('dl').width(sections.maxWidth - (sections.panelPadding * 2));
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
$('.actions').on('click', 'dt', function() {
	$(this).toggleClass('open');
	var content = $(this).next('dd');

	content.slideToggle();

	$(this).siblings('dd').not(content).slideUp();
	$(this).siblings('dt.open').removeClass('open');
});

// Time
setInterval(function() {
	var now = new Date();

	$('#time').text(now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds());
}, 1000);