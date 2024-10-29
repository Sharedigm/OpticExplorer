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
import AudioBarView from '../../../../views/apps/audio-player/footer-bar/audio-bar/audio-bar-view.js';
import StatusBarView from '../../../../views/apps/audio-player/footer-bar/status-bar/status-bar-view.js';

export default FooterBarView.extend({

	//
	// attributes
	//

	toolbars: ['window', 'audio', 'status'],

	//
	// getting methods
	//

	getAudioBarView: function() {
		return new AudioBarView({
			trackNumber: this.collection? this.collection.indexOf(this.model) + 1 : undefined,
			numTracks: 	this.collection? this.collection.length : undefined
		});
	},

	getStatusBarView: function() {
		return new StatusBarView({
			model: this.model,
			status: 'Not Playing'
		});
	},

	//
	// rendering methods
	//

	showToolbar: function(kind) {
		switch (kind) {
			case 'window':
				this.showWindowBar();
				break;
			case 'audio':
				this.showAudioBar();
				break;
			case 'status':
				this.showStatusBar();
				break;
		}
	},

	showWindowBar: function() {
		this.showChildView('window', this.getWindowBarView());
	},

	showAudioBar: function() {
		this.showChildView('audio', this.getAudioBarView());
		this.getChildView('audio').$el.addClass('windowed-app-only');
	},

	showStatusBar: function() {
		this.showChildView('status', this.getStatusBarView());
	}
});