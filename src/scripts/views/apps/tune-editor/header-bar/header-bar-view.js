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
import NavBarView from '../../../../views/apps/tune-editor/header-bar/nav-bar/nav-bar-view.js';
import MenuBarView from '../../../../views/apps/tune-editor/header-bar/menu-bar/menu-bar-view.js';
import TrackBarView from '../../../../views/apps/tune-editor/header-bar/track-bar/track-bar-view.js';

export default HeaderBarView.extend({

	//
	// attributes
	//

	toolbars: ['nav', 'menu', 'track'],

	//
	// rendering methods
	//

	showToolbar: function(kind) {
		switch (kind) {
			case 'nav':
				this.showNavBar();
				break;
			case 'menu':
				this.showMenuBar();
				break;
			case 'track':
				this.showTrackBar();
				break;
		}
	},

	showNavBar: function() {
		this.showChildView('nav', new NavBarView({
			model: this.parent.directory,

			// callbacks
			//
			onchange: (directory, options) => this.setDirectory(directory, options)
		}));
	},

	showMenuBar: function() {
		this.showChildView('menu', new MenuBarView({
			preferences: this.parent.preferences
		}));
	},

	showTrackBar: function() {
		this.showChildView('track', new TrackBarView({

			// options
			//
			length: undefined,
			progress: this.parent.options.progress,
			repeatable: true,

			// callbacks
			//
			onplay: () => this.parent.play(),
			onpause: () => this.parent.pause(),
			onchange: (time) => {
				if (this.parent.isPlaying()) {
					this.parent.pause();
				}
				this.parent.setTrackTime(time);
			}
		}));
	}
});