/******************************************************************************\
|                                                                              |
|                                pdf-viewer-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for viewing pdf files.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import File from '../../../models/storage/files/file.js';
import PdfFile from '../../../models/storage/files/pdf-file.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import Findable from '../../../views/apps/common/behaviors/finding/findable.js';
import ItemShareable from '../../../views/apps/common/behaviors/sharing/item-shareable.js';
import ItemInfoShowable from '../../../views/apps/file-browser/dialogs/info/behaviors/item-info-showable.js';
import HeaderBarView from '../../../views/apps/pdf-viewer/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/pdf-viewer/sidebar/sidebar-view.js';
import PdfSplitView from '../../../views/apps/pdf-viewer/mainbar/pdf-split-view.js';
import FooterBarView from '../../../views/apps/pdf-viewer/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/pdf-viewer/forms/preferences/preferences-form-view.js'
import FileUtils from '../../../utilities/files/file-utils.js';
import Browser from '../../../utilities/web/browser.js';

export default AppSplitView.extend(_.extend({}, Findable, ItemShareable, ItemInfoShowable, {

	//
	// attributes
	//

	name: 'pdf_viewer',

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);

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
	
	extensions: function() {
		return ['pdf'];
	},
	
	//
	// querying methods
	//

	hasPdfView: function() {
		return this.hasChildView('mainbar mainbar');
	},

	numPages: function() {
		return this.getPdfView().numPages();
	},

	//
	// getting methods
	//

	getPdfView: function() {
		return this.getChildView('mainbar mainbar');
	},

	getPdf: function() {
		if (this.hasPdfView()) {
			return this.getPdfView().pdf;
		}
	},

	getFileName: function() {
		if (this.model.isNew()) {

			// new file name
			//
			return File.defaultName + '.txt';
		} else {

			// get file name from path
			//
			let path = this.model.get('path');
			if (FileUtils.isDirectoryPath(path)) {
				path = FileUtils.getFilePath(path);
			}

			return FileUtils.getItemBaseName(path) + '.txt';
		}
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

	getZoom: function(zoomMode) {
		return this.getPdfView().getZoom(zoomMode);
	},

	getSelected: function() {
		return this.getPdfView().getSelected();
	},

	getPageNumber: function(which, options) {
		switch (which) {
			case 'first':
				return 1;
			case 'prev':
				return this.getPrevPageNumber(options);
			case 'next':
				return this.getNextPageNumber(options);
			case 'last':
				return this.numPages();
			default:
				return this.getPdfView().pageNumber;
		}
	},

	getPrevPageNumber: function(options) {
		let pageNumber = this.getPageNumber();
		if (pageNumber > 1) {
			return pageNumber - 1;
		} else if (options && options.wraparound) {
			return this.numPages();
		} else {
			return 1;
		}
	},

	getNextPageNumber: function(options) {
		let pageNumber = this.getPageNumber();
		if (pageNumber < this.numPages()) {
			return pageNumber + 1;
		} else if (options && options.wraparound) {
			return 1;
		} else {
			return this.numPages();
		}
	},

	getDocumentSize: function() {
		let pdfView = this.getPdfView();
		let viewportSize = pdfView.getViewportSize();
		if (viewportSize) {
			let ppi = 72 * pdfView.constructor.scale;
			let width = (viewportSize.width / ppi).toPrecision(2);
			let height = (viewportSize.height / ppi).toPrecision(2);
			let documentSize =  width + '" x ' + height + '"';
			return documentSize;
		}
	},

	getFileSize: function() {
		return this.model? this.model.getSize() : 0;
	},

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// setting methods
	//

	setZoom: function(zoom) {
		this.getChildView('zoom').setZoom(zoom);	
	},

	setPageNumber: function(pageNumber) {

		// clamp to range
		//
		if (pageNumber < 1) {
			pageNumber = 1;
		} else if (pageNumber > this.numPages()) {
			pageNumber = this.numPages();
		}

		// set page number
		//
		this.getPdfView().loadPage(pageNumber);
		this.getChildView('header page').setPageNumber(pageNumber);
		this.getChildView('footer page').setPageNumber(pageNumber);

		// set selected item in sidebar
		//
		this.getChildView('sidebar').setPageNumber(pageNumber);

		// update
		//
		this.onChange();
	},

	setStatus: function(message) {
		if (this.hasChildView('footer')) {
			this.getChildView('footer status').showFileSize(message);
			this.getChildView('footer status').showDocumentSize('');
		}
	},

	//
	// opening methods
	//

	openItems: function(items) {

		// load first model
		//
		this.openItem(items[0]);
	},

	openItem: function(item, options) {

		// load item
		//
		this.loadFile(item, options);
	},

	//
	// loading methods
	//

	loadFile: function(model, options) {
		this.setStatus('Loading...');

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

		// clear sidebar
		//
		this.getChildView('contents sidebar').reset();

		// update pdf
		//
		this.getPdfView().loadFile(model, options);
	},

	//
	// saving methods
	//

	saveNew: function(directory, filename, options) {

		// create new text file
		//
		directory.add(new File({
			path: (directory.get('path') || '') + filename
		}), {

			// callbacks
			//
			success: (model) => {

				// save file
				//
				new PdfFile(this.model.attributes).fetchText({
					success: (text) => {
						model.write(text, {

							// callbacks
							//
							success: () => {
								this.onSave(model);

								// perform callback
								//
								if (options && options.success) {
									options.success();
								}
							},

							error: (model, response) => {

								// show error message
								//
								application.error({
									message: "Could not save text file.",
									response: response
								});
							}
						});
					}
				});
			}
		});
	},

	saveAs: function(options) {
		import(
			'../../../views/apps/file-browser/dialogs/files/save-as-dialog-view.js'
		).then((SaveAsDialogView) => {

			// show save as dialog
			//
			application.show(new SaveAsDialogView.default({
				model: this.getHomeDirectory(),

				// options
				//
				filename: this.getFileName(),

				// callbacks
				//
				save: (directory, filename) => {

					// check for exiting item with name
					//
					if (directory.hasItemNamed(filename)) {

						// show confirm
						//
						application.confirm({
							title: "Overwrite File",
							message: "A file already exists with this name.  Would you like to overwrite it?",

							// callbacks
							//
							accept: () => {
								let item = directory.getItemNamed(filename);

								// update existing file
								//
								new PdfFile(this.model.attributes).fetchText({

									// callbacks
									//
									success: (text) => {
										item.update(text, {

											// callbacks
											//
											success: () => {
												this.onSave(item);

												// perform callback
												//
												if (options && options.success) {
													options.success();
												}
											}
										});
									}
								});
							}
						});
					} else {
						this.saveNew(directory, filename, {

							// callbacks
							//
							success: () => {

								// perform callback
								//
								if (options && options.success) {
									options.success();
								}
							}
						});
					}
				}
			}));
		});
	},

	//
	// downloading methods
	//

	downloadFile: function() {

		// download current pdf file
		//
		if (this.model) {
			this.model.download();
		}
	},

	fetchText: function(options) {

		// fetch text from current pdf file
		//
		if (this.model) {
			this.model.fetchText(options);
		}
	},

	//
	// finding / replacing methods
	//

	find: function(needle, options) {

		// find needle in text
		//
		return this.getPdfView().find(needle, options);
	},

	//
	// full screen methods
	//

	toggleFullScreen: function() {

		// request full screen
		//
		let pdfView = this.getPdfView();
		if (pdfView) {
			if (!pdfView.isFullScreen()) {
				pdfView.requestFullScreen();
			} else {
				pdfView.exitFullScreen();
			}
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		
		// call superclass method
		//
		AppSplitView.prototype.onRender.call(this);
		
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

		// show initial help message
		//
		if (!this.model) {
			this.showHelpMessage();
			this.onLoad();
		} else {
			this.setStatus('Loading...');
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
		return new PdfSplitView({
			model: this.model,

			// options
			//
			preferences: this.preferences,
			show_sidebar: this.preferences.get('show_exif_info'),
			sidebar_size: this.preferences.get('info_bar_size'),

			// callbacks
			//
			onload: () => this.onLoad(),
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
	// message rendering methods
	//

	showHelpMessage: function() {
		this.showMessage("No PDF files.", {
			icon: '<i class="far fa-file-pdf"></i>',

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
			'../../../views/apps/pdf-viewer/dialogs/files/open-pdf-file-dialog-view.js'
		).then((OpenPdfFileDialogView) => {

			// show open dialog
			//
			this.show(new OpenPdfFileDialogView.default({

				// start with home directory
				//
				model: this.getHomeDirectory(),

				// callbacks
				//
				onopen: (items) => {
					if (items) {

						// find last item that is a pdf
						//
						let index = items.length - 1;
						let item = items[index];
						let found = item.getFileExtension() == 'pdf';
						while (!found && index > 0) {
							index--;
							item = items[index];
							found = item.getFileExtension() == 'pdf';
						}

						if (found) {
							this.openItems([item]);
						}
					}
				}
			}));
		});
	},
	
	showInfoDialog: function(options) {
		import(
			'../../../views/apps/file-browser/dialogs/info/file-info-dialog-view.js'
		).then((FileInfoDialogView) => {

			// show file info dialog
			//
			this.show(new FileInfoDialogView.default(_.extend({
				model: this.model
			}, options)));				
		});	
	},

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/pdf-viewer/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	//
	// text extraction methods
	//

	showTextFile: function(file) {
		application.launch('text_editor', {
			model: file
		});
	},

	showText: function() {
		this.fetchText({

			// callbacks
			//
			success: function(text) {
				this.showTextFile(new File({
					contents: text
				}));
			}
		})
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// call superclass method
		//
		AppSplitView.prototype.onLoad.call(this);

		// check if view still exists
		//
		if (this.isDestroyed()) {
			return;
		}

		// update child views
		//
		if (this.model) {

			// show split view
			//
			if (this.preferences.get('show_sidebar')) {
				this.getChildView('contents sidebar').onLoad();
			}
		}
	},

	onChange: function() {

		// close sidebar
		//
		if (Browser.device == 'phone') {
			this.getChildView('contents').closeSideBar();
		}

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	onChangeZoom: function(zoom) {

		// set zoom of document
		//
		this.getPdfView().setZoom(zoom);
	},

	//
	// touch event handling methods
	//

	onGestureStart: function() {
		this.zoomStart = this.getZoom(); 
	},

	onGestureChange: function(event) {
		this.getChildView('zoom').setZoom(Math.min(this.zoomStart * event.originalEvent.scale, 150));

		// block event from parent
		//
		this.block(event);
	},

	onGestureEnd: function() {
		this.setZoom(Math.min(this.zoomStart * event.originalEvent.scale, 150));
	},

	//
	// window event handling methods
	//

	onResize: function() {

		// update header
		//
		if (this.hasChildView('header zoom')) {
			let zoomMode = this.getChildView('header zoom_mode').getValue();
			if (zoomMode && zoomMode != 'actual_size') {

				// update current zoom
				//
				this.getChildView('header zoom').setZoomMode(zoomMode);
			}
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