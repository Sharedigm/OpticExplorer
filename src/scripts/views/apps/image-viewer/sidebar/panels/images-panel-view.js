/******************************************************************************\
|                                                                              |
|                             images-panel-view.js                             |
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

import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import Items from '../../../../../collections/storage/items.js';
import ImageFile from '../../../../../models/storage/media/image-file.js';
import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';
import FilesView from '../../../../../views/apps/file-browser/mainbar/files/files-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'images panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-image"></i>Images</label>

			<div class="buttons">
				<button type="button" class="open-images btn btn-sm" data-toggle="tooltip" title="Open Images">
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
		'click .open-images': 'onClickOpenImages'
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

	setSelectedModel: function(model, options) {
		this.getChildView('items').setSelectedModels([model], options);
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
		this.showImages();
	},

	showImages: function() {
		this.showChildView('items', new FilesView({
			collection: this.collection,

			// options
			//
			preferences: UserPreferences.create('file_browser', {
				view_kind: this.options.view_kind,
				tile_size: this.options.tile_size
			}),
			empty: "No images.",
			selected: new Items([this.model]),
			filter: function(item) {
				return item.model instanceof ImageFile;
			},

			// capabilities
			//
			selectable: true,
			deselectable: false,
			editable: false,

			// callbacks
			//
			onselect: (event) => this.onSelect(event)
		}));
	},

	//
	// mouse event handling methods
	//

	onClickOpenImages: function() {
		this.parent.app.showOpenDialog();
	},

	//
	// selection event handling methods
	//

	onSelect: function() {
		let selected = this.parent.getSelected();

		// load selected file
		//
		if (selected.length > 0) {
			this.app.loadFile(selected[0].model);
		}

		// pause slide show
		//
		if (this.app.hasChildView('header nav')) {
			this.app.getChildView('header nav').pause();
		}
	}
});