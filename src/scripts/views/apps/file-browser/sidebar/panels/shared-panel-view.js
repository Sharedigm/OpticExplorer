/******************************************************************************\
|                                                                              |
|                             shared-panel-view.js                             |
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

import Directory from '../../../../../models/storage/directories/directory.js';
import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';
import FilesView from '../../../../../views/apps/file-browser/mainbar/files/files-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'shared panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-share"></i>Shared</label>
		
			<div class="buttons">
				<button type="button" class="open-shared success btn btn-sm" data-toggle="tooltip" title="Open Shared">
					<i class="fa fa-folder-open"></i>
				</button>
			</div>
		</div>
		
		<div class="items"></div>
	`),

	regions: {
		'items': {
			el: '.items',
			replaceElement: true
		}
	},

	events: {
		'click .open-shared': 'onClickOpenShared'
	},

	path: config.apps.file_browser.shared_directory,

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		SideBarPanelView.prototype.onRender.call(this);
		
		// show child views
		//
		if (!this.constructor.shared) {
			this.request = new Directory({
				path: this.path
			}).load({

				// callbacks
				//
				success: (model) => {

					// check if view still exists
					//
					if (this.isDestroyed()) {
						return;
					}

					// update panel
					//
					this.constructor.shared = model;
					this.showShared(model);
				}
			});
		} else {
			this.showShared(this.constructor.shared);
		}	
	},

	showShared: function(directory) {

		// create new view of shared items
		//
		this.showChildView('items', new FilesView({
			model: directory,
			collection: directory.contents,

			// options
			//
			preferences: UserPreferences.create('file_browser', {
				view_kind: this.options.view_kind
			}),

			// capabilities
			//
			selectable: true,
			editable: false,
			draggable: false,
			droppable: true,

			// callbacks
			//
			onchange: this.options.onchange,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: (item) => this.onOpen(item)
		}));
	},

	//
	// file event handling methods
	//

	onOpen: function(item) {

		// open item in file browser
		//
		this.app.openItem(item.model, {

			// callbacks
			//
			success: () => this.getChildView('items').deselectAll()
		});
	},

	//
	// mouse event handling methods
	//

	onClickOpenShared: function() {
		this.app.openDirectory(new Directory({
			path: this.path
		}));
	},
	
	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// abort request
		//
		if (this.request && this.request.state() == 'pending') {
			this.request.abort();
		}
	}
});