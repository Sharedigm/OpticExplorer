/******************************************************************************\
|                                                                              |
|                               space-settings.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a set of space settings.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserSettings from '../../models/settings/user-settings.js';
import Browser from '../../utilities/web/browser.js';

export default UserSettings.extend({

	//
	// attributes
	//

	category: Browser.device != 'desktop'? Browser.device + '_' + 'space' : 'space',

	//
	// constructor
	//

	initialize: function() {

		// listen for changes
		//
		this.on('change', this.onChange);
	},
	
	//
	// setting methods
	//

	apply: function(view) {
		if (!view && !this.view) {
			return;
		}

		// set attributes
		//
		if (view) {
			this.view = view;
		} else {
			view = this.view;
		}

		// update view
		//
		if (view) {

			// set desktop settings
			//
			if (view.loadApp) {
				if (this.has('desktop_app')) {
					view.loadApp(this.get('desktop_app'));
				}
			}
		}
	},

	reapply: function(view) {
		if (!view && !this.view) {
			return;
		}

		// set attributes
		//
		if (view) {
			this.view = view;
		} else {
			view = this.view;
		}

		// update view
		//
		if (view) {
			if (this.changed.desktop_app !== undefined) {
				view.loadApp(this.get('desktop_app'));
			}
		}
	},

	//
	// event handling methods
	//

	onChange: function() {

		// apply to previous view
		//
		this.reapply(this.view);
	}
});