/******************************************************************************\
|                                                                              |
|                             video-split-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying video files.                  |
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
import VideoView from '../../../../views/apps/video-player/mainbar/video-view.js';
import VideoInfoView from '../../../../views/apps/video-player/mainbar/video-info-view.js';

export default SplitView.extend({

	//
	// attributes
	//

	orientation: 'vertical',
	sizes: [50, 50],
	flipped: true,

	//
	// setting methods
	//

	setOption: function(key, value) {
		switch (key) {

			// mainbar options
			//
			case 'show_video_info':
				this.setSideBarVisibility(value);
				break;
			case 'info_bar_size':
				this.setSideBarSize(value);
				break;

			default:
				this.getChildView('mainbar').setOption(key, value);
		}
	},

	//
	// rendering methods
	//

	getSideBarView: function() {
		return new VideoInfoView({
			model: this.model
		});
	},

	getContentView: function() {
		return new VideoView({
			model: this.model,

			// options
			//
			preferences: this.options.preferences,

			// callbacks
			//
			onload: this.options.onload,
			onerror: this.options.onerror
		});
	}
});