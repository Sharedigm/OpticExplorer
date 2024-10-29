/******************************************************************************\
|                                                                              |
|                                files-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying and manipulating files.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FilesView from '../../../../../views/apps/file-browser/mainbar/files/files-view.js';
import DirectoryIconsView from '../../../../../views/apps/search-viewer/mainbar/files/icons/directory-icons-view.js';
import DirectoryListView from '../../../../../views/apps/search-viewer/mainbar/files/lists/directory-list-view.js';
import DirectoryTilesView from '../../../../../views/apps/search-viewer/mainbar/files/tiles/directory-tiles-view.js';
import DirectoryCardsView from '../../../../../views/apps/search-viewer/mainbar/files/cards/directory-cards-view.js';

export default FilesView.extend({

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			max_score: this.options.max_score
		};
	},

	showIcons: function() {

		// show directory icons
		//
		this.showChildView('items', new DirectoryIconsView(_.extend({}, this.options, {
			collection: this.collection,

			// options
			//
			filter: this.options.filter || this.filter,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropout: (items) => this.onDropOut(items)
		})));
	},

	showLists: function(inline) {

		// show directory lists
		//
		this.showChildView('items', new DirectoryListView(_.extend({}, this.options, {
			collection: this.collection,

			// options
			//
			inline: inline,
			filter: this.options.filter || this.filter,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropout: (items) => this.onDropOut(items)
		})));
	},

	showTiles: function() {

		// show directory tiles
		//
		this.showChildView('items', new DirectoryTilesView(_.extend({}, this.options, {
			collection: this.collection,

			// options
			//
			filter: this.options.filter || this.filter,
			tile_size: this.options.preferences? this.options.preferences.get('tile_size') : undefined,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropout: (items) => this.onDropOut(items)
		})));
	},

	showCards: function() {

		// show directory cards
		//
		this.showChildView('items', new DirectoryCardsView(_.extend({}, this.options, {
			collection: this.collection,

			// options
			//
			filter: this.options.filter || this.filter,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropout: (items) => this.onDropOut(items)
		})));
	}
});