/******************************************************************************\
|                                                                              |
|                                  pages-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying pages.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ItemsView from '../../../../../views/items/items-view.js';
import PageIconsView from '../../../../../views/apps/pdf-viewer/sidebar/pages/icons/page-icons-view.js';
import PageTilesView from '../../../../../views/apps/pdf-viewer/sidebar/pages/tiles/page-tiles-view.js';

export default ItemsView.extend({

	//
	// rendering methods
	//

	showIcons: function() {

		// show icon grid
		//
		this.showChildView('items', new PageIconsView(_.extend({}, this.options, {
			collection: this.collection
		})));
	},

	showTiles: function() {
		
		// show tile grid
		//
		this.showChildView('items', new PageTilesView(_.extend({}, this.options, {
			collection: this.collection
		})));
	}
});