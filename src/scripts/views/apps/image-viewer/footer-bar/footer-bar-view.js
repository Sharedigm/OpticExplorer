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
import ImageBarView from '../../../../views/apps/image-viewer/footer-bar/image-bar/image-bar-view.js';
import StatusBarView from '../../../../views/apps/image-viewer/footer-bar/status-bar/status-bar-view.js';

export default FooterBarView.extend({

	//
	// attributes
	//

	toolbars: ['window', 'image', 'status'],

	//
	// getting methods
	//

	getImageBarView: function() {
		return new ImageBarView({
			imageNumber: this.collection? this.collection.indexOf(this.model) + 1 : undefined,
			numImages: 	this.collection? this.collection.length : undefined
		});
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
			case 'image':
				this.showImageBar();
				break;
			case 'status':
				this.showStatusBar();
				break;
		}
	},

	showWindowBar: function() {
		this.showChildView('window', this.getWindowBarView());
	},

	showImageBar: function() {
		this.showChildView('image', this.getImageBarView());
		this.getChildView('image').$el.addClass('windowed-app-only');
	},

	showStatusBar: function() {
		this.showChildView('status', this.getStatusBarView());
	}
});