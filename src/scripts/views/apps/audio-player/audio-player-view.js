/******************************************************************************\
|                                                                              |
|                               audio-player-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for playing audio files.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import AudioFile from '../../../models/storage/media/audio-file.js';
import Directory from '../../../models/storage/directories/directory.js';
import Items from '../../../collections/storage/items.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import ItemShareable from '../../../views/apps/common/behaviors/sharing/item-shareable.js';
import ItemFavorable from '../../../views/apps/common/behaviors/opening/item-favorable.js';
import FileDownloadable from '../../../views/apps/file-browser/mainbar/behaviors/file-downloadable.js';
import FileUploadable from '../../../views/apps/file-browser/mainbar/behaviors/file-uploadable.js';
import FileDisposable from '../../../views/apps/file-browser/mainbar/behaviors/file-disposable.js';
import HeaderBarView from '../../../views/apps/audio-player/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/audio-player/sidebar/sidebar-view.js';
import AudioSplitView from '../../../views/apps/audio-player/mainbar/audio-split-view.js';
import FooterBarView from '../../../views/apps/audio-player/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/audio-player/forms/preferences/preferences-form-view.js'
import Audio from '../../../utilities/multimedia/audio.js';
import Browser from '../../../utilities/web/browser.js';

export default AppSplitView.extend(_.extend({}, ItemShareable, ItemFavorable, FileDownloadable, FileUploadable, FileDisposable, {

	//
	// attributes
	//
	
	name: 'audio_player',

	//
	// audio attributes
	//
	
	audio: new Audio(),
	
	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);

		// set collection
		//
		if (this.collection) {
			this.collection = new Items(this.getAudioFiles(this.collection.models));
		} else if (this.model && this.model.collection) {
			this.collection = new Items(this.getAudioFiles(this.model.collection.models));
		} else if (this.model) {
			this.collection = new Items([this.model]);
		} else {
			this.collection = new Items();
		}

		// set directory
		//
		if (this.collection.length > 0) {
			this.directory = this.collection.at(0).collection.directory;
		}

		// for embedded apps, allow analyser to take up a majority of the space
		//
		if (application.isEmbedded()) {
			this.preferences.set('analyzer_size', 70);
		}

		// sort by track number
		//
		this.sort();

		// set model
		//
		if (this.collection.length > 0 && !this.model) {
			this.model = this.collection.at(0);
		}
	},

	//
	// attribute methods
	//

	title: function() {
		return this.model? this.model.getName() : config.apps[this.name].name;
	},
	
	//
	// querying methods
	//

	isPlaying: function() {
		return this.model? this.model.isPlaying() : false;
	},

	isPaused: function() {
		return this.model? this.model.isPaused() : false;
	},

	isCompatible: function(item) {
		return item instanceof AudioFile || item instanceof Directory;
	},

	hasSelected: function() {
		if (this.hasChildView('content')) {
			return !this.helpMessage && this.getChildView('content').hasSelected();
		}
	},

	hasSelectedItems: function() {
		if (this.hasChildView('sidebar')) {
			return this.getChildView('sidebar').hasSelectedItems();
		}
	},

	//
	// counting methods
	//

	numTracks: function() {
		return this.collection.length;
	},

	//
	// getting methods
	//

	getHomeDirectory: function() {
		if (application.isSignedIn()) {

			// use directory from preferences
			//
			return application.getDirectory(this.preferences.get('home_directory'));
		} else if (this.model && this.model.parent) {

			// use directory from current file
			//
			return this.model.parent;
		} else {

			// use home directory
			//
			return application.getDirectory();
		}
	},

	getSelected: function() {
		return this.getChildView('content').getSelected();
	},

	getSelectedModels: function() {
		return this.getChildView('content').getSelectedModels();
	},

	getSelectedItems: function() {
		return this.getChildView('sidebar').getSelectedItems();
	},

	getAudioFiles: function(items) {
		if (items) {
			return new Items(items).filter((model) => {
				return model instanceof AudioFile;
			});
		} else {
			return [];
		}
	},

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	getTrackIndex: function(model) {
		return this.collection.indexOf(model) + 1;
	},

	getTrackNumber: function(which) {
		if (this.collection) {
			switch (which) {
				case 'first':
					return 1;
				case 'prev': {
					let trackNumber = this.getTrackNumber();
					if (trackNumber >= 1) {
						return trackNumber - 1;
					} else if (this.preferences.get('album_looping')) {
						return undefined;
					} else {
						return 1;
					}
				}
				case 'next': {
					let trackNumber = this.getTrackNumber();
					if (trackNumber < this.collection.length) {
						return trackNumber + 1;
					} else if (this.preferences.get('album_looping')) {
						return 1;
					} else {
						return undefined;
					}
				}
				case 'last':
					return this.numTracks();
				default:
					return this.getTrackIndex(this.model);
			}
		}
	},

	getTrackTime: function() {
		return this.model? this.model.getTime() : 0;
	},

	getVolume: function() {
		if (this.hasChildView('volume')) {
			return this.getChildView('volume').getVolume();
		} else {
			return this.preferences.get('volume');
		}
	},

	//
	// setting methods
	//

	setModel: function(model) {

		// call superclass method
		//
		AppSplitView.prototype.setModel.call(this, model);

		// set collection of model
		//
		if (!this.collection) {
			this.setCollection(model && model.collection? model.collection : new Items());
		}

		// set track time
		//
		if (this.model) {
			this.getChildView('header play').setTime(this.model.getTime());
		}
	},

	setAudioFiles: function(items) {

		// set collection to audio files
		//
		this.collection.reset(this.getAudioFiles(items));
		this.sort();

		// update footer info
		//
		if (this.hasChildView('footer status')) {
			this.getChildView('footer status').update();
		}
	},

	setCollection: function(collection) {
		this.setAudioFiles(collection.models);
	},

	setOption: function(key, value) {
		switch (key) {

			// mainbar options
			//
			case 'volume':
				this.setVolume(value);
				break;

			case 'detail_kind':
				if (value) {
					let count = 0;
					for (let i = 0; i < this.collection.length; i++) {
						this.collection.at(i).fetchId3({

							// callbacks
							//
							success: () => {
								count++;
								if (count == this.collection.length) {

									// call superclass method
									//
									AppSplitView.prototype.setOption.call(this, 'detail_kind', value);
								}
							}
						});
					}
				} else {

					// call superclass method
					//
					AppSplitView.prototype.setOption.call(this, key, value);
				}
				break;

			// analyser options
			//
			case 'show_analyser':
				if (this.hasChildView('content') && this.getChildView('content').setSideBarVisibility) {
					this.getChildView('content').setSideBarVisibility(value);
				}
				break;
			case 'analyzer_size':
				this.getChildView('content').setSideBarSize(value);
				break;

			// other options
			//
			default:

				// call superclass method
				//
				AppSplitView.prototype.setOption.call(this, key, value);
				break;
		}
	},

	//
	// audio setting methods
	//

	setTrackNumber: function(trackNumber, options) {

		// pause existing audio
		//
		if (this.isPlaying()) {
			this.getChildView('header play').getChildView('play').deselect();
		}

		// update track number
		//
		if (this.hasChildView('footer nav')) {
			this.getChildView('footer nav').setTrackNumber(trackNumber);
		}

		// load specified track
		//
		if (this.collection) {
			this.loadFile(this.collection.at(trackNumber - 1), options);
		}
	},

	setTrackTime: function(time) {
		if (this.model) {
			this.model.setTime(time);
			this.getChildView('header play').setTime(time);
		}
	},

	//
	// sorting methods
	//

	sort: function() {
		let sortKind = this.preferences.get('sort_kind');

		// sort by track number
		//
		this.collection.comparator = function(model) {
			return model.getSortableAttribute(sortKind);
		};
		this.collection.sort();
	},

	//
	// file opening methods
	//

	openFile: function(file) {

		// select file to open
		//
		if (!file) {
			this.showOpenDialog();
			return;
		}

		// deselect play button
		//
		this.getChildView('header play').pause();

		// stop sounds
		//
		this.stop();

		// set attributes
		//
		this.collection.reset([file]);

		// update contents
		//
		this.getChildView('content').collection.reset([file]);
		this.getChildView('content').render();

		// load item
		//
		this.loadFile(file);
	},

	openFiles: function(files) {

		// select files to open
		//
		if (!files) {
			this.showOpenDialog();
			return;
		}

		// deselect play button
		//
		this.getChildView('header play').pause();

		// stop sounds
		//
		this.stop();

		// set attributes
		//
		this.collection.reset(files);
		this.collection.sortBy(this.preferences.get('sort_kind'));

		// update contents
		//
		this.getChildView('content').collection.reset(files);
		this.getChildView('content').render();

		// open first item
		//
		if (this.collection.length > 0) {
			this.loadFile(this.collection.at(0));
		}
	},

	//
	// directory opening methods
	//

	openDirectory: function(directory) {

		// set attributes
		//
		this.directory = directory;

		// deselect play button
		//
		this.getChildView('header play').pause();

		// check if directory is loaded
		//
		if (directory.loaded) {

			// check if audio album
			//
			if (directory.isAudioAlbum()) {

				// open contents
				//
				this.openItems(directory.contents.models);
			} else {
				application.openItem(directory);
			}
		} else {
			directory.load({
				details: [this.preferences.get('sort_kind')],

				// callbacks
				//
				success: () => this.openDirectory(directory)
			});
		}
	},

	//
	// item opening methods
	//

	open: function(items) {
		if (items.length > 1) {
			this.openItems(items);
		} else {
			this.openItem(items[0]);
		}
	},

	openItem: function(item, options) {
		if (item instanceof Directory) {
			this.openDirectory(item, options);
		} else if (item instanceof AudioFile) {
			this.openFile(item, options);
		} else {
			application.openItem(item, options);
		}
	},

	openItems: function(items, options) {
		if (items.length == 1) {

			// open first item
			//
			this.openItem(items[0], options);
		} else {

			// open audio files
			//
			this.openFiles(new Items(items).filter((model) => {
				return model instanceof AudioFile;
			}), options);
		}
	},

	//
	// loading methods
	//

	loadFile: function(model, options) {

		// pause currently playing track
		//
		this.pause();

		// set attributes
		//
		this.setModel(model);

		// unload other models
		//
		this.unload();

		// show split view
		//
		if (this.preferences.get('show_sidebar')) {
			this.getChildView('contents').showSideBar();
		}

		// update sidebar
		//
		this.getChildView('sidebar').setModel(model);

		// start loading model
		//
		if (this.model) {
			let volume = this.getVolume();

			this.model.loadAudio(this.audio, {
				volume: (volume != undefined? volume : 5) / 10,

				// callbacks
				//
				success: () => {

					// check if view still exists
					//
					if (this.isDestroyed()) {
						return;
					}

					this.onLoad();

					// perform callback
					//
					if (options && options.success) {
						options.success();
					}
				},

				error: () => {

					// perform callback
					//
					if (options && options.error) {
						options.error();
					}
				}
			});
		}
	},

	downloadFile: function() {

		// download selected audio file
		//
		if (this.hasSelected()) {
			this.getSelectedModels()[0].download();
		}
	},

	//
	// playing methods
	//

	play: function() {

		// play track
		//
		this.getChildView('header play').play();
	},

	pause: function() {
		this.getChildView('header play').pause();
	},

	stop: function() {

		// stop current tracks
		//
		for (let i = 0; i < this.collection.length; i++) {
			let file = this.collection.at(i);
			if (file.sound) {
				file.sound.stop();
			}
		}
	},

	unload: function() {

		// unload current tracks
		//
		for (let i = 0; i < this.collection.length; i++) {
			let file = this.collection.at(i);
			if (file != this.model) {
				file.trigger('unload');
			}
		}
	},

	//
	// volume control methods
	//

	setVolume: function(volume) {
		this.getChildView('header volume').setVolume(volume);
		if (this.model) {
			this.model.setVolume(volume / 10);
		}
	},

	volumeDown: function() {
		this.setVolume(this.getVolume() - 1);
	},

	volumeUp: function() {
		this.setVolume(this.getVolume() + 1);
	},

	//
	// file deleting methods
	//

	deleteItems: function(items, options) {

		// check if there are items to delete
		//
		if (items.length == 0) {

			// show notification
			//
			application.notify({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete Error",
				message: "No items selected."
			});

			return;
		}

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete",
				message: "Are you sure you want to delete " + (items.length == 1? '"' + items[0].getName() + '"' : "these " + items.length + " items") + "?",

				// callbacks
				//
				accept: () => {
					this.deleteItems(items, _.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {
			this.getChildView('sidebar files items').deleteItems(items, {

				// callbacks
				//
				success: () => {

					// play delete sound
					//
					application.play('delete');
				}
			});
		}
	},

	deleteSelectedItems: function(options) {
		this.deleteItems(this.getSelectedItems(), options);
	},
	
	//
	// rendering methods
	//

	onRender: function() {
		
		// show child views
		//
		this.showHeaderBar();
		this.showContents();

		// show footer bar
		//
		if (!this.options.hidden || !this.options.hidden['footer-bar']) {
			this.showFooterBar();
		} else {
			this.$el.find('.footer-bar').remove();
		}

		// start loading model
		//
		if (this.model) {
			this.model.loadAudio(this.audio, {

				// callbacks
				//
				success: () => {

					// check if view still exists
					//
					if (this.isDestroyed()) {
						return;
					}

					this.onLoad();
				},

				error: () => {

					// show error message
					//
					application.error({
						message: "Could not load this audio track."
					});
				}
			});
		} else {
			this.onLoad();
		}

		// show initial help message
		//
		if (!this.model) {
			this.showHelpMessage();
		}

		// add tooltip triggers
		//
		this.addTooltips();
	},

	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView({
			model: this.model,
			collection: this.collection
		});
	},

	//
	// contents rendering methods
	//

	getSideBarView: function() {
		return new SideBarView({
			model: this.model,
			collection: this.collection,

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			view_kind: this.preferences.get('sidebar_view_kind'),
			audio: this.audio,

			// callbacks
			//
			onselect: () => this.onSelect(),
			ondeselect: () => this.onDeselect()
		});
	},

	getContentView: function() {
		return new AudioSplitView({
			model: this.model,
			collection: this.collection,

			// options
			//
			audio: this.audio,
			filter: this.options.filter,
			preferences: this.preferences,
			show_sidebar: this.preferences.get('show_analyser'),
			sidebar_size: this.preferences.get('analyzer_size'),

			// callbacks
			//
			onplay: () => this.play(),
			onpause: () => this.pause(),
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.loadFile(item.model),
			ondropon: (items) => this.onDropOn(items),
			ondropout: (items) => this.onDropOut(items)
		});
	},

	//
	// footer bar rendering methods
	//

	getFooterBarView: function() {
		return new FooterBarView();
	},

	showPlayerStatus: function(status) {
		if (this.hasChildView('footer status')) {
			this.getChildView('footer status').showPlayerStatus(status);
		}
	},

	//
	// message rendering methods
	//

	showHelpMessage: function() {
		this.showMessage("No audio.", {
			icon: '<i class="far fa-file-audio"></i>',

			// callbacks
			//
			onclick: () => this.showOpenDialog()
		});
	},

	//
	// dialog rendering methods
	//

	showOpenDialog: function() {
		import(
			'../../../views/apps/audio-player/dialogs/audio/open-audio-dialog-view.js'
		).then((OpenAudioDialogView) => {
			
			// show open dialog
			//
			this.show(new OpenAudioDialogView.default({

				// start with home directory
				//
				model: this.getHomeDirectory(),

				// callbacks
				//
				onopen: (items) => this.openItems(items)
			}));
		});
	},
	
	showInfoDialog: function(options) {
		import(
			'../../../views/apps/file-browser/dialogs/info/audio-file-info-dialog-view.js'
		).then((AudioFileInfoDialogView) => {

			// show audio file info dialog
			//
			this.show(new AudioFileInfoDialogView.default(_.extend({
				model: this.model
			}, options)));				
		});	
	},
	
	showPreferencesDialog: function() {
		import(
			'../../../views/apps/audio-player/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// call superclass method
		//
		AppSplitView.prototype.onLoad.call(this);

		// close sidebar
		//
		if (Browser.device == 'phone') {
			this.getChildView('contents').closeSideBar();
		}
		
		// remove any previous help message
		//
		if (!this.model) {
			this.hideMessage();
		}

		// perform callback
		//
		if (this.options.onload) {
			this.options.onload();
		}
	},

	/*
	onDropOn: function(items) {
		if (items[0] instanceof Directory) {
			this.openDirectory(items[0]);
		} else {
			this.openItems(items);
		}
	},
	*/

	onPlay: function() {
		if (this.model) {
			this.model.play(this.audio, {

				// callbacks
				//
				onstart: (sound) => this.onStart(sound),
				// onended: () => this.onEnded(),
				onerror: () => this.onError()
			});
			this.showPlayerStatus('Playing');
		}

		if (this.hasChildView('content') && this.getChildView('content').onPlay) {
			this.getChildView('content').onPlay();
		}
	},

	onPause: function() {

		// pause current track
		//
		if (this.model) {
			this.model.pause();
			this.showPlayerStatus('Paused');
		}

		if (this.hasChildView('content') && this.getChildView('content').onPause) {
			this.getChildView('content').onPause();
		}
	},

	onScrub: function(time) {
		if (this.isPlaying()) {
			this.onPause();
		}
		this.setTrackTime(time);
	},

	onResume: function() {
		if (this.hasChildView('content') && this.getChildView('content').onResume) {
			this.getChildView('content').onResume();
		}
	},

	onChangeVolume: function(volume) {
		if (this.model) {			
			this.model.setVolume(volume / 10);
		}
	},

	onStart: function(sound) {
		this.model.sound = sound;
		this.getChildView('content').onStart(sound);
	},

	onEnded: function() {

		// check if view still exists
		//
		if (this.isDestroyed()) {
			return;
		}
		
		// go to next track
		//
		if (!this.preferences.get('track_looping')) {

			// check if we are at the end
			//
			if (this.trackNumber == this.numTracks) {
				if (!this.preferences.get('album_looping')) {
					return;
				}
			}

			// wraparound
			//
			let next = this.getTrackNumber('next');
			if (next != undefined) {
				this.pause();
				this.setTrackNumber(next, {

					// callbacks
					//
					success: () => this.play()
				});
			} else {
				this.getChildView('track').pause();
			}
		} else {

			// restart existing track
			//
			this.setTime(0);
			this.play();
		}
	},

	onError: function() {

		// show error message
		//
		application.error({
			message: "Could not play this audio track."
		});
	},

	//
	// window event handling methods
	//

	onFocus: function() {
		if (this.hasChildView('content') && this.getChildView('content').onFocus) {
			this.getChildView('content').onFocus();
		}
	},

	onBlur: function() {
		if (this.hasChildView('content') && this.getChildView('content').onBlur) {
			this.getChildView('content').onBlur();
		}
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		this.pause();
	}
}), {

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	}
});