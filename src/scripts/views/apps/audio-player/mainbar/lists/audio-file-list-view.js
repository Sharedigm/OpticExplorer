/******************************************************************************\
|                                                                              |
|                            audio-file-list-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a directory list of items.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import DirectoryListView from '../../../../../views/apps/file-browser/mainbar/files/lists/directory-list-view.js';
import AudioFileItemView from '../../../../../views/apps/audio-player/mainbar/lists/audio-file-list-item-view.js';

export default DirectoryListView.extend({

	//
	// attributes
	//

	childView: AudioFileItemView,

	//
	// rendering methods
	//

	childViewOptions: function(model) {
		return _.extend(_.extend({}, this.options, {
			model: model,

			// state
			//
			selected: this.options.selected && this.options.selected.contains(model)
		}));
	},

	//
	// window event handling methods
	//

	onFocus: function() {
		this.each((child) => child.onFocus());
	},

	onBlur: function() {
		this.each((child) => child.onBlur());
	}
});