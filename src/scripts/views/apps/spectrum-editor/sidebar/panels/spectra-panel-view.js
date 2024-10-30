/******************************************************************************\
|                                                                              |
|                            spectra-panel-view.js                             |
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
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Directory from '../../../../../models/storage/directories/directory.js';
import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import BaseView from '../../../../../views/base-view.js';
import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';
import EditableFilesView from '../../../../../views/apps/file-browser/mainbar/files/editable-files-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'wavelengths panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-rainbow"></i>Spectra</label>
		
			<div class="buttons">
				<button type="button" class="new-spectrum success btn btn-sm" data-toggle="tooltip" title="New Spectrum">
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
		'click .new-spectrum': 'onClickNewSpectrum'
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
			preferences: UserPreferences.create('file_browser', {
				view_kind: this.options.view_kind
			}),
			emptyView: BaseView.extend({
				className: 'empty',
				template: template("No spectra.")
			}),

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

	onClickNewSpectrum: function() {
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
			this.app.openFile(item.model);

			// deselect sidebar items
			//
			// this.getChildView('items').deselectAll();
		}
	},

	//
	// drag and drop event handling methods
	//

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