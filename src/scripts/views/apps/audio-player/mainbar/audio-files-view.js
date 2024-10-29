/******************************************************************************\
|                                                                              |
|                             audio-files-view.js                              |
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

import FilesView from '../../../../views/apps/file-browser/mainbar/files/files-view.js';
import AudioFileListView from '../../../../views/apps/audio-player/mainbar/lists/audio-file-list-view.js';

export default FilesView.extend({

	//
	// rendering methods
	//

	showLists: function() {

		// show list
		//
		this.showChildView('items', new AudioFileListView(_.extend({}, this.options, {
			collection: this.collection,

			// options
			//
			filter: this.options.filter || this.filter,

			// callbacks
			//
			onplay: (item) => this.onPlay(item),
			onpause: (item) => this.onPause(item),
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropout: (items) => this.onDropOut(items)
		})));
	},

	onRender: function() {
		this.showLists();
	},

	//
	// event handling methods
	//

	onPlay: function(item) {

		// perform callback
		//
		if (this.options.onplay) {
			this.options.onplay(item);
		}
	},

	onPause: function(item) {

		// perform callback
		//
		if (this.options.onpause) {
			this.options.onpause(item);
		}
	},

	//
	// window event handling methods
	//

	onFocus: function() {
		if (this.hasChildView('items')) {
			this.getChildView('items').onFocus();
		}
	},

	onBlur: function() {
		if (this.hasChildView('items')) {
			this.getChildView('items').onBlur();
		}
	}
});