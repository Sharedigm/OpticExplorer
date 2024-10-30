/******************************************************************************\
|                                                                              |
|                             tabbed-content-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for editing code files.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TabbedContentView from '../../../../../views/apps/common/mainbar/tabbed-content/tabbed-content-view.js';
import DroppableUploadable from '../../../../../views/apps/file-browser/mainbar/behaviors/droppable-uploadable.js';
import TabsView from '../../../../../views/apps/material-editor/mainbar/tabbed-content/tabs/tabs-view.js';
import TabPanesView from '../../../../../views/apps/material-editor/mainbar/tabbed-content/tab-panes/tab-panes-view.js';

export default TabbedContentView.extend(_.extend({}, DroppableUploadable, {

	//
	// attributes
	//

	tabsView: TabsView,
	tabPanesView: TabPanesView,

	events: _.extend({}, TabbedContentView.prototype.events, DroppableUploadable.events),

	//
	// setting methods
	//

	setOption: function(key, value) {
		this.getChildView('panes').setChildOptions(key, value);
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		TabbedContentView.prototype.onRender.call(this);

		// set attributes
		//
		this.app = this.getParentView('app');
	},

	//
	// drag and drop handling methods
	//

	onDropOn: function(items) {

		// play drop sound
		//
		application.play('drop');

		// open items
		//
		this.app.openItems(items);
	},

	onDropInItems: function(items) {
		this.app.uploadItems(items, {

			// callbacks
			//
			success: (items) => {

				// perform callback
				//
				if (this.options.ondropin) {
					this.options.ondropin(items);
				}
			}
		});
	}
}));