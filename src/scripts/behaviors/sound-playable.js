/******************************************************************************\
|                                                                              |
|                              sound-playable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for playing sounds.                           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Audio from '../utilities/multimedia/audio.js';
import Sound from '../utilities/multimedia/sound.js';

export default {

	//
	// attributes
	//

	sounds: [],

	//
	// creating methods
	//

	createSounds: function(names) {
		for (let i = 0; i < names.length; i++) {
			let name = names[i];
			this.sounds[name] = new Sound({
				url: config.sounds[name]
			});
		}
	},

	//
	// querying methods
	//

	isMuted: function() {
		return this.settings.system.get('mute_sounds');
	},

	//
	// getting methods
	//

	getSound: function(kind) {
		if (this.settings.sound && this.settings.sound.has(kind)) {
			let name = this.settings.sound.get(kind);
			if (name && this.sounds[name]) {
				return this.sounds[name];
			}
		}
	},

	getMuted: function() {
		return this.settings.system.get('mute_sounds');
	},

	getVolume: function() {
		return this.settings.system.get('volume');
	},

	//
	// setting methods
	//

	setMuted: function(muted) {

		// save muted setting
		//
		this.settings.system.save({
			mute_sounds: muted
		});
	},

	setVolume: function(volume) {

		// save volume setting
		//
		this.settings.system.save({
			volume: volume
		});
	},

	//
	// playing methods
	//

	play: function(kind) {
		if (this.isMuted()) {
			return;
		}

		// create new audio context
		//
		if (!this.audio) {
			this.audio = new Audio();
		}

		// find sound
		//
		let sound = this.getSound(kind);
		if (sound) {

			// play sound
			//
			sound.setVolume(this.getVolume() / 10);
			sound.play(this.audio);
		}
	}
};