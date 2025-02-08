/******************************************************************************\
|                                                                              |
|                             audio-split-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying audio files.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SplitView from '../../../../views/layout/split-view.js';
import AudioAnalyserView from '../../../../views/apps/audio-player/mainbar/audio-analyser-view.js';
import AudioFilesView from '../../../../views/apps/audio-player/mainbar/audio-files-view.js';

export default SplitView.extend({

	//
	// attributes
	//

	orientation: 'vertical',
	flipped: true,

	//
	// querying methods
	//

	hasSelected: function() {
		if (this.hasChildView('mainbar')) {
			return this.getChildView('mainbar').hasSelected();
		}
	},

	//
	// getting methods
	//

	getSelected: function() {
		if (this.hasChildView('mainbar')) {
			return this.getChildView('mainbar').getSelected();
		}
	},

	getSelectedModels: function() {
		if (this.hasChildView('mainbar')) {
			return this.getChildView('mainbar').getSelectedModels();
		}
	},
	
	//
	// setting methods
	//

	setOption: function(key, value) {
		if (this.hasChildView('mainbar')) {
			this.getChildView('mainbar').setOption(key, value);
		}
	},

	//
	// rendering methods
	//

	getSideBarView: function() {
		return new AudioAnalyserView({
			model: this.model
		});
	},

	getContentView: function() {
		return new AudioFilesView(_.extend({}, this.options, {
			model: this.model,
			collection: this.collection,

			// options
			//
			selected: null,

			// capabilities
			//
			selectable: true,
			editable: false,
			draggable: false,
			droppable: false,
			markable: true
		}));
	},

	showSideBar: function() {
		SplitView.prototype.showSideBar.call(this);
		this.getChildView('sidebar').start();
	},

	hideSideBar: function() {
		SplitView.prototype.hideSideBar.call(this);
		this.getChildView('sidebar').stop();
	},

	//
	// event handling methods
	//

	onPlay: function() {
		if (this.hasChildView('sidebar')) {
			this.getChildView('sidebar').onPlay();
		}
	},

	onStart: function() {
		if (this.hasChildView('sidebar')) {
			this.getChildView('sidebar').onStart();
		}	
	},
	
	onPause: function() {
		if (this.hasChildView('sidebar')) {
			this.getChildView('sidebar').onPause();
		}
	},

	//
	// focus event handling methods
	//

	onFocus: function() {
		if (this.hasChildView('mainbar') && this.getChildView('mainbar').onFocus) {
			this.getChildView('mainbar').onFocus();
		}
	},

	onBlur: function() {
		if (this.hasChildView('mainbar') && this.getChildView('mainbar').onBlur) {
			this.getChildView('mainbar').onBlur();
		}
	}
});