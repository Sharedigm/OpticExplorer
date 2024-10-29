/******************************************************************************\
|                                                                              |
|                            contacts-panel-view.js                            |
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
import Items from '../../../../../collections/storage/items.js';
import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';
import FilesView from '../../../../../views/apps/file-browser/mainbar/files/files-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'contacts panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-id-card"></i>Contacts</label>
		
			<div class="buttons">
				<button type="button" class="add-contact success btn btn-sm" data-toggle="tooltip" title="Add Contact">
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
		'click .add-contact': 'onClickAddContact'
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

	setSelectedModel: function(model, options) {
		this.getChildView('items').setSelectedModels([model], options);
	},

	load: function(model) {
		this.model = model;

		// check if contacts need to be loaded
		//
		if (!this.model.loaded && application.session.user) {

			// load contacts
			//
			this.model.load({

				// callbacks
				//
				success: (model) => {

					// check if view still exists
					//
					if (this.isDestroyed()) {
						return;
					}

					// show child views
					//
					this.showFiles();

					// perform callback
					//
					if (this.options.onload) {
						this.options.onload(model);
					}
				},

				error: () => {

					// show child views
					//
					this.showFiles();

					// reset home directory path
					//
					this.model.set({
						path: ''
					});
				}
			});
		} else {
			this.showFiles();
		}
	},
	
	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		SideBarPanelView.prototype.onRender.call(this);

		// load contacts
		//
		this.load(this.model);
	},

	showFiles: function() {
		this.showChildView('items', new FilesView({
			collection: this.model.contents,

			// options
			//
			preferences: UserPreferences.create('contact_editor', {
				view_kind: this.options.view_kind,
			}),
			selected: new Items([this.app.model]),
			empty: "No contacts.",

			// capabilities
			//
			selectable: true,
			deselectable: true,
			editable: false,
			draggable: true,
			droppable: true,

			// views
			//
			viewFilter: function(view) {
				return view.model instanceof Directory && !view.model.isHidden() || view.model.getFileExtension() == 'vcf';
			},

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen
		}));
	},

	//
	// mouse event handling methods
	//

	onClickAddContact: function() {
		this.app.showNewContactDialog();
	}
});