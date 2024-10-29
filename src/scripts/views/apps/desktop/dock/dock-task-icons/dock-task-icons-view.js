/******************************************************************************\
|                                                                              |
|                            dock-task-icons-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a row of app launcher dock icons.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import DockIconsView from '../../../../../views/apps/desktop/dock/dock-icons-view.js';
import DockTaskIconView from '../../../../../views/apps/desktop/dock/dock-task-icons/dock-task-icon-view.js';

export default DockIconsView.extend({

	//
	// attributes
	//

	className: 'tasks',
	childView: DockTaskIconView,

	//
	// constructor
	//

	initialize: function() {

		// add listeners
		//
		this.listenTo(this.collection, 'add', this.onChange);
		this.listenTo(this.collection, 'remove', this.onChange);
	},

	//
	// event handling methods
	//

	onChange: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	}
});