/******************************************************************************\
|                                                                              |
|                              system-settings.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a set of a user's system settings.            |
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

	category: Browser.device != 'desktop'? Browser.device + '_' + 'system' : 'system',
	defaults: UserSettings.toKeyValuePairs(config.defaults.settings, Browser.device)
});