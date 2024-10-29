/******************************************************************************\
|                                                                              |
|                              header-bar-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used to display an app's header bar.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import HeaderBarView from '../../../../views/apps/common/header-bar/header-bar-view.js';
import MenuBarView from '../../../../views/apps/video-player/header-bar/menu-bar/menu-bar-view.js';
import ClipBarView from '../../../../views/apps/video-player/header-bar/clip-bar/clip-bar-view.js';
import VolumeBarView from '../../../../views/apps/video-player/header-bar/volume-bar/volume-bar-view.js';
import VideoBarView from '../../../../views/apps/video-player/header-bar/video-bar/video-bar-view.js';
import Browser from '../../../../utilities/web/browser.js';

export default HeaderBarView.extend({

	//
	// attributes
	//

	toolbars: ['menu', 'clip', 'volume', 'video'],

	//
	// rendering methods
	//

	showToolbar: function(kind) {
		switch (kind) {
			case 'menu':
				this.showMenuBar();
				break;
			case 'clip':
				this.showClipBar();
				break;
			case 'volume':
				this.showVolumeBar();
				break;
			case 'video':
				this.showVideoBar();
				break;
		}
	},

	showMenuBar: function() {
		this.showChildView('menu', new MenuBarView({
			preferences: this.parent.preferences
		}));
	},

	showClipBar: function() {
		this.showChildView('clip', new ClipBarView({

			// options
			//
			duration: this.parent.model? this.parent.model.getSeconds() : null,
			progress: this.parent.options.progress,
			repeatable: true,

			// callbacks
			//
			onplay: () => this.parent.onPlay(),
			onpause: () => this.parent.onPause(),
			onchange: (time) => {
				if (this.parent.isPlaying()) {
					this.parent.pause();
				}
				this.parent.setClipTime(time);
			}
		}));
	},

	showVolumeBar: function() {

		// do not show volume control for mobile
		//
		if (Browser.is_mobile) {
			return;
		}

		this.showChildView('volume', new VolumeBarView({
			volume: this.parent.preferences.get('volume'),

			// callbacks
			//
			onchange: (volume) => this.parent.getVideoView().setVolume(volume / 10)
		}));
	},

	showVideoBar: function() {
		this.showChildView('video', new VideoBarView());
		this.getChildView('video').$el.addClass('desktop-app-only');
	},
});