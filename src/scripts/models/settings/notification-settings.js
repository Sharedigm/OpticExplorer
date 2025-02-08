/******************************************************************************\
|                                                                              |
|                           notification-settings.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a set of a user's notification settings.      |
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

export default UserSettings.extend({

	//
	// attributes
	//

	category: 'notifications',
	defaults: {
		connect_invitations: [],
		share_invitations: [],
		topic_invitations: [],
		chat_invitations: [],
		comments: [],
		replies: [],
		likes: []
	},

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

	apply: function() {

		// set static attributes
		//
		this.constructor.current = this;
	},

	reset: function() {
		this.set(this.defaults);
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.apply();
	}
}, {

	//
	// static attributes
	//

	current: null
});