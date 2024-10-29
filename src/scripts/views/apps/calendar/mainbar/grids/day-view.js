/******************************************************************************\
|                                                                              |
|                                 day-view.js                                  |
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
import MonthView from '../../../../../views/apps/calendar/mainbar/grids/month-view.js';

// date
//
let today = new Date();

export default BaseView.extend({

	//
	// attributes
	//

	className: 'day',

	template: template(`
		<div class="heading">
			<h1>
				<span class="month"><%= month %></span>
				<span class="day"><%= day %></span>,
				<span class="year"><%= year %></span>
			</h1>
		</div>
		
		<table class="outlined">
			<thead>
				<tr>
					<th colspan="6">
						<i class="fa fa-sun"></i>
						<label>Morming</label>
					</th>
				<tr>
			</thead>
		
			<tbody>
				<tr>
					<td class="hour"><span>12</span></td>
					<td class="hour"><span>1</span></td>
					<td class="hour"><span>2</span></td>
					<td class="hour"><span>3</span></td>
					<td class="hour"><span>4</span></td>
					<td class="hour"><span>5</span></td>
				</tr>
				<tr>
					<td class="hour"><span>6</span></td>
					<td class="hour"><span>7</span></td>
					<td class="hour"><span>8</span></td>
					<td class="hour"><span>9</span></td>
					<td class="hour"><span>10</span></td>
					<td class="hour"><span>11</span></td>
				</tr>
				<tr>
					<th colspan="6">
						<i class="fa fa-moon"></i>
						<label>Evening</label>
					</td>
				</tr>
				<tr>
					<td class="hour"><span>12</span></td>
					<td class="hour"><span>1</span></td>
					<td class="hour"><span>2</span></td>
					<td class="hour"><span>3</span></td>
					<td class="hour"><span>4</span></td>
					<td class="hour"><span>5</span></td>
				</tr>
				<tr>
					<td class="hour"><span>6</span></td>
					<td class="hour"><span>7</span></td>
					<td class="hour"><span>8</span></td>
					<td class="hour"><span>9</span></td>
					<td class="hour"><span>10</span></td>
					<td class="hour"><span>11</span></td>
				</tr>
			</tbody>
		</table>
	`),

	events: {
		'click': 'onClick',
		'click .hour': 'onClickHour',
		'tap .hour': 'onClickHour',
		'click .badge': 'onClickBadge'
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
		return MonthView.months[this.month] + ' ' + this.day + ', ' + this.year;
	},

	//
	// querying methods
	//

	isToday: function(date) {
		return date.getDate() == today.getDate() &&
			date.getMonth() == today.getMonth() &&
			date.getFullYear() == today.getFullYear();
	},

	hasSelected: function() {
		return this.$el.find('.selected').length != 0;
	},
	
	//
	// getting methods
	//

	getSelectedHour: function() {
		let hours = this.$el.find('.hour').closest('td').toArray();
		let selected = this.$el.find('.selected')[0];
		return hours.indexOf(selected);
	},

	getStartDate: function() {
		return new Date(this.year, this.month, this.day);
	},

	getEndDate: function() {
		return new Date(this.year, this.month, this.day + 1);
	},

	getDateRange: function() {
		return [this.getStartDate(), this.getEndDate()];
	},

	getEventsAtHour: function(collection, hour) {
		return collection.filter((item) => {
			let date = item.get('event_date');
			let hours = date.getHours() - date.getTimezoneOffset() / 60;
			return hours == hour;
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
		this.hour = date.getHours();
		this.day = date.getDate();
		this.month = date.getMonth();
		this.year = date.getFullYear();
	},

	//
	// selecting methods
	//

	select: function(which) {
		let hour = this.getSelectedHour();

		this.deselect();
		switch (which) {

			case 'first':
				this.selectHour(0);
				break;

			case 'prev':
				if (hour > 0) {
					this.selectHour(hour - 1);
				} else {
					this.goto('prev');
					this.select('last');
				}
				break;

			case 'next':
				if (hour < 23) {
					this.selectHour(hour + 1);
				} else {
					this.goto('next');
					this.select('first');
				}
				break;

			case 'last':
				this.selectHour(23);
				break;
		}
	},

	selectHour: function(hour) {
		$(this.$el.find('.hour')[hour]).closest('td').addClass('selected');
	},

	deselect: function() {
		this.$el.find('.selected').removeClass('selected');
	},
	
	//
	// navigating methods
	//

	goto: function(which) {
		let date;

		if (this.hasSelected()) {
			this.select(which);
			return;
		}

		switch (which) {

			case 'prev':
				date = new Date(this.date.getTime() - 24 * 3600 * 1000);
				break;

			case 'current':
				date = new Date();
				break;
				
			case 'next':
				date = new Date(this.date.getTime() + 24 * 3600 * 1000);
				break;
		}

		this.setDate(date);
		this.render();

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(date);
		}
	},
	
	//
	// rendering methods
	//

	templateContext: function() {
		return {
			hour: this.hour,
			month: MonthView.months[this.month],
			day: this.day,
			year: this.year
		};
	},

	onRender: function() {

		// set attributes
		//
		this.app = this.getParentView('app');

		// update view
		//
		if (this.isToday(this.date)) {
			let hour = today.getHours();

			// highlight current hour
			//
			$(this.$el.find('.hour')[hour]).closest('td').addClass('highlighted');
		}
	},

	showEvents: function(collection) {
		let hours = this.$el.find('.hour');

		for (let i = 0; i < 23; i++) {

			// find event count for date
			//
			let events = this.getEventsAtHour(collection, i - 1);

			// show badge
			//
			if (events.length > 0) {
				let element = $(hours[i - 1]);

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
				})
			}
		}

		// add tooltip triggers
		//
		this.addTooltips();
	},

	unhighlightAll: function() {
		this.$el.find('td').removeClass('highlighted');
	},
	
	deselectAll: function() {
		this.$el.find('td').removeClass('selected');
	},

	//
	// mouse event handling methods
	//

	onClick: function() {

		// deselect previously selected
		//
		this.deselectAll();
	},

	onClickHour: function(event) {
		let hour = $(event.target).closest('.hour')[0];

		// deselect previously selected
		//
		this.deselectAll();

		// select hour
		//
		if (hour) {
			$(hour).addClass('selected');

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
	}
});