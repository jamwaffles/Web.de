;(function($) {
	var today = new Date();
	today.setHours(0);
	today.setMinutes(0);
	today.setSeconds(0);
	today.setMilliseconds(0);

	var fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	//var shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	var weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	var wrapperClass = 'datepicker-container';

	var header = $('<div class="header">\
						<button class="btn prev" type="button">&laquo;</button>\
						<button class="btn next" type="button">&raquo;</button>\
						<div><span class="month"></span> <span class="year"></span></div>\
					</div>');
	var footer = $('<div class="footer"><div class="input-append">\
						<input class="span2 date" type="text">\
						<button class="today btn" type="button">Today</button>\
					</div></div>');

	var settings = {
		defaultDate: today,
		weekStart: 1,		// 0 for Sunday up to 6 for Saturday,
		footer: true
	};

	function generateCalendar(date, className) {
		var div = $('<div />').addClass(wrapperClass);

		if(className !== undefined) {
			div.addClass(className);
		}
		if(!settings.footer) {
			div.addClass('no-footer');
		}

		div.html(generateHeader(date));
		div.append(generateTable(date));
		div.append(generateFooter(date));

		// Events
		div.on('click', '.header button', function() {
			if($(this).hasClass('prev')) {
				var delta = -1;
			} else if($(this).hasClass('next')) {
				var delta = 1;
			}

			var currentMonth = selectedMonth(div.find('table'));
			var numDaysInNextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 2, 0).getDate();

			currentMonth.setDate(Math.min(currentMonth.getDate(), numDaysInNextMonth));
			currentMonth.setMonth(currentMonth.getMonth() + delta);

			updateCalendar(div, currentMonth);
			updateHeader(div, currentMonth);
		});
		div.on('click', '.today', function() {
			updateCalendar(div, today);
		});
		div.on('click', 'td', function() {
			var thisContainer = $(this).closest('.' + wrapperClass);
			var thisDate = $(this).data('date');

			updateCalendar(thisContainer, thisDate);
		});

		return div;
	}
	function updateCalendar(container, date) {
		var evt = new $.Event('datechange');
		evt.selectedDate = date;
		container.trigger(evt);

		updateHeader(container, date);
		updateTable(container, date);
		updateFooter(container, date);
	}

	function generateHeader(date) {
		var html = header.clone();

		updateHeader(html, date);

		return html;
	}

	function generateFooter(date) {
		if(settings.footer) {
			var html = footer.clone();

			updateInput(html, date);

			return html;
		} else {
			return '';
		}
	}
	function updateFooter(container, date) {
		if(settings.footer) {
			updateInput(container, date);
		}
	}

	function generateTable(selectedDate) {
		var table = $('<table />');

		// Table header
		table.prepend('<tr><th>' + weekDays.join('</th><th>') + '</th></tr>');
		
		var monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
		var previousDays = monthStart.getDay() - settings.weekStart;

		table.data('current-month', selectedDate);

		var tr = $('<tr />');

		for(var i = 0; i < 42; i++) {
			var cellDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i - (previousDays - 1));
			var td = $('<td />').data('date', cellDate).text(cellDate.getDate());

			// Classes
			if(cellDate.getMonth() < selectedDate.getMonth()) {
				td.addClass('previous');
			} else if(cellDate.getMonth() > selectedDate.getMonth()) {
				td.addClass('next');
			} else {
				td.addClass('current');
			}

			if(cellDate.getTime() === today.getTime()) {
				td.addClass('today');
			}
			if(cellDate.getTime() === selectedDate.getTime()) {
				td.addClass('selected');
			}

			// Append cell to row
			tr.append(td);

			// Append row to table
			if((i + 1) % 7 === 0) {
				table.append(tr.clone(true));
				tr.empty();
			}
		}

		return table;
	}
	function updateTable(container, selectedDate) {
		// var newTable = generateTable(selectedDate).css('opacity', 0);

		// container.find('table').fadeTo(200, 0, function() {
		// 	$(this).replaceWith(newTable);
		// 	newTable.fadeTo(200, 1);
		// });

		container.find('table').replaceWith(generateTable(selectedDate));
	}
	function selectedMonth(table) {
		return new Date(table.data('current-month').getTime());
	}

	function updateHeader(container, date) {
		container.find('span.month').text(fullMonths[date.getMonth()]);
		container.find('span.year').text(date.getFullYear());
	}
	function updateInput(container, date) {
		var separator = '/';

		var year = date.getFullYear().toString().substr(-2);
		var month = ("0" + (date.getMonth() + 1)).substr(-2);
		var day = ("0" + date.getDate()).substr(-2);

		var dateString = day + separator + month + separator + year;

		container.find('input.date').val(dateString);
	}

	var methods = {
		init: function(options) {
			settings = $.extend(settings, options);

			return this.each(function() {
				$(this).html(generateCalendar(settings.defaultDate));
			});
		},
		date: function(date) {
			if(date === undefined) {
				return $(this).data('date');
			} else {
				$(this).data('date', date);
				updateCalendar($(this), date);
			}
		}
	}

	$.fn.datePicker = function(method) {
		/*return this.each(function() {
			generateRangepicker($(this));
		});	*/

		// Method calling logic
		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if(typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			// No method found
		}
	};
})(jQuery);