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
import StatusBarView from '../../../../views/apps/map-viewer/footer-bar/status-bar/status-bar-view.js';

export default FooterBarView.extend({

	//
	// getting methods
	//

	getStatusBarView: function() {
		return new StatusBarView();
	},

	//
	// event handling methods
	//

	onChange: function(attribute) {
		switch (attribute) {

			case 'offset':

				// update lat / long in footer
				//
				if (this.hasChildView('status')) {
					this.getChildView('status').update();
				}
				break;

			case 'scale':
				break;

			case 'size':
				break;

			default:
				break;
		}

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(attribute);
		}
	}
});