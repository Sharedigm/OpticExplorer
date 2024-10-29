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
import PageBarView from '../../../../views/apps/help-viewer/footer-bar/page-bar/page-bar-view.js';
import StatusBarView from '../../../../views/apps/help-viewer/footer-bar/status-bar/status-bar-view.js';

export default FooterBarView.extend({

	//
	// attributes
	//

	toolbars: ['window', 'page', 'status'],

	//
	// getting methods
	//

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
			case 'page':
				this.showPageBar();
				break;
			case 'status':
				this.showStatusBar();
				break;
		}
	},

	showPageBar: function() {
		this.showChildView('page', new PageBarView({
			numPages: this.parent.index.length
		}));
		this.getChildView('page').$el.addClass('windowed-app-only');
	},

	showStatusBar: function() {
		this.showChildView('status', this.getStatusBarView());
	}
});