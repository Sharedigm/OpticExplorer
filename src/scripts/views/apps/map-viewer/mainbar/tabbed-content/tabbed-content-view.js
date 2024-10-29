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
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MapFile from '../../../../../models/storage/files/map-file.js';
import TabbedContentView from '../../../../../views/apps/common/mainbar/tabbed-content/tabbed-content-view.js';
import DroppableUploadable from '../../../../../views/apps/file-browser/mainbar/behaviors/droppable-uploadable.js';
import TabsView from '../../../../../views/apps/map-viewer/mainbar/tabbed-content/tabs/tabs-view.js';
import TabPanesView from '../../../../../views/apps/map-viewer/mainbar/tabbed-content/tab-panes/tab-panes-view.js';

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

		// apply to active view
		//
		if (this.hasActivePaneView()) {
			this.getActivePaneView().setOption(key, value);
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		TabbedContentView.prototype.onRender.call(this);

		// reset default place
		//
		this.getChildView('panes').options.place = undefined;

		// set attributes
		//
		this.app = this.getParentView('app');
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// loading the toolbars can change 
		// the content area (map) size
		//
		this.onResize();
	},

	//
	// drag and drop handling methods
	//

	onDropOn: function(items) {

		// play drop sound
		//
		application.play('drop');

		// open or add items
		//
		if (items[0] instanceof MapFile) {
			this.app.openItems(items, {

				// callbacks
				//
				success: () => {
					this.app.getChildView('sidebar maps items items').deselectAll();
				}
			});
		} else {
			this.app.addItems(items);
		}
	},

	onDropInItems: function(items) {
		this.app.uploadMapItems(items, {

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
	},

	onDropInFiles: function(files) {
		this.app.uploadMapFiles(files, {

			// callbacks
			//
			success: (files) => {

				// perform callback
				//
				if (this.options.ondropin) {
					this.options.ondropin(files);
				}
			}
		});
	}
}));