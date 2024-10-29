/******************************************************************************\
|                                                                              |
|                              page-tiles-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a grid of page tiles.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserPreferences from '../../../../../../models/preferences/user-preferences.js';
import TilesView from '../../../../../../views/items/tiles/tiles-view.js';
import PageTileView from '../../../../../../views/apps/pdf-viewer/sidebar/pages/tiles/page-tile-view.js';

export default TilesView.extend({

	//
	// attributes
	//

	childView: PageTileView,

	// do not respond to events / do not seselect on click
	//
	events: {},

	//
	// rendering methods
	//

	childViewOptions: function(model) {
		return {
			model: model,

			// options
			//
			// preferences: this.options.preferences,
			preferences: new UserPreferences({
				view_kind: this.options.preferences.get('view_kind'),
				tile_size: this.options.preferences.get('tile_size')
			}),
			selected: model && model.is(this.options.selected),

			// capabilities
			//
			selectable: this.options.selectable,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		};
	}
});