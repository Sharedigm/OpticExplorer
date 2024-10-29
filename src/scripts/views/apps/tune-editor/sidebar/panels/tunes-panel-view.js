/******************************************************************************\
|                                                                              |
|                              tunes-panel-view.js                             |
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
import Directory from '../../../../../models/storage/directories/directory.js';
import Items from '../../../../../collections/storage/items.js';
import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';
import FilesView from '../../../../../views/apps/file-browser/mainbar/files/files-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'tunes panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-music"></i>Tunes</label>
		
			<div class="buttons">
				<button type="button" class="new-tune success btn btn-sm" data-toggle="tooltip" title="New Tune">
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
		'click .new-tune': 'onClickNewTune'
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

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		SideBarPanelView.prototype.onRender.call(this);

		// check if loaded
		//
		if (this.model && !this.model.loaded) {

			// load
			//
			this.model.load({

				// callbacks
				//
				success: () => this.onLoad(),
				error: () => this.onLoad()
			});
		} else {
			this.showTunes();
		}
	},

	showTunes: function() {
		this.showChildView('items', new FilesView({
			model: this.model,
			collection: this.model.contents,

			// options
			//
			preferences: UserPreferences.create('file_browser', {
				// view_kind: this.options.view_kind
				view_kind: 'trees'
			}),
			selected: new Items([this.model]),
			empty: "No tunes.",
			filter: (view) => {
				return view.model instanceof Directory ||
					view.model.get('path').endsWith('.abc');
			},

			// capabilities
			//
			selectable: true,

			// callbacks
			//
			onopen: (item) => {
				this.onOpen(item);
			}
		}));
	},

	//
	// mouse event handling methods
	//

	onClickNewTune: function() {
		this.app.newFile();
	},

	//
	// file event handling methods
	//

	onLoad: function() {
		this.showTunes();
	},

	onOpen: function(item) {

		// open item using app
		//
		if (item.model instanceof Directory) {
			this.app.pushDirectory(item.model);
		} else {
			this.app.openItem(item.model);
		}		
	}
});