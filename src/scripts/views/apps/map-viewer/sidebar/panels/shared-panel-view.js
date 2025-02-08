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
				<button type="button" class="open-shared-map success btn btn-sm" data-toggle="tooltip" title="Open Shared Map">
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
		'click .open-shared-map': 'onClickOpenSharedMap'
	},

	path: config.apps['map_viewer'].maps_directory,

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

	getSelectedModels: function() {
		if (this.hasChildView('items')) {
			return this.getChildView('items').getSelectedModels();
		}
	},

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
			this.request = this.fetchAndShowShared();
		} else {
			this.showShared(this.constructor.shared);
		}	
	},

	showShared: function(directory) {

		// check that directory contains items
		//
		if (directory.isEmpty()) {
			return;
		}

		// create new view of shared items
		//
		this.showChildView('items', new FilesView({
			model: directory,
			collection: directory.contents,

			// options
			//
			view_kind: this.options.view_kind,
			empty: "No items.",

			// capabilities
			//
			selectable: true,
			editable: false,
			draggable: false,
			droppable: false,

			// callbacks
			//
			onchange: this.options.onchange,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: (item) => this.onOpen(item)
		}));
	},

	fetchAndShowShared: function() {
		return new Directory({
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

	onClickOpenSharedMap: function() {
		this.app.showOpenDialog(new Directory({
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