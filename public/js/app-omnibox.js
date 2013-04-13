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
		return item.match(new RegExp('.*' + searchTerm + '.*', 'i'));
	});
}

$('#omnibox input[name="search"]')
.on('keyup', function(e) {
	var string = $(this).val();
	var realm = '';
	var omnibox = $('#omnibox');
	var results = omnibox.find('.results');
	var terminal = $('#console');
	var items = results.find('li');
	var selectedItem = items.filter('.selected');

	if(!string.length || e.which == 27 || string.length < 3) {
		omnibox.removeClass('open');
		results.hide();
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
		results.hide();
		terminal.show();
	} else if(e.which !== 38 && e.which !== 40) {
		if(selectedItem.index() > (items.length - 1)) {
			items.last().addClass('selected').siblings().removeClass('selected');
		} else if(!selectedItem.length) {
			items.first().addClass('selected');
		}

		omnibox.addClass('open');
		results.show();
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
	if(selectedItem.length) {
		if(selectedItem != items.first() && e.which === 38) {		// Up
			selectedItem.prev().addClass('selected').siblings().removeClass('selected');
		} else if(selectedItem != items.last() && e.which === 40) {		// Down
			selectedItem.next().addClass('selected').siblings().removeClass('selected');
		}
	} else {
		switch(e.which) {
			case 38:
				items.last().addClass('selected');
			break;
			case 40:
				items.first().addClass('selected');
			break;
		}
	}

	// Handle enter key
	if(selectedItem.length && e.which === 13) {
		// Break actual do-stuff functionality out into separate function. This has to be called on mouse click as well
		alert("Chosen " + selectedItem.text());
		results.hide();
		$(this).val('');
	}
});

$('#omnibox').on('click', 'li > a', function() {
	alert("Chosen " + $(this).text());
	$(this).closest('div').hide();
	$('#omnibox').find('input').val('');
});