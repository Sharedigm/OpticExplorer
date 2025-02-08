/******************************************************************************\
|                                                                              |
|                             image-viewer-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for viewing image files.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ImageFile from '../../../models/storage/media/image-file.js';
import Directory from '../../../models/storage/directories/directory.js';
import Items from '../../../collections/storage/items.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import Loadable from '../../../views/behaviors/effects/loadable.js';
import ItemShareable from '../../../views/apps/common/behaviors/sharing/item-shareable.js';
import ItemFavorable from '../../../views/apps/common/behaviors/opening/item-favorable.js';
import FileDownloadable from '../../../views/apps/file-browser/mainbar/behaviors/file-downloadable.js';
import FileUploadable from '../../../views/apps/file-browser/mainbar/behaviors/file-uploadable.js';
import FileDisposable from '../../../views/apps/file-browser/mainbar/behaviors/file-disposable.js';
import HeaderBarView from '../../../views/apps/image-viewer/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/image-viewer/sidebar/sidebar-view.js';
import ImageSplitView from '../../../views/apps/image-viewer/mainbar/image-split-view.js';
import FooterBarView from '../../../views/apps/image-viewer/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/image-viewer/forms/preferences/preferences-form-view.js'
import Browser from '../../../utilities/web/browser.js';

export default AppSplitView.extend(_.extend({}, Loadable, ItemShareable, ItemFavorable, FileDownloadable, FileUploadable, FileDisposable, {

	//
	// attributes
	//
	
	name: 'image_viewer',
	
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
			this.collection = new Items(this.getImageFiles(this.collection.models));
		} else if (this.model && this.model.collection) {
			this.collection = new Items(this.getImageFiles(this.model.collection.models));
		} else if (this.model) {
			this.collection = new Items([this.model]);
		} else {
			this.collection = new Items();
		}

		// set current directory
		//
		if (this.collection.length > 0) {
			this.directory = this.collection.at(0).getDirectory();
		}

		// bind gesture event handlers
		//
		this.$el.on('gesturestart', (event) => {
			this.onGestureStart(event);
		});
		this.$el.on('gesturechange', (event) => {
			this.onGestureChange(event);
		});
		this.$el.on('gestureend', (event) => {
			this.onGestureEnd(event);
		});
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
		return item instanceof ImageFile;
	},

	hasImage: function() {
		return !this.collection.isEmpty();
	},

	hasImages: function() {
		return this.collection.length > 1;
	},

	hasSelected: function() {
		if (this.hasChildView('sidebar')) {
			return this.getChildView('sidebar').hasSelected();
		}
	},

	hasSelectedItems: function(kind) {
		if (this.hasChildView('sidebar')) {
			return this.getChildView('sidebar').hasSelectedItems(kind);
		}
	},

	hasImageView: function() {
		return this.hasChildView('mainbar mainbar');
	},

	//
	// counting methods
	//

	numImages: function() {
		return this.collection.length;
	},

	//
	// getting methods
	//

	getImageView: function() {
		return this.getChildView('mainbar mainbar');
	},

	getImageIndex: function(model) {
		return this.collection.indexOf(model) + 1;
	},

	getImageNumber: function(which, options) {
		if (this.collection) {
			switch (which) {
				case 'first':
					return 1;
				case 'prev': {
					let imageNumber = this.getImageNumber();
					if (imageNumber > 1) {
						return imageNumber - 1;
					} else if (options && options.wraparound) {
						return this.numImages();
					} else {
						return 1;
					}
				}
				case 'next': {
					let imageNumber = this.getImageNumber();
					if (imageNumber < this.numImages()) {
						return imageNumber + 1;
					} else if (options && options.wraparound) {
						return 1;
					} else {
						return this.numImages();
					}
				}
				case 'last':
					return this.numImages();
				default:
					return this.getImageIndex(this.model);
			}
		}
	},

	getZoom: function(zoomMode) {
		return this.getImageView().getZoom(zoomMode);
	},

	getZoomMode: function() {
		return this.getChildView('header zoom_mode').getValue();
	},

	getRotation: function() {
		return this.getChildView('header rotate').rotation;
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

	getSelectedItems: function() {
		return this.getChildView('sidebar').getSelectedItems();
	},

	getSelectedModel: function() {
		return this.getChildView('sidebar').getSelected()[0].model;
	},

	getSelectedModels: function() {
		return this.getChildView('sidebar').getSelectedModels();
	},

	getImageFiles: function(items) {
		if (items) {
			return new Items(items).filter((model) => {
				return model instanceof ImageFile;
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

	setImageFiles: function(items) {

		// set collection to video files
		//
		this.collection.reset(this.getImageFiles(items));

		// update footer info
		//
		if (this.hasChildView('info')) {
			this.getChildView('info').update();
		}
	},

	setCollection: function(collection) {
		this.setImageFiles(collection.models);
	},

	setImageNumber: function(imageNumber, options) {

		// clamp to range
		//
		if (imageNumber < 1) {
			imageNumber = 1;
		}
		if (imageNumber > this.collection.length) {
			imageNumber = this.collection.length;
		}

		// load image
		//
		if (this.collection && this.collection.length > 0) {
			this.loadFile(this.collection.at(imageNumber - 1), options);
		} else {
			this.clear();
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

	setZoom: function(zoom) {
		if (this.hasChildView('header zoom')) {
			this.getChildView('header zoom').setZoom(zoom);
		}
	},

	//
	// selecting methods
	//

	select: function(which) {
		this.setImageNumber(this.getImageNumber(which, {
			wraparound: true
		}));
	},

	//
	// file methods
	//

	newFolder: function() {
		this.directory.newDirectory({

			// callbacks
			//
			success: (model) => {

				// play new sound
				//
				application.play('new');

				// add grow effect
				//
				let itemView = this.getSideBarItemView(model);
				if (itemView.grow) {

					// edit directory name after grow
					//
					itemView.grow(() => itemView.setEditable());
				} else {

					// edit directory name
					//
					itemView.setEditable();
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not create new directory.",
					response: response
				});
			}
		});
	},

	openFile: function(file, options) {

		// set attributes
		//
		this.collection = options && options.collection? options.collection : new Items([file]);
		this.directory = file.getDirectory();

		// update sidebar
		//
		if (this.hasChildView('sidebar')) {
			this.getChildView('sidebar').collection = this.collection;
			this.getChildView('sidebar').update();
		}

		// load item
		//
		this.loadFile(file);
	},

	openFiles: function(files) {

		// set attributes
		//
		this.collection = new Items(files);
		this.directory = files && files[0]? files[0].getDirectory() : undefined;

		// update sidebar
		//
		if (this.hasChildView('sidebar')) {
			this.getChildView('sidebar').collection = this.collection;
			this.getChildView('sidebar').update();
		}

		// load first item
		//
		if (this.collection.length > 0) {
			this.loadFile(this.collection.at(0));
		} else {
			this.clear();
		}
	},

	openDirectory: function(directory) {

		// set attributes
		//
		this.directory = directory;

		// open directory items
		//
		if (directory.loaded) {
			this.openItems(this.getImageFiles(directory.contents.models));
		} else {
			directory.load({

				// callbacks
				//
				success: () => {
					this.openItems(this.getImageFiles(directory.contents.models));
				}
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

		// clear current item
		//
		this.model = null;

		// open directory or file
		//
		if (item instanceof Directory) {
			this.openDirectory(item, options);
		} else if (item instanceof ImageFile) {
			this.openFile(item, options);
		}
	},

	openItems: function(items, options) {
		if (items.length == 1) {

			// open first item
			//
			this.openItem(items[0], options);
		} else if (items.length != 0) {

			// open image files
			//
			this.openFiles(new Items(items).filter((model) => {
				return model instanceof ImageFile;
			}));

			// set initially selected model
			//
			if (options && options.model) {
				this.loadFile(options.model);
			}
		} else {
			this.clear();

			// activate menus
			//
			this.onLoad();
		}
	},

	//
	// loading methods
	//

	loadFile: function(model, options) {

		// close sidebar
		//
		if (Browser.device == 'phone') {
			this.getChildView('contents').closeSideBar();
		}

		// remove any previous help message
		//
		this.hideMessage();

		// set attributes
		//
		this.setModel(model);

		// show split view
		//
		if (!this.getChildView('contents').hasChildView('sidebar')) {
			if (this.preferences.get('show_sidebar')) {
				this.getChildView('contents').showSideBar();
			}
		}

		// update image
		//
		this.getImageView().loadFile(model, options);
		this.getChildView('content').getChildView('sidebar').setModel(model);
		
		// update sidebar
		//
		if (this.hasChildView('sidebar')) {
			this.getChildView('sidebar').setModel(model);
		}
	},

	//
	// uploading methods
	//

	uploadImages: function(items, directory, options) {

		// upload items to home directory
		//
		this.uploadItems(items, directory, {
			show_progress: true,
			overwrite: true,

			// callbacks
			//
			success: (items) => {

				// perform callback
				//
				if (options && options.success) {
					options.success(items);
				}
			}
		});
	},

	downloadItems: function() {

		// download current image file
		//
		this.model.download();
	},

	deleteSelected: function() {

		// delete currently selected items
		//
		this.showDeleteDialog(this.getSelectedItems());
	},

	//
	// slide show methods
	//

	play: function() {
		this.is_playing = true;

		// check if already playing
		//
		if (this.timeout) {
			return;
		}

		// update header bar
		//
		this.getChildView('header menu view').setItemSelected('view-slide-show', true);

		// update footer bar
		//
		if (this.hasChildView('footer-bar')) {
			this.getChildView('footer-bar nav-bar play').select({
				silent: true
			});
		}

		// start slide show
		//
		this.scheduleNext();
	},

	nextSlide: function() {
		let imageNumber = this.getImageNumber();
		let numImages = this.numImages();
		let next = (imageNumber % numImages) + 1;

		this.setImageNumber(next, {

			// callbacks
			//
			success: () => {
				let wraparound = (imageNumber == numImages);

				// check for wraparound
				//
				if (wraparound && !this.preferences.get('slide_looping')) {
					this.pause();
				} else if (this.is_playing) {
					this.scheduleNext();
				}
			}
		});
	},

	scheduleNext: function() {
		let duration = this.preferences.get('slide_duration');

		// advance after a short delay
		//
		this.setTimeout(() => {
			this.nextSlide();
		}, duration * 1000);
	},

	pause: function() {
		this.is_playing = false;

		// stop slide animation
		//
		this.stopSlideShow();

		// update header bar
		//
		this.getChildView('header menu view').setItemSelected('view-slide-show', false);

		// update footer bar
		//
		if (this.hasChildView('footer-bar')) {
			this.getChildView('footer-bar nav-bar play').deselect({
				silent: true
			});
		}
	},

	toggleSlideShow: function() {
		if (this.is_playing) {
			this.pause();
		} else {
			this.play();
		}
	},

	stopSlideShow: function() {
		this.clearTimeout();
	},

	//
	// full screen methods
	//

	toggleFullScreen: function() {

		// request full screen
		//
		let imageView = this.getImageView();
		if (imageView) {
			if (!imageView.isFullScreen()) {
				imageView.requestFullScreen();
			} else {
				imageView.exitFullScreen();
			}
		}
	},

	//
	// rotating methods
	//

	setRotation: function(rotation) {
		this.getImageView().setRotation(rotation);
	},

	rotateTo: function(rotation, options) {
		let start = this.getRotation();
		let finish = rotation;
		let delta = finish - start;

		// animate zoom
		//
		if (delta != 0) {
			this.animation = $({t: 0}).animate({t: 1}, {
				duration: this.preferences? this.preferences.get('rotate_duration') : 0,

				// callbacks
				//
				step: (t) => {

					// interpolate rotation
					//
					this.setRotation(start + delta * t);
				},

				complete: () => {
					this.animation = null;
					this.getChildView('header rotate').rotation = rotation;

					// perform callback
					//
					if (options && options.finish) {
						options.finish();
					}
				}
			});
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		
		// call superclass method
		//
		AppSplitView.prototype.onRender.call(this);

		// add tooltip triggers
		//
		this.addTooltips();
	},

	onAttach: function() {

		// load images from home directory
		//
		if (this.collection.length == 0) {
			this.openDirectory(this.getHomeDirectory());
		}
	},

	update: function() {

		// set zoom
		//
		let zoom = this.parent.getZoom();
		if (zoom) {
			this.getChildView('header zoom').setZoom(Math.round(zoom));
		}
	},

	addSpinner: function() {
		this.spinner = $('<div class="loading spinner">');
		this.getChildView('mainbar').$el.append(this.spinner);
	},

	showHelpMessage: function() {
		this.showMessage("No images.", {
			icon: '<i class="far fa-file-image"></i>',

			// callbacks
			//
			onclick: () => this.showOpenDialog()
		});
	},

	clear: function() {

		// clear attributes
		//
		this.model = null;
		this.collection.reset();

		// update view
		//
		this.getChildView('sidebar').clear();
		this.getChildView('mainbar').clear();
		this.showHelpMessage();
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
			tile_size: this.preferences.get('sidebar_tile_size'),

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item)
		});
	},

	getContentView: function() {
		return new ImageSplitView({
			model: this.model,

			// options
			//
			preferences: this.preferences,
			show_sidebar: this.preferences.get('show_exif_info'),
			sidebar_size: this.preferences.get('info_bar_size'),

			// callbacks
			//
			onload: (image) => this.onLoad(image),
			onerror: (message) => this.showMessage(message, {
				icon: '<i class="fa fa-bug"></i>'
			})
		});
	},

	//
	// footer bar rendering methods
	//

	getFooterBarView: function() {
		return new FooterBarView();
	},

	//
	// dialog rendering methods
	//

	showOpenDialog: function() {
		import(
			'../../../views/apps/file-browser/dialogs/files/open-items-dialog-view.js'
		).then((OpenItemsDialogView) => {
			
			// show open items dialog
			//
			this.show(new OpenItemsDialogView.default({

				// start with home directory
				//
				model: application.getDirectory(),

				// callbacks
				//
				onopen: (items) => {
					if (items) {
						this.openItems(items);
					}
				}
			}));
		});
	},

	showOpenImagesDialog: function() {
		import(
			'../../../views/apps/file-browser/dialogs/images/open-images-dialog-view.js'
		).then((OpenImagesDialogView) => {

			// show open images dialog
			//
			this.show(new OpenImagesDialogView.default({

				// start with home directory
				//
				model: this.getHomeDirectory().clone(),

				// callbacks
				//
				onopen: (items) => {
					if (items) {
						this.openItems(items);
					}
				}
			}));
		});
	},
	
	showInfoDialog: function(options) {
		import(
			'../../../views/apps/file-browser/dialogs/info/image-file-info-dialog-view.js'
		).then((ImageFileInfoDialogView) => {

			// show image file info dialog
			//
			this.show(new ImageFileInfoDialogView.default(_.extend({
				model: this.model
			}, options)));				
		});	
	},

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/image-viewer/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	showDeleteDialog: function(items) {

		// confirm delete
		//
		application.confirm({
			icon: '<i class="fa fa-trash-alt"></i>',
			title: "Delete",
			message: "Are you sure you want to delete " + (items.length == 1? '"' + items[0].getName() + '"' : "these " + items.length + " items") + "?",

			// callbacks
			//
			accept: () => {
				let index = this.getImageNumber('prev');

				// show loading spinner
				//
				this.showSpinner();

				// delete file
				//
				this.deleteItems(items, {

					// callbacks
					//
					success: (items) => {

						// hide loading spinner
						//
						this.hideSpinner();

						// update view
						//
						for (let i = 0; i < items.length; i++) {
							this.collection.remove(items[i]);
						}
						this.setImageNumber(index);

						// play delete sound
						//
						application.play('delete');
					}
				});
			}
		});
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.getChildView('header zoom').onChange();
	},

	onLoad: function(image) {

		// set image dimensions
		//
		if (image) {
			let width = image.naturalWidth;
			let height = image.naturalHeight;
			this.model.set('dimensions', [width, height], {
				silent: true
			});
		}

		// check if view still exists
		//
		if (this.isDestroyed()) {
			return;
		}

		// start slide show
		//
		if (this.options.slide_show) {
			this.getChildView('footer nav').play();
			this.options.slide_show = false;
		}

		// handle child views
		//
		if (this.hasChildView('header') && this.getChildView('header').onLoad) {
			this.getChildView('header').onLoad();
		}
		if (this.hasChildView('footer') && this.getChildView('footer').onLoad) {
			this.getChildView('footer').onLoad();
		}

		// clear status message, if shown
		//
		if (image) {
			this.hideMessage();
		}

		// perform callback
		//
		if (this.options.onload) {
			this.options.onload();
		}
	},

	//
	// mouse event handling methods
	//

	onClick: function() {
		if (this.dialog && this.dialog.isFullScreen()) {
			if (this.hasChildView('footer nav')) {
				this.getChildView('footer nav').nextSlide();
			}
		}
	},

	//
	// touch event handling methods
	//

	onGestureStart: function() {
		this.zoomStart = this.getChildView('header zoom').getZoom(); 
	},

	onGestureChange: function(event) {
		this.getChildView('header zoom').setZoom(this.zoomStart * event.originalEvent.scale);

		// block event from parent
		//
		this.block(event);
	},

	onGestureEnd: function() {
		this.zoomStart = undefined;
	},

	//
	// window event handling methods
	//

	onResize: function(event) {

		// resize content
		//
		if (this.hasChildView('content')) {
			this.getImageView().onResize(event);
		}

		// update header
		//
		if (this.hasChildView('header zoom_mode')) {
			let zoomMode = this.getChildView('header zoom_mode').getValue();
			if (zoomMode && zoomMode != 'actual_size') {

				// update current zoom
				//
				if (this.hasChildView('header zoom zoom_amount')) {
					let zoom = this.getImageView().getZoom(zoomMode);
					this.getChildView('header zoom zoom_amount').setValue(Math.round(zoom));
				}		
			}
		}
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// stop slide animation
		//
		this.stopSlideShow();

		// stop rotate animation
		//
		if (this.animation) {
			this.animation.stop();
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