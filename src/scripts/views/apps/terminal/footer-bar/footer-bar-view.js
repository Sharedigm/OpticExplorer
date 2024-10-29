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

export default FooterBarView.extend({

	//
	// attributes
	//

	toolbars: ['window'],

	//
	// getting methods
	//

	getStatusBarView: function() {
		return null;
	},

	//
	// rendering methods
	//

	showToolbar: function(kind) {
		switch (kind) {
			case 'window':
				this.showWindowBar();
				break;
		}
	}
});