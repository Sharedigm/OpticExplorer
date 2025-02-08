/******************************************************************************\
|                                                                              |
|                               calendar-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for viewing your calendar.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserEvents from '../../../collections/events/user-events.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import HeaderBarView from '../../../views/apps/calendar/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/calendar/sidebar/sidebar-view.js';
import DayView from '../../../views/apps/calendar/mainbar/grids/day-view.js';
import WeekView from '../../../views/apps/calendar/mainbar/grids/week-view.js';
import MonthView from '../../../views/apps/calendar/mainbar/grids/month-view.js';
import FooterBarView from '../../../views/apps/calendar/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/calendar/forms/preferences/preferences-form-view.js'

export default AppSplitView.extend({

	//
	// attributes
	//

	name: 'calendar',

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);

		// set attributes
		//
		this.date = this.options.date || new Date();
		this.collection = new UserEvents();
	},

	//
	// querying methods
	//

	hasSelected: function() {
		if (this.hasChildView('sidebar events')) {
			return this.getChildView('sidebar events').hasSelected();
		}
	},

	//
	// getting methods
	//

	getSelected: function() {
		if (this.hasChildView('sidebar events')) {
			return this.getChildView('sidebar events').getSelected();
		}
	},

	getSelectedModels: function() {
		if (this.hasChildView('sidebar events')) {
			return this.getChildView('sidebar events').getSelectedModels();
		}
	},

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		switch (key) {
					
			// sidebar item options
			//
			case 'view_kind':
				this.preferences.set('view_kind', value);
				this.onChange();
				break;

			// other options
			//
			default:

				// call superclass method
				//
				AppSplitView.prototype.setOption.call(this, key, value);
				break;
		}
	},

	//
	// navigating methods
	//

	goto: function(which) {
		if (which == 'up') {
			this.options.date = this.date;
			this.setOption('view_kind', 'month');
			this.onChange();
		} else {
			this.getChildView('content').goto(which);
		}
	},
	
	//
	// event creating methods
	//

	newEvent: function() {
		this.showAddEventDialog({

			// callbacks
			//
			onsubmit: (item) => {
				this.date = item.get('event_date');
				this.options.date = item.get('event_date');
				this.showContent();
				this.fetchAndShowEvents();
			}
		});
	},

	deleteEvent: function(event, options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete",
				message: "Are you sure you want to delete " + event.get('name') +
					" from your list of events?",

				// callbacks
				//
				accept: () => {
					this.deleteEvent(event, _.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {

			// delete event
			//
			event.destroy(options);
		}
	},

	deleteEvents: function(events, options) {
		let count = events.length;

		function deleteEvent(event, collection) {
			event.destroy({

				// callbacks
				//
				success: (model) => {
					collection.remove(model);
					count--;
					if (count == 0) {

						// play remove sound
						//
						application.play('remove');
					}
				}					
			});
		}

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete",
				message: "Are you sure you want to delete " + (events.length == 1? '"' + events[0].get('name') + '"' : "these " + events.length + " events") +
					" from your list of events?",

				// callbacks
				//
				accept: () => {
					this.deleteEvents(events, _.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {

			// delete events
			//
			for (let i = 0; i < events.length; i++) {
				deleteEvent(events[i], this);
			}
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		AppSplitView.prototype.onRender.call(this);
		
		// show child views
		//
		this.showHeaderBar();
		this.showContents();

		// show footer bar
		//
		if (!this.options.hidden || !this.options.hidden['footer-bar']) {
			this.showFooterBar();
		} else {
			this.$el.find('.footer-bar').remove();
		}

		// show current user's events
		//
		if (application.isSignedIn()) {
			this.fetchAndShowEvents();
		} else {
			this.showEvents(this.collection);
			this.onLoad();
		}
	},
	
	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView();
	},

	//
	// contents rendering methods
	//

	getSideBarView: function() {
		return new SideBarView({
			collection: this.collection,

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			view_kind: this.preferences.get('sidebar_view_kind'),

			// callbacks
			//
			onselect: (item) => this.getChildView('header menu').onChangeSelection(item),
			ondeselect: (item) => this.getChildView('header menu').onChangeSelection(item)
		});
	},

	getContentView: function() {
		switch (this.preferences.get('view_kind')) {

			case 'day':
				return new DayView({

					// options
					//
					preferences: this.preferences,
					date: this.date,
					selected: this.options.date,

					// callbacks
					//
					onchange: (date) => this.onChange(date)
				});

			case 'week':
				return new WeekView({

					// options
					//
					preferences: this.preferences,
					date: this.date,
					selected: this.options.date,

					// callbacks
					//
					onchange: (date) => this.onChange(date)
				});
				
			case 'month':
				return new MonthView({

					// options
					//
					preferences: this.preferences,
					date: this.date,
					selected: this.options.date,

					// callbacks
					//
					onopen: (date) => this.onOpen(date),
					onchange: (date) => this.onChange(date)
				});
		}
	},

	fetchAndShowEvents: function() {
		let after = this.getChildView('content').getStartDate();
		let before = this.getChildView('content').getEndDate();

		// fetch user events
		//
		this.collection.fetchByCurrentUser({
			data: {
				after: after.format('yyyy-mm-dd HH:MM:ss'),
				before: before.format('yyyy-mm-dd HH:MM:ss')
			},

			// callbacks
			//
			success: (collection) => {
				this.showEvents(collection);
				this.onLoad();
			}
		});
	},

	showEvents: function(collection) {
		this.getChildView('sidebar').showEvents(collection);
		this.getChildView('content').showEvents(collection);
	},

	//
	// footer bar rendering methods
	//

	getFooterBarView: function() {
		return new FooterBarView({
			collection: this.collection
		});
	},

	//
	// dialog rendering methods
	//
	
	showAddEventDialog: function(options) {
		import(
			'../../../views/apps/calendar/dialogs/events/add-event-dialog-view.js'
		).then((AddEventDialogView) => {

			// show add event dialog
			//
			this.show(new AddEventDialogView.default(options));
		});
	},

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/calendar/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	onChange: function(date) {

		// update date
		//
		if (date) {
			this.date = date;
		}

		// update views
		//
		this.showContent();
		this.getChildView('header').onChange();

		// update events
		//
		if (application.isSignedIn()) {
			this.fetchAndShowEvents();
		}

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	//
	// file event handling methods
	//

	onOpen: function(date) {

		// change view kind to day view
		//
		this.setOption('view_kind', 'day');

		// update
		//
		this.onChange(date);
	}
}, {

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	}
});