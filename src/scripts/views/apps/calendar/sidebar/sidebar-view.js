/******************************************************************************\
|                                                                              |
|                               sidebar-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing an app's sidebar.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SideBarView from '../../../../views/apps/common/sidebar/sidebar-view.js';
import EventsPanelView from '../../../../views/apps/calendar/sidebar/panels/events-panel-view.js';

export default SideBarView.extend({

	//
	// attributes
	//

	panels: ['events'],

	//
	// attribute methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();

		return {
			'events': isSignedIn
		};
	},

	//
	// setting methods
	//

	setSelected: function(model, options) {
		this.getChildView('events').setSelectedModel(model, options);
		
		// scroll into view
		//
		this.scrollToView(this.getChildView('events').getSelected()[0]);
	},

	//
	// rendering methods
	//

	showEvents: function(events) {
		this.collection = events;
		this.showEventsPanel();
	},

	//
	// panel rendering methods
	//

	showPanel: function(panel) {

		// show specified panel
		//
		switch (panel) {
			case 'events':
				this.showEventsPanel();
				break;
		}
	},

	showEventsPanel: function() {
		this.showChildView('events', new EventsPanelView({
			collection: this.collection,

			// callback options
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		}));		
	}
});