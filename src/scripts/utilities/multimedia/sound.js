/******************************************************************************\
|                                                                              |
|                                   sound.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a basic HTML5 sound class.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default class Sound {

	constructor(attributes) {

		// set attributes
		//
		this.url = attributes? attributes.url : undefined;
		this.data = attributes? attributes.data : undefined;
		this.buffer = attributes? attributes.buffer : undefined;
		this.volume = attributes? attributes.volume : undefined;
		this.loaded = false;
		this.verbose = true;
		this.start_time = 0;
		this.is_playing = false;
	}

	//
	// querying methods
	//

	isPlaying() {
		return this.audio && this.is_playing;
	}

	isPaused() {
		return this.audio && this.audio.isPaused();
	}

	//
	// getting methods
	//

	getTime() {
		if (this.isPlaying()) {
			return this.start_time + this.audio.getTime();
		} else {
			return this.start_time;
		}
	}

	getDuration() {
		return this.buffer.duration;
	}

	//
	// setting methods
	//

	setTime(time) {
		this.start_time = time;
		this.stop();
	}

	setVolume(volume) {
		this.volume = volume;
		if (this.gainNode) {
			this.gainNode.gain.value = volume;
		}
	}

	//
	// playing methods
	//

	decode(data, done) {

		// make sure that audio context is ready
		//
		if (!this.audio.ready()) {
			this.audio.start(() => {
				this.decode(data, done);
			});
			return;
		}
		
		this.audio.context.decodeAudioData(data, (audioData) => {

			// set source buffer data
			//
			this.buffer = audioData;

			// notify of loading
			//
			this.loaded = true;
			this.onLoad();

			// perform callback
			//
			if (done) {
				done();
			}
		}, (error) => {
			if (error) {
				this.onError("Error - could not decode audio: " + error);
			}
		});
	}

	play(audio, options) {

		// set audio context
		//
		this.audio = audio;

		// set options
		//
		if (options) {
			this.options = options;
		}

		// make sure that audio context is ready
		//
		if (!this.audio.ready()) {
			this.audio.start(() => {
				this.play(this.audio);
			});
			return;
		}
		if (this.isPlaying() && this.isPaused()) {

			// resume the audio
			//
			this.resume();
		} else {

			// set status
			//
			this.is_playing = true;

			// load sound on demand
			//
			if (!this.loaded) {
				if (this.url) {
					
					// start downloading
					//
					this.download(this.url, () => {
						this.start();
					});
				} else if (this.data) {

					// start decoding
					//
					this.decode(this.data, () => {
						this.start();
					});
				}
			} else {
				this.start();
			}
		}
	}

	start() {

		// stop previous sound
		//
		if (this.source) {
			this.stop();
		}

		try {
			
			// create new audio buffer 
			//
			this.source = this.audio.context.createBufferSource();
			this.source.buffer = this.buffer;

			// connect the sound source to the gain control
			//
			this.gainNode = this.audio.context? this.audio.context.createGain() : undefined;
			this.source.connect(this.gainNode);
			if (this.gainNode && this.volume != undefined) {
				this.gainNode.gain.value = this.volume;
			}

			// connect the volume to the context's destination (the speakers)
			//
			this.gainNode.connect(this.audio.context.destination);

			// play the source
			//
			if (this.start_time) {
				this.source.start(0, this.start_time);
			} else {
				this.source.start();
			}
			
			/*
			this.source.onended = (event) => {
				this.stop();
				this.onEnded(event);
			};
			*/

			// perform callback
			//
			if (this.options && this.options.onstart) {
				this.options.onstart(this);
			}
		} catch (error) {
			if (error && this.verbose) {
				this.onError("Error - Could not start sound: " + error);
			}
		}
	}

	pause() {
		if (!this.audio) {
			return;
		}
		
		// pause the audio
		//
		this.audio.pause();
	}

	resume() {
		if (!this.audio) {
			return;
		}
		
		// pause the audio
		//
		this.audio.resume();
	}

	stop() {
		if (!this.is_playing) {
			return;
		}
		
		// set status
		//
		this.is_playing = false;

		// stop the source
		//
		if (this.source) {
			this.source.stop();
			this.source.disconnect();
			this.source = null;
		}

		// stop the audio
		//
		this.audio.stop();
	}
	
	//
	// downloading methods
	//

	download(url, done) {
		let request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';

		// decode asynchronously
		//
		request.onload = () => this.decode(request.response, done);
		request.send();
	}
	
	//
	// event handling methods
	//

	onLoad(event) {

		// perform callback
		//
		if (this.options && this.options.onload) {
			this.options.onload(event);
		}
	}

	onEnded() {

		// perform callback
		//
		if (this.options && this.options.onended) {
			this.options.onended(event);
		}
	}

	onError(message, options) {
		if (this.verbose) {

			// show error message
			//
			application.error({
				message: message
			});
		} else {
			console.log(message);
		}

		// perform callback
		//
		if (options && options.error) {
			options.error();
		}
	}
}