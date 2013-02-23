$('.actions').on('click', 'dt', function() {
	var self = $(this);
	var panel = self.next();

	self.toggleClass('open');
	panel.stop(true, true).slideToggle();

	self.siblings('dd').not(panel).slideUp();
	self.siblings('dt').removeClass('open');
});

$('#sections').on('click', 'a', function(e) {
	e.preventDefault();

	$(this).closest('#sections').find('.btn-primary').removeClass('btn-primary');

	$(this).addClass('btn-primary');
});