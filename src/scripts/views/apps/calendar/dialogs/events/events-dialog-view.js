/******************************************************************************\
|                                                                              |
|                             events-dialog-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for showing a list of events.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import DialogView from '../../../../../views/dialogs/dialog-view.js';
import UserEventsListView from '../../../../../views/apps/calendar/sidebar/lists/user-events-list-view.js';

export default DialogView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-calendar-alt"></i>
					</div>
					<div class="title">
						<%= title || 'Events' %>
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body"></div>
				
				<div class="modal-footer">
					<div class="buttons">
						<button class="ok btn btn-primary" data-dismiss="modal">
							<i class="fa fa-check"></i>OK
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	regions: {
		body: '.modal-body'
	},

	//
	// attribute methods
	//

	title: function() {
		return "Events for " + this.options.period;
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			title: this.title()
		};
	},
	
	onRender: function() {
		
		// call superclass method
		//
		DialogView.prototype.onRender.call(this);

		// show child views
		//
		this.showEventsList();
	},

	showEventsList: function() {
		this.showChildView('body', new UserEventsListView({
			collection: this.collection
		}));	
	}
});
