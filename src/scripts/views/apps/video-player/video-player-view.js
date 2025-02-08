/******************************************************************************\
|                                                                              |
|                               video-player-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for playing video files.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import VideoFile from '../../../models/storage/media/video-file.js';
import Directory from '../../../models/storage/directories/directory.js';
import Items from '../../../collections/storage/items.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import ItemShareable from '../../../views/apps/common/behaviors/sharing/item-shareable.js';
import HeaderBarView from '../../../views/apps/video-player/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/video-player/sidebar/sidebar-view.js';
import VideoSplitView from '../../../views/apps/video-player/mainbar/video-split-view.js';
import FooterBarView from '../../../views/apps/video-player/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/video-player/forms/preferences/preferences-form-view.js'
import Browser from '../../../utilities/web/browser.js';

export default AppSplitView.extend(_.extend({}, ItemShareable, {

	//
	// attributes
	//
	
	name: 'video_player',
	
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
			this.collection = new Items(this.getVideoFiles(this.collection.models));
		} else if (this.model && this.model.collection) {
			this.collection = new Items(this.getVideoFiles(this.model.collection.models));
		} else if (this.model) {
			this.collection = new Items([this.model]);
		} else {
			this.collection = new Items();
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
	
	isCompatible: function(item) {
		return item instanceof VideoFile;
	},

	isPlaying: function() {
		if (this.hasChildView('header clip')) {
			return this.getChildView('header clip').isPlaying();
		}
	},

	hasSelected: function() {
		if (this.hasChildView('sidebar')) {
			return this.getChildView('sidebar').hasSelected();
		}
	},

	hasVideoView: function() {
		return this.hasChildView('mainbar mainbar');
	},

	//
	// counting methods
	//

	numClips: function() {
		return this.collection.length;
	},

	//
	// getting methods
	//

	getVideoView: function() {
		return this.getChildView('mainbar mainbar');
	},

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
		return this.getChildView('sidebar').getSelected();
	},

	getSelectedModels: function() {
		return this.getChildView('sidebar').getSelectedModels();
	},

	getClipIndex: function(model) {
		return this.collection.indexOf(model) + 1;
	},

	getClipNumber: function(which, options) {
		if (this.collection) {
			switch (which) {
				case 'first':
					return 1;
				case 'prev':
					return this.getPrevClipNumber(options);
				case 'next':
					return this.getNextClipNumber(options);
				case 'last':
					return this.numClips();
				default:
					return this.getClipIndex(this.model);
			}
		}
	},

	getPrevClipNumber: function() {
		let clipNumber = this.getClipNumber();
		if (clipNumber > 1) {
			return clipNumber - 1;
		} else if (this.preferences.get('album_looping')) {
			return this.numClips();
		} else {
			return 1;
		}	
	},

	getNextClipNumber: function() {
		let clipNumber = this.getClipNumber();
		if (clipNumber < this.numClips()) {
			return clipNumber + 1;
		} else if (this.preferences.get('album_looping')) {
			return 1;
		} else {
			return this.numClips();
		}
	},

	getClipTime: function() {
		return this.getVideoView().getTime();
	},

	getVideoFiles: function(items) {
		if (items) {
			return new Items(items).filter((model) => {
				return model instanceof VideoFile;
			});
		} else {
			return [];
		}
	},

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
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
			this.setCollection(model? model.collection : null);
		}

		// set selected item in sidebar
		//
		this.setSelected(this.model);
	},

	setVideoFiles: function(items) {

		// set collection to video files
		//
		this.collection.reset(this.getVideoFiles(items));

		// update footer info
		//
		if (this.hasChildView('info')) {
			this.getChildView('info').update();
		}
	},

	setCollection: function(collection) {
		this.setVideoFiles(collection.models);
	},

	setClipNumber: function(clipNumber) {
		this.getChildView('header clip').pause();
		this.setClipTime(0);

		// clamp to range
		//
		if (clipNumber < 1) {
			clipNumber = 1;
		}
		if (clipNumber > this.collection.length) {
			clipNumber = this.collection.length;
		}

		// load video file
		//
		if (this.collection) {
			this.loadFile(this.collection.at(clipNumber - 1));
		}

		// update user interface
		//
		this.setClipIndex(clipNumber);
	},

	setClipTime: function(time) {
		this.getChildView('header clip').setTime(time);
		this.getVideoView().setTime(time);
	},

	setClipIndex: function(clipNumber) {
		if (this.hasChildView('header nav')) {
			this.getChildView('header nav').setClipNumber(clipNumber);
		}
		if (this.hasChildView('footer nav')) {
			this.getChildView('footer nav').setClipNumber(clipNumber);
		}
	},

	setSelected: function(model) {
		if (this.hasChildView('sidebar')) {
		
			// select sidebar item
			//
			let sidebar = this.getChildView('sidebar');
			sidebar.setSelected(model, {
				silent: true
			});
		}
	},
	
	//
	// playing methods
	//

	play: function() {
		this.getChildView('header clip').play();
	},

	pause: function() {
		this.getChildView('header clip').pause();
	},

	//
	// file opening methods
	//

	openFile: function(file) {

		// deselect play button
		//
		this.getChildView('header clip').pause();

		// set attributes
		//
		this.collection = new Items([file]);

		// update sidebar
		//
		this.getChildView('sidebar').collection = this.collection;
		this.getChildView('sidebar').render();

		// load item
		//
		this.loadFile(file);
	},

	openFiles: function(files) {

		// deselect play button
		//
		this.getChildView('header clip').pause();

		// set attributes
		//
		this.collection = new Items(files);

		// update sidebar
		//
		this.getChildView('sidebar').collection = this.collection;
		this.getChildView('sidebar').render();

		// load first item
		//
		if (this.collection.length > 0) {
			this.loadFile(this.collection.at(0));
		}
	},

	//
	// directory opening methods
	//

	openDirectory: function(directory) {

		// deselect play button
		//
		this.getChildView('header clip').pause();

		if (directory.loaded) {
			this.openItems(directory.contents.models);
		} else {
			directory.load({

				// callbacks
				//
				success: () => this.openItems(directory.contents.models)
			});
		}
	},

	//
	// item opening methods
	//

	open: function(items) {
		if (items.length == 1) {
			this.openItem(items[0]);
		} else {
			this.openItems(items);
		}
	},
	
	openItem: function(item, options) {

		// check if item is a directory
		//
		if (item instanceof Directory) {
			this.openDirectory(item, options);
		} else if (item instanceof VideoFile) {
			this.openFile(item, options);
		}
	},

	openItems: function(items, options) {
		if (items.length == 1) {

			// open first item
			//
			this.openItem(items[0], options);
		} else {

			// open video files
			//
			this.openFiles(new Items(items).filter((model) => {
				return model instanceof VideoFile;
			}), options);
		}
	},

	//
	// file loading methods
	//

	loadFile: function(model, options) {

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

		// set attributes
		//
		this.setModel(model);

		// show split view
		//
		if (this.preferences.get('show_sidebar')) {
			this.getChildView('contents').showSideBar();
		}

		// update video
		//
		this.getVideoView().loadFile(this.model, options);
	},

	downloadFile: function() {

		// download current video file
		//
		this.model.download();
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		AppSplitView.prototype.onRender.call(this);
			
		// show initial help message
		//
		if (!this.model) {
			this.showHelpMessage();
			this.onLoad();
		}

		// add tooltip triggers
		//
		this.addTooltips();
	},

	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView();
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
			tile_size: this.preferences.get('sidebar_tile_size')
		});
	},

	getContentView: function() {
		return new VideoSplitView({
			model: this.model,

			// options
			//
			preferences: this.preferences,
			show_sidebar: this.preferences.get('show_video_info'),
			sidebar_size: this.preferences.get('info_bar_size'),

			// callbacks
			//
			onload: () => this.onLoad(),
			onclick: () => this.onClickVideo()
		});
	},

	//
	// footer bar rendering methods
	//

	getFooterBarView: function() {
		return new FooterBarView();
	},

	//
	// message rendering methods
	//

	showHelpMessage: function() {
		this.showMessage("No videos.", {
			icon: '<i class="far fa-file-video"></i>',

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
			'../../../views/apps/video-player/dialogs/videos/open-video-file-dialog-view.js'
		).then((OpenVideoFileDialogView) => {
			
			// show open dialog
			//
			this.show(new OpenVideoFileDialogView.default({

				// start with home directory
				//
				model: this.getHomeDirectory(),

				// callbacks
				//
				onopen: (items) => {
					this.openItems(items);
				}
			}));
		});
	},
	
	showInfoDialog: function(options) {
		import(
			'../../../views/apps/file-browser/dialogs/info/video-file-info-dialog-view.js'
		).then((VideoFileInfoDialogView) => {

			// show video file info dialog
			//
			this.show(new VideoFileInfoDialogView.default(_.extend({
				model: this.model
			}, options)));				
		});	
	},
	
	showPreferencesDialog: function() {
		import(
			'../../../views/apps/video-player/dialogs/preferences/preferences-dialog-view.js'
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

		// autoplay video
		//
		if (this.options.autoplay) {
			this.play();
		}

		// set initial volume
		//
		this.getVideoView().setVolume(this.preferences.get('volume'));

		// update child views
		//
		this.getChildView('header').onLoad();
		if (this.hasChildView('footer')) {
			this.getChildView('footer').onLoad();
		}

		// perform callback
		//
		if (this.options.onload) {
			this.options.onload(this.model);
		}
	},

	onChange: function() {
		this.getChildView('header').onChange();
	},

	//
	// selection event handling methods
	//

	onSelect: function() {
		let selected = this.getSelected();
		if (selected.length > 0) {

			// set clip to selected
			//
			let model = selected[0].model;
			let index = this.collection.indexOf(model) + 1;
			this.setClipNumber(index);
		}

		if (!event) {
			return;
		}

		// block event from parent
		//
		this.block(event);
	},

	//
	// mouse event handling methods
	//

	onClickVideo: function() {
		if (!this.isPlaying()) {
			this.play();
		} else {
			this.pause();
		}
	},

	/*
	//
	// drag and drop event handling methods
	//

	onDropOn: function(items) {

		// unhighlight
		//
		let content = this.getChildView('contents');
		if (content.hasChildView('content')) {
			content = content.getChildView('content');
		}
		if (content.unhighlight) {
			content.unhighlight();
		}

		this.openItem(items);
	},
	*/

	//
	// clip event handling methods
	//

	onPlay: function() {
		this.getVideoView().play({

			// callbacks
			//
			onEnded: () => {
				this.onEnded();
			}
		});
	},

	onPause: function() {
		if (this.hasVideoView() && this.getVideoView().pause) {
			this.getVideoView().pause();
		}
	},

	onEnded: function() {
		
		// go to next track
		//
		if (!this.preferences.get('track_looping')) {

			// check if we are at the end
			//
			if (this.trackNumber == this.numClips) {
				if (!this.preferences.get('album_looping')) {
					return;
				}
			}

			// wraparound
			//
			let next = this.getClipNumber('next');
			if (next != undefined) {
				this.pause();
				this.setClipNumber(next);
				this.play();
			} else {
				this.getChildView('track').pause();
			}
		} else {

			// restart existing track
			//
			this.setTime(0);
			this.play();
		}
	}
}), {

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	}
});