$('#footerbar').on('click', 'a.details', function(e) {
	e.preventDefault();

	$(this).parent().nextAll('.details-container').first().slideToggle();
});

$('#footerbar').on('click', 'a.pause', function(e) {
	e.preventDefault();

	$(this).children().toggleClass('icon-pause icon-play');
});

var apps = $('#footerbar').find('.apps');

$('#footerbar').on('click', 'a.scroll', function(e) {
	e.preventDefault();

	var direction = $(this).hasClass('right') ? -1 : 1;
	var containerWidth = $(this).closest('.apps-container').width() - 50;
	var left = parseInt(apps.css('margin-left'), 10) + (containerWidth * direction);
	
	left = Math.min(Math.max(left, containerWidth - apps.width()), 0);

	apps.css('margin-left', left);
});