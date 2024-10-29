/******************************************************************************\
|                                                                              |
|                                   audio.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a basic HTML5 audio class.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default class Audio {

	constructor() {
		
		// set attributes
		//
		this.verbose = false;
		this.loaded = false;
		this.elapsed_time = 0;

		// initialize audio system
		//
		this.initialize();
	}

	initialize() {

		// create new context
		//
		if (!this.context) {
			this.context = Audio.AudioContext? new Audio.AudioContext() : undefined;
		}
	}

	unlock(done) {

		let unlock = () => {
			this.intialize();

			// done listening for user interaction
			//
			window.removeEventListener('mousedown', unlock);
			window.removeEventListener('touchstart', unlock);
			window.removeEventListener('touchend', unlock);

			// finished
			//
			this.start(done);
		};

		// listen for user interaction
		//
		window.addEventListener('mousedown', unlock, false);
		window.addEventListener('touchstart', unlock, false);
		window.addEventListener('touchend', unlock, false);
	}

	//
	// querying methods
	//

	isLoaded(src) {
		return this.loaded && (this.src == src);
	}

	isPlaying() {
		return this.is_playing == true;
	}

	isPaused() {
		return this.is_paused == true;
	}

	//
	// getting methods
	//

	getTime() {
		return this.context.currentTime - this.elapsed_time;
	}

	getDuration() {
		return this.el? this.el.duration : undefined;
	}

	//
	// setting methods
	//

	setTime(time) {
		this.context.currentTime = time;
	}

	setVolume(volume) {
		if (isNaN(volume)) {
			return;
		}
		// clamp volume to range
		//
		if (volume < 0) {
			volume = 0;
		} else if (volume > 10) {
			volume = 10;
		}
		this.el.volume = volume / 10;
	}
	
	//
	// unlocking methods
	//

	ready() {
		return this.context && this.context.state === 'running';
	}

	kickstart(done) {

		// on iOS, we must play / decode a sound to kick start audio
		//
		this.load('sounds/tick.mp3', {
			// callbacks
			//
			success: () => {
				this.play('sounds/tick.mp3');
				this.stop();

				// perform callback
				//
				if (done) {
					done();
				}
			}
		});
	}

	start(done) {
		if (!this.context) {
			return;
		}
		this.is_playing = true;
		
		// unsuspend context
		//
		if (this.context.state !== 'running' && this.context.resume) {
			this.context.resume().then(() => {
				// this.kickstart();

				// perform callback
				//
				if (done) {
					done(this.context);
				}
			});
		} else {
			
			// perform callback
			//
			if (done) {
				done(this.context);
			}
		}
	}

	//
	// loading methods
	//

	load(src, options) {
		if (!this.el) {

			// create new audio node
			//
			this.el = document.createElement('audio');
			this.el.setAttribute('type', 'audio/mpeg');
			this.el.setAttribute('preload', false);
		}

		// set attributes
		//
		this.src = src;
		this.loaded = false;

		// remove previous event listeners
		//
		this.removeEventListeners();

		// add new event listeners
		//
		this.addEventListeners(options);

		// begin loading
		//
		this.el.setAttribute('src', src);
		this.el.load();
	}

	addEventListeners(options) {
		$(this.el).one('loadeddata', (event) => {
			$(this.el).off();
			if (!this.loaded) {
				this.onLoad(event, options);
			}
		});

		$(this.el).one('canplaythrough', (event) => {
			$(this.el).off();
			if (!this.loaded) {
				this.onLoad(event, options);
			}
		});

		$(this.el).one('error', (event) => {
			$(this.el).off();
			this.onError(event, options);
		});
	}

	removeEventListeners() {
		$(this.el).off();
	}

	//
	// playing methods
	//

	play(src, options) {

		// check if audio context is ready
		//
		if (!this.ready()) {
			this.start(() => {
				this.play(src, options);
			});
			return;
		}
		if (this.is_paused) {
			this.resume();
			return;
		}
		if (!this.isLoaded(src)) {

			// load sound
			//
			this.load(src, {

				// callbacks
				//
				success: () => {
					this.play(src, options);
				}
			});
		} else {
			this.is_playing = true;

			// remove any previous listeners 
			//
			if (this.el) {
				$(this.el).off('ended');
			}

			// listen for end
			//
			if (options && options.onended) {
				$(this.el).on('ended', options.onended);
			}
			
			return this.el.play();
		}
	}

	pause() {
		if (this.context && this.context.state === 'running') {
			this.context.suspend();
		}
		this.is_paused = true;
	}

	resume() {
		if (this.context) {
			this.context.resume();
		}
		this.is_paused = false;
	}

	stop() {
		if (this.el && this.el.stop) {
			this.el.stop();
		}
		this.elapsed_time = this.context.currentTime;
		this.is_playing = false;
		this.is_paused = false;
	}

	//
	// event handling methods
	//

	onLoad(event, options) {
		this.loaded = true;

		// perform callback
		//
		if (options && options.success) {
			options.success();
		}
	}

	onError(event, options) {
		if (this.verbose) {

			// show error message
			//
			application.error({
				message: "Could not play audio."
			});
		} else {
			console.log("Could not play audio.");
		}

		// perform callback
		//
		if (options && options.error) {
			options.error();
		}
	}

	static AudioContext = window.AudioContext || window.webkitAudioContext;
}