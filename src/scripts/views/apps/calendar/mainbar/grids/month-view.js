/******************************************************************************\
|                                                                              |
|                                month-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a calendar grid.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';

// date
//
let today = new Date();

export default BaseView.extend({

	//
	// attributes
	//

	className: 'month',

	template: template(`
		<div class="heading">
			<h1>
				<span class="month"><%= month %></span>
				<span class="year"><%= year %></span>
			</h1>
		</div>
		
		<table class="outlined">
			<thead>
			<tr>
				<th><label>Sun</label></th>
				<th><label>Mon</label></th>
				<th><label>Tue</label></th>
				<th><label>Wed</label></th>
				<th><label>Thu</label></th>
				<th><label>Fri</label></th>
				<th><label>Sat</label></th>
			</tr>
			</thead>
		
			<tbody></tbody>
		</table>
	`),

	events: {
		'click': 'onClick',
		'click .date': 'onClickDate',
		'click .badge': 'onClickBadge',
		'dblclick .date': 'onDoubleClickDate',
		'tap .date.selected': 'onDoubleClickDate'
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.setDate(this.options.date || today);
	},

	//
	// attribute methods
	//

	title: function() {
		return this.constructor.months[this.month] + ' ' + this.year;
	},
	
	//
	// querying methods
	//

	isMonth: function(date) {
		return this.year === date.getFullYear() && this.month === date.getMonth();
	},

	hasSelected: function() {
		return this.$el.find('.selected').length != 0;
	},

	//
	// counting methods
	//

	numDays: function() {
		return this.$el.find('.date').length;
	},

	//
	// getting methods
	//

	getSelectedDate: function() {
		let dates = this.$el.find('.date').closest('td').toArray();
		let selected = this.$el.find('.selected')[0];
		return dates.indexOf(selected) + 1;
	},

	getDaysInMonth: function() {
		return 32 - new Date(this.year, this.month, 32).getDate();
	},

	getStartDate: function() {
		return new Date(this.year, this.month);
	},

	getEndDate: function() {
		return new Date(this.year, this.month, this.getDaysInMonth() + 1);
	},

	getDateRange: function() {
		return [this.getStartDate(), this.getEndDate()];
	},

	getEventsOnDay: function(collection, day) {
		return collection.filter((item) => {
			return item.get('event_date').getDate() == day;
		});
	},

	getBadge: function(numEvents) {
		return $('<div class="active badge">' +
			'<i class="fa fa-calendar-alt"></i>' +
			numEvents + '</div>');
	},

	//
	// setting methods
	//

	setDate: function(date) {
		this.date = date;
		this.month = date.getMonth();
		this.year = date.getFullYear();
	},

	//
	// highlighting methods
	//

	unhighlightAll: function() {
		this.$el.find('td').removeClass('highlighted');
	},

	highlightDate: function(date) {
		$(this.$el.find('.date')[date - 1]).closest('td').addClass('highlighted');
	},

	//
	// selecting methods
	//

	select: function(which) {
		let date = this.getSelectedDate();

		this.deselect();
		switch (which) {

			case 'first':
				this.selectDate(1);
				break;

			case 'prev':
				if (date > 1) {
					this.selectDate(date - 1);
				} else {
					this.goto('prev');
					this.select('last');
				}
				break;

			case 'next':
				if (date < this.numDays()) {
					this.selectDate(date + 1);
				} else {
					this.goto('next');
					this.select('first');
				}
				break;

			case 'last':
				this.selectDate(this.numDays());
				break;
		}
	},

	deselectAll: function() {
		this.$el.find('td').removeClass('selected');
	},

	selectDate: function(date) {
		$(this.$el.find('.date')[date - 1]).closest('td').addClass('selected');
	},
	
	//
	// navigating methods
	//

	goto: function(which) {

		/*
		if (this.hasSelected()) {
			this.select(which);
			return;
		}
		*/

		switch (which) {

			case 'prev':
				this.month--;
				if (this.month < 0) {
					this.month = 11;
					this.year--;
				}
				break;

			case 'current':
				this.month = today.getMonth();
				this.year = today.getFullYear();
				break;
				
			case 'next':
				this.month++;
				if (this.month == 12) {
					this.month = 0;
					this.year++;
				}
				break;
		}

		this.render();

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(new Date(this.year, this.month));
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			month: this.constructor.months[this.month],
			year: this.year
		};
	},

	onRender: function() {

		// set attributes
		//
		this.app = this.getParentView('app');

		// render calendar days
		//
		this.showDays();

		// highlight selected date
		//
		if (this.options.selected && this.isMonth(this.options.selected)) {
			this.selectDate(this.options.selected.getDate());
			this.options.selected = undefined;
		}
	},

	showDays: function() {
		let firstDay = (new Date(this.year, this.month)).getDay();
		let daysInMonth = this.getDaysInMonth();

		// body of the calendar
		//
		let $table = this.$el.find('tbody');

		// clear previous cells
		//
		$table.innerHTML = "";

		// create all cells
		//
		let date = 1;
		// let rows = Math.ceil((firstDay + daysInMonth) / 7);
		let rows = 6;
		for (let row = 0; row < rows; row++) {

			// create a table row
			//
			let $row = $('<tr>');

			// create individual cells
			//
			for (let column = 0; column < 7; column++) {
				let $cell;

				if (row === 0 && column < firstDay || date > daysInMonth) {
					$cell = $('<td>').append($('<div>').text(''));
					$row.append($cell);
				} else {
					$cell = $('<td>').addClass('date').append($('<span>').text(date));

					// highlight today's date
					//
					if (date === today.getDate() && this.year === today.getFullYear() && this.month === today.getMonth()) {
						$cell.addClass('highlighted');
					}

					$row.append($cell);
					date++;
				}
			}

			// appending each row
			//
			$table.append($row);
		}
	},

	showEvents: function(collection) {
		let daysInMonth = this.getDaysInMonth();
		let dates = this.$el.find('.date');

		for (let i = 0; i < daysInMonth; i++) {

			// find event count for date
			//
			let events = this.getEventsOnDay(collection, i + 1);

			// show badge
			//
			if (events.length > 0) {
				let element = $(dates[i]);

				// add badge
				//
				let badge = this.getBadge(events.length);
				element.closest('td').append(badge);

				// add tooltip
				//
				badge.attr({
					'data-toggle': 'tooltip',
					'title': events[0].get('name')
				});
				this.addTooltips({
					el: badge,
					container: 'body'
				});
			}
		}

		// add tooltip triggers
		//
		this.addTooltips();
	},

	//
	// mouse event handling methods
	//

	onClick: function() {

		// deselect previously selected
		//
		this.deselectAll();
	},

	onClickDate: function(event) {
		let date = $(event.target).closest('.date')[0];

		// deselect previously selected
		//
		this.deselectAll();

		// select date
		//
		if (date) {
			$(date).addClass('selected');

			// block event from parent
			//
			this.block(event);
		}
	},

	onClickBadge: function(event) {
		this.block(event);

		// show events list dialog
		//
		import(
			'../../../../../views/apps/calendar/dialogs/events/events-dialog-view.js'
		).then((EventsDialogView) => {
			this.app.show(new EventsDialogView.default({
				collection: this.app.collection,

				// options
				//
				period: this.title()
			}));
		});
	},

	onDoubleClickDate: function(event) {
		let date = $(event.target).closest('.date')[0];

		if (date) {

			// callbacks
			//
			if (this.options.onopen) {
				let dates = this.$el.find('.date').closest('td').toArray();
				let day = dates.indexOf(date) + 1;
				this.options.onopen(new Date(this.year, this.month, day));
			}
		}
	}
}, {

	//
	// static attributes
	//

	months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
});