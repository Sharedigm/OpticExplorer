/******************************************************************************\
|                                                                              |
|                         user-events-list-item-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a base class for a single generic list item.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ListItemView from '../../../../../views/items/lists/list-item-view.js';

export default ListItemView.extend({

	//
	// getting methods
	//

	getIcon: function() {
		return '<i class="fa fa-calendar-alt"></i>';
	},

	getName: function() {
		return this.model.get('name');
	},

	getDetails: function() {
		if (this.model.has('event_date')) {
			let date = this.model.get('event_date');
			if (date && date.format) {
				return date.format('shortDate');
			}
		}
	},

	//
	// dialog rendering methods
	//

	showEditEventDialogView: function(options) {
		import(
			'../../../../../views/apps/calendar/dialogs/events/edit-event-dialog-view.js'
		).then((EditEventDialogView) => {

			// show edit event dialog
			//
			this.getParentView('app').show(new EditEventDialogView.default(options));
		});
	},

	//
	// opening methods
	//

	open: function() {
		this.showEditEventDialogView({
			model: this.model
		});
	}
});