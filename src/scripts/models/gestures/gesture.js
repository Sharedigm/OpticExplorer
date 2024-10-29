/******************************************************************************\
|                                                                              |
|                                 gesture.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an instance of a gesture (poke etc).          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Timestamped from '../../models/utilities/timestamped.js';
import User from '../../models/users/user.js';

export default Timestamped.extend({

	//
	// attributes
	//

	defaults: {
		kind: 'poke',
		recipient_id: undefined
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/gestures',

	//
	// play gesture sound
	//

	getSound: function() {
		switch (this.get('kind')) {
			case 'poke':
				return application.sounds.pling;
			case 'wink':
				return application.sounds.ting;
			case 'wave':
				return application.sounds.whoosh;
			case 'peace-sign':
				return application.sounds.chirp;
			case 'live-long-and-prosper':
				return application.sounds.warp;
			case 'hug':
				return application.sounds.aww;
			case 'kiss':
				return application.sounds.kiss;
		}
	},

	play: function() {
		let sound = this.getSound();

		// create new audio context
		//
		if (!application.audio) {
			application.audio = new Audio();
		}

		if (sound) {
			sound.play(application.audio);
		}
	},

	reply: function(options) {
		return new this.constructor().save({
			kind: this.get('kind'),
			recipient_id: this.get('sender').get('id')
		}, options);
	},

	//
	// parsing (Backbone) methods
	//

	parse: function(response) {

		// call superclass method
		//
		let data = Timestamped.prototype.parse.call(this, response);

		// parse attributes
		//
		if (data.sender) {
			data.sender = new User(data.sender, {
				parse: true
			});
		}
		if (data.recipient) {
			data.recipient = new User(data.recipient, {
				parse: true
			});
		}

		return data;
	}
});
