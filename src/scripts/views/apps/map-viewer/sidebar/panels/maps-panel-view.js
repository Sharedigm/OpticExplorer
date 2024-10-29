/******************************************************************************\
|                                                                              |
|                              maps-panel-view.js                              |
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
import EditableFilesView from '../../../../../views/apps/file-browser/mainbar/files/editable-files-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'maps panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-map"></i>Maps</label>
		
			<div class="buttons">
				<button type="button" class="new-map success btn btn-sm" data-toggle="tooltip" title="New Map">
					<i class="fa fa-plus"></i>
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
		'click .new-map': 'onClickNewMap'
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

	getSelectedModels: function() {
		if (this.hasChildView('items')) {
			return this.getChildView('items').getSelectedModels();
		}
	},

	//
	// setting methods
	//

	setDirectory: function(directory) {

		// set to directory or home directory
		//
		this.model = directory || application.getDirectory();

		// update
		//
		this.onRender();
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
		this.request = this.app.directory.load({

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
				this.showItems(model);
			}
		});	
	},

	showItems: function(directory) {

		// create new view of map items
		//
		this.showChildView('items', new EditableFilesView({
			model: directory,
			collection: directory.contents,

			// options
			//
			view_kind: this.options.view_kind,
			empty: "No maps.",

			// capabilities
			//
			selectable: true,
			deselectable: true,
			editable: true,
			draggable: true,
			droppable: true,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropinitems: (items, child, options) => this.onDropInItems(items, child, options),
			ondroponchild: (items, child, options) => this.onDropOnChild(items, child, options)
		}));
	},

	//
	// selection event handling methods
	//

	onSelect: function(item) {
		this.app.onSelect(item);
	},

	onDeselect: function(item) {
		this.app.onDeselect(item);
	},

	//
	// mouse event handling methods
	//

	onClickNewMap: function() {
		this.app.newFile();
	},

	//
	// file event handling methods
	//

	onOpen: function(item) {

		// change directory
		//
		if (item.model instanceof Directory) {
			this.app.pushDirectory(item.model);

		// open item in app
		//
		} else {
			this.app.openItem(item.model, {

				// callbacks
				//
				success: () => this.getChildView('items').deselectAll()
			});
		}
	},

	//
	// drag and drop event handling methods
	//

	onDropInItems: function(items, options) {
		this.app.uploadMaps(items, {

			// callbacks
			//
			success: () => {

				// play upload sound
				//
				application.play('upload');

				// perform callback
				//
				if (options && options.success) {
					options.success();
				}
			}
		});
	},

	onDropOnChild: function(items, child, options) {
		this.getChildView('items').moveItems(items, child.model, {

			// callbacks
			//
			success: () => {

				// play move sound
				//
				application.play('move');

				// perform callback
				//
				if (options && options.success) {
					options.success();
				}
			}
		});
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