/******************************************************************************\
|                                                                              |
|                       open-desktop-app-dialog-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box to select a desktop app to open.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Apps from '../../../../../collections/apps/apps.js';
import OpenAppDialogView from '../../../../../views/apps/app-launcher/dialogs/apps/open-app-dialog-view.js';
import AppLaunchable from '../../../../../views/apps/common/behaviors/opening/app-launchable.js';

export default OpenAppDialogView.extend({

	//
	// dialog attributes
	//
	
	title: "Open Desktop App",

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		OpenAppDialogView.prototype.initialize.call(this);
		
		// set attributes
		//
		this.collection = new Apps(application.apps.filter(AppLaunchable.filters.desktop));
	}
});