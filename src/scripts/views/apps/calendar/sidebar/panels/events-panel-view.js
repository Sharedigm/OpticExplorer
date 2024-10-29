/******************************************************************************\
|                                                                              |
|                             events-panel-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a type of sidebar panel.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';
import UserEventsListView from '../../../../../views/apps/calendar/sidebar/lists/user-events-list-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'events panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-calendar-alt"></i>Events</label>
		
			<% if (application.session.user) { %>
			<div class="buttons">
				<button type="button" class="add-event success btn btn-sm" data-toggle="tooltip" title="Add Event">
					<i class="fa fa-plus"></i>
				</button>
			</div>
			<% } %>
		</div>
		
		<div class="items"></div>
	`),

	regions: {
		'items': '.items'
	},	

	events: {
		'click .add-event': 'onClickAddEvent'
	},

	//
	// querying methods
	//

	hasSelected: function() {
		if (this.hasChildView('items')) {
			return this.getChildView('items').hasSelected();
		}
	},

	//
	// getting methods
	//

	getSelected: function() {
		if (this.hasChildView('items')) {
			return this.getChildView('items').getSelected();
		}
	},

	getSelectedModels: function() {
		if (this.hasChildView('items')) {
			return this.getChildView('items').getSelectedModels();
		}
	},

	//
	// setting methods
	//

	setSelectedModel: function(model, options) {
		if (this.hasChildView('items')) {
			this.getChildView('items').setSelectedModels([model], options);
		}
	},
	
	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		SideBarPanelView.prototype.onRender.call(this);

		/*
		this.collection.fetch({

			// callbacks
			//
			success: () => this.showEvents(),

			error: () => {

				// show no events message
				//
				this.showChildView('items', new BaseView({
					template: template('<ul><li>No events</li><ul>')
				}));		
			}
		});
		*/

		// show child views
		//
		this.showEvents();
	},

	showEvents: function() {
		this.showChildView('items', new UserEventsListView({
			collection: this.collection,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		}));
	},

	//
	// mouse event handling methods
	//

	onClickAddEvent: function() {
		this.getParentView('app').newEvent();
	}
});