/******************************************************************************\
|                                                                              |
|                            dock-app-icons-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a row of app launcher dock icons.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import DockIconsView from '../../../../../views/apps/desktop/dock/dock-icons-view.js';
import DockAppIconView from '../../../../../views/apps/desktop/dock/dock-app-icons/dock-app-icon-view.js';

export default DockIconsView.extend( {

	//
	// attributes
	//

	className: 'apps',
	childView: DockAppIconView,

	//
	// constructor
	//

	initialize: function() {

		// force Finder to beginning of list
		//
		this.collection.comparator = (model) => {
			if (model.get('name') != 'Finder') {
				return model.get('name');
			} else {
				return 'AAA';
			}
		};
		this.collection.sort();
	}
});