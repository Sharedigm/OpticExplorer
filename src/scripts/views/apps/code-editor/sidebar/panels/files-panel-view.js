/******************************************************************************\
|                                                                              |
|                              files-panel-view.js                             |
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

import File from '../../../../../models/storage/files/file.js';
import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';
import EditableFilesView from '../../../../../views/apps/file-browser/mainbar/files/editable-files-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'files panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-folder"></i>Files</label>
		
			<div class="buttons">
				<button type="button" class="new-folder btn btn-sm" data-toggle="tooltip" title="New Folder">
					<i class="fa fa-plus"></i>
				</button>
			</div>
		</div>

		<div class="items"></div>
	`),

	regions: {
		'items': '.items'
	},

	events: {
		'click .new-folder': 'onClickNewFolder'
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('items')) {
			this.getChildView('items').each(callback, filter, options);
		}
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
		return this.getChildView('items').getSelected();
	},

	getSelectedModels: function() {
		return this.getChildView('items').getSelectedModels();
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

	setSelected: function(model, options) {
		this.getChildView('items').setSelectedModels([model], options);

		// scroll into view
		//
		this.scrollTo(this.getSelected()[0]);
	},

	//
	// loading methods
	//

	loadFiles: function(done) {

		// load directory
		//
		this.request = this.model.load({

			// callbacks
			//
			success: () => {

				// perform callback
				//
				if (this.options.onload) {
					this.options.onload(this.model);
				}

				if (done) {
					done(this.model);
				}
			},

			error: () => {

				// reset home directory path
				//
				this.model.set({
					path: ''
				});
			}
		});
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
		this.request = this.model.load({

			// callbacks
			//
			success: () => {
				this.showFiles();
			}
		});

		// set initial state
		//
		if (!application.isSignedIn()) {
			this.$el.find('.buttons .new-folder').prop('disabled', true);
		}
	},

	showFiles: function() {
		this.showChildView('items', new EditableFilesView({
			model: this.model,
			collection: this.model.contents,

			// options
			//
			preferences: UserPreferences.create('file_browser', {
				view_kind: this.options.view_kind,
				show_file_extensions: true
			}),

			// state
			//
			selected: this.options.selected,

			// capabilities
			//
			selectable: true,
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

	update: function() {
		this.request = this.loadFiles(() => {
			this.showFiles();
		});
	},

	//
	// mouse event handling methods
	//

	onClickNewFolder: function() {
		this.app.newFolder();
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
	// file event handling methods
	//

	onOpen: function(item) {

		// open item using app
		//
		if (item.model instanceof File) {
			this.app.openItem(item.model);

		// open folder
		//
		} else {
			this.app.pushDirectory(item.model);
		}
	},

	//
	// drag and drop event handling methods
	//

	onDropInItems: function(items, child, options) {
		this.app.uploadItems(items, child.model, {

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