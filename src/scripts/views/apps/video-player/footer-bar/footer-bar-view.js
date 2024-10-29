/******************************************************************************\
|                                                                              |
|                              footer-bar-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used to display an app's footer bar.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FooterBarView from '../../../../views/apps/common/footer-bar/footer-bar-view.js';
import VideoBarView from '../../../../views/apps/video-player/footer-bar/video-bar/video-bar-view.js';
import StatusBarView from '../../../../views/apps/video-player/footer-bar/status-bar/status-bar-view.js';

export default FooterBarView.extend({

	//
	// attributes
	//

	toolbars: ['window', 'video', 'status'],

	//
	// getting methods
	//

	getVideoBarView: function() {
		return new VideoBarView();
	},

	getStatusBarView: function() {
		return new StatusBarView();
	},

	//
	// rendering methods
	//

	showToolbar: function(kind) {
		switch (kind) {
			case 'window':
				this.showWindowBar();
				break;
			case 'video':
				this.showVideoBar();
				break;
			case 'status':
				this.showStatusBar();
				break;
		}
	},

	showWindowBar: function() {
		this.showChildView('window', this.getWindowBarView());
	},

	showVideoBar: function() {
		this.showChildView('video', this.getVideoBarView());
		this.getChildView('video').$el.addClass('windowed-app-only');
	},

	showStatusBar: function() {
		this.showChildView('status', this.getStatusBarView());
	}
});