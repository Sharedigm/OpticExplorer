/******************************************************************************\
|                                                                              |
|                             themes-panel-view.js                             |
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

	className: 'themes panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-paint-brush"></i>Themes</label>
		</div>
		
		<div class="items"></div>
	`),

	regions: {
		'items': '.items'
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

	setSelected: function(model, options) {
		if (this.hasChildView('items')) {
			this.getChildView('items').setSelectedModels([model], options);
		}
	},

	setSelectedModel: function(model, options) {
		if (this.hasChildView('items')) {
			this.getChildView('items').setSelectedModels([model], options);
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
		if (!this.model.loaded && application.session.user) {
			this.model.load({

				// callbacks
				//
				success: () => this.onLoad(),
				error: () => this.onLoad()
			});
		} else {
			this.showFiles();
		}
	},

	showFiles: function() {
		let extensions = application.settings.associations.getFileExtensions('theme_manager');

		if (!this.hasRegion('items')) {
			return;
		}

		this.showChildView('items', new FilesView({
			model: this.model,
			collection: this.model.contents,

			// options
			//
			preferences: UserPreferences.create('file_browser', {
				view_kind: this.options.view_kind
			}),
			selected: new Items([this.model]),
			empty: "No themes.",
			viewFilter: (view) => {
				return view.model instanceof Directory && !view.model.isHidden() ||
					extensions.contains(view.model.getFileExtension());
			},

			// capabilities
			//
			selectable: true,
			editable: false,

			// callbacks
			//
			onselect: (item) => this.onOpen(item)
		}));

		this.updateCount();
	},

	//
	// updating methods
	//

	updateCount: function() {

		// update count
		//
		this.app.showFooterBar();
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// show child views
		//
		this.showFiles();

		// perform callback
		//
		if (this.options.onload) {
			this.options.onload();
		}
	},

	//
	// file event handling methods
	//

	onOpen: function(item) {

		// open item
		//
		if (item.model instanceof Directory) {
			this.app.pushDirectory(item.model);
		} else {
			this.app.openItem(item.model);
		}		
	}
});