/******************************************************************************\
|                                                                              |
|                              pages-panel-view.js                             |
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
import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';
import PageTilesView from '../../../../../views/apps/pdf-viewer/sidebar/pages/tiles/page-tiles-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'pages panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-file"></i>Pages</label>
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
		this.showPages();
	},

	showPages: function() {
		this.showChildView('items', new PageTilesView({
			collection: this.collection,

			// options
			//
			preferences: UserPreferences.create('file_browser', {
				view_kind: this.options.view_kind,
				tile_size: this.options.tile_size
			}),
			selected: this.collection.at(0),
			empty: "No pages.",
			letterboxed: true,

			// capabilities
			//
			selectable: true,

			// callbacks
			//
			onselect: (item) => this.onSelect(item)
		}));
	},

	//
	// selection event handling methods
	//

	onSelect: function(item) {
		this.app.setPageNumber(item.model.get('page_number'));
	}
});