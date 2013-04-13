var tempResponse = {
	error: false,
	matches: [
		'foo',
		'bar',
		'baz',
		'Hello',
		'World',
		'England',
		'America',
		'Germany',
		'Scottland',
		'Canada',
		'300.1080p.rip.mkv',
		'Wreck.It.Ralph.1080p.mkv',
		'Step.On.It.720p.mkv'
	]
};

function demoMatch(searchTerm) {
	return _.filter(tempResponse.matches, function(item) {
		return item.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
	});
}

$('#omnibox input[name="search"]').on('keyup', function(e) {
	var string = $(this).val();
	var realm = '';
	var omnibox = $('#omnibox');
	var results = omnibox.find('.results');
	var terminal = $('#console');
	var items = results.find('li');
	var selectedItem = items.filter('.selected');

	if(!string.length || e.which == 27) {
		omnibox.removeClass('open');
		results.slideUp(200);
		terminal.hide();

		return;
	}

	switch(string[0]) {
		case '$':
			realm = 'console';
		case '#':
			realm = 'root';
		default:
			realm = 'search';
	}

	if(realm !== 'search') {
		omnibox.removeClass('open');
		results.slideUp(200);
		terminal.show();
	} else {
		if(selectedItem.index() > (items.length - 1)) {
			items.last().addClass('selected').siblings().removeClass('selected');
		} else if(!selectedItem.length) {
			items.first().addClass('selected');
		}

		omnibox.addClass('open');
		results.slideDown(200);
		terminal.hide();

		// Show matches
		// TODO: Will go in an API wrapper call
		var matches = demoMatch(string);

		if(!matches.length) {
			return;
		}

		// Fill box with results
		var list = $('<ul />');

		_.each(matches, function(item) {
			var li = $('<li />');

			$('<a />')
				.prop('href', '#')
				.text(item)
				.appendTo(li);

			li.appendTo(this);
		}, list);

		results.children('ul').replaceWith(list);
	}

	// Arrow keys
	if(selectedItem != items.first() && e.which === 38) {		// Up
		selectedItem.prev().addClass('selected').siblings().removeClass('selected');
	} else if(selectedItem != items.last() && e.which === 40) {		// Down
		selectedItem.next().addClass('selected').siblings().removeClass('selected');
	}
});