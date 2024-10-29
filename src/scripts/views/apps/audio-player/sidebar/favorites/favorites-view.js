/******************************************************************************\
|                                                                              |
|                               favorites-view.js                              |
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

import BaseView from '../../../../../views/base-view.js';
import FilesView from '../../../../../views/apps/file-browser/mainbar/files/files-view.js';
import FavoritesTreeView from '../../../../../views/apps/audio-player/sidebar/favorites/trees/favorites-tree-view.js';

export default FilesView.extend({

	//
	// rendering methods
	//

	showTrees: function() {

		// show directory tree
		//
		this.showChildView('items', new FavoritesTreeView(_.extend({}, this.options, {
			model: this.model,
			collection: this.collection,

			// views
			//
			emptyView: BaseView.extend({
				className: 'empty',
				template: template('No favorites.')
			}),

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