$('.actions').on('click', 'dt', function() {
	$(this).toggleClass('open');

	var dd = $(this).next().slideToggle();

	$(this).siblings('dd').not(dd).slideUp();
	$(this).siblings('dt').removeClass('open');
});

$('#sections').on('click', 'a', function(e) {
	e.preventDefault();

	$(this).closest('#sections').find('.btn-primary').removeClass('btn-primary');

	$(this).addClass('btn-primary');
});