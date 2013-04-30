$('#footerbar').on('click', 'a.details', function(e) {
	e.preventDefault();

	$(this).parent().nextAll('.details-container').first().slideToggle();
});

$('#footerbar').on('click', 'a.pause', function(e) {
	e.preventDefault();

	$(this).children().toggleClass('icon-pause icon-play');
});