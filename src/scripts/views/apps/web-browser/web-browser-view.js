/******************************************************************************\
|                                                                              |
|                               web-browser-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for browsing the web.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../models/base-model.js';
import File from '../../../models/storage/files/file.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import LinkShareable from '../../../views/apps/common/behaviors/sharing/link-shareable.js';
import HeaderBarView from '../../../views/apps/web-browser/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/web-browser/sidebar/sidebar-view.js';
import WebView from '../../../views/apps/web-browser/mainbar/web-view.js';
import PreferencesFormView from '../../../views/apps/web-browser/forms/preferences/preferences-form-view.js'
import Browser from '../../../utilities/web/address-bar.js';
import Url from '../../../utilities/web/browser.js';
import '../../../utilities/web/url.js';

export default AppSplitView.extend(_.extend({}, LinkShareable, {

	//
	// attributes
	//

	name: 'web_browser',

	//
	// constructor
	//

	initialize: function() {
	
		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);
	},

	//
	// querying methods
	//

	hasSelected: function() {
		if (this.hasChildView('sidebar')) {
			return this.getChildView('sidebar').hasSelected();
		}
	},

	//
	// getting methods
	//

	getSelected: function() {
		if (this.getChildView('sidebar')) {
			return this.getChildView('sidebar').getSelected();
		}
	},
	
	getUrl: function() {
		return this.getChildView('header address').getValue();
	},

	getUrlFileContents: function(url) {
		return [
			'[InternetShortcut]',
			'URL=' + url
		].join('\n');
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

	//
	// dialog methods
	//

	showOpenUrlDialog: function() {
		import(
			'../../../views/apps/web-browser/dialogs/files/open-url-file-dialog-view.js'
		).then((OpenUrlFileDialogView) => {

			// show open dialog
			//
			this.show(new OpenUrlFileDialogView.default({

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

	//
	// file opening methods
	//

	openItems: function(items) {

		// set attributes
		//
		this.model = items[0];

		// load first model
		//
		this.read(this.model);
	},

	read: function(model) {

		// set attributes
		//
		if (model) {
			this.model = model;
		}

		// set dialog title
		//
		this.setTitle(this.model.getName());

		// read text file contents
		//
		if (!this.model.isNew()) {
			this.model.read({

				// callbacks
				//
				success: (data) => {
					let lines = data.split('\n');
					for (let i = 0; i < lines.length; i++) {
						if (lines[i].contains('URL=')) {
							let pair = lines[i].split('=');
							let url = pair[1];
							this.setAddress(url);
							break;
						}	
					}
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not read url file.",
						response: response
					});
				}
			});
		}

		this.onLoad();
	},

	//
	// saving methods
	//

	save: function(url, options) {

		// update file
		//
		this.model.update(this.getUrlFileContents(url), {

			// callbacks
			//
			success: () => {
				this.onSave(this.model);

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
	},

	saveAs: function(url, directory, filename, options) {

		// create new text file
		//
		directory.add(new File({
			path: (directory.get('path') || '') + filename
		}), {

			// fshowMcallbacks
			//
			success: (model) => {

				// save file
				//
				model.write(this.getUrlFileContents(url), {

					// callbacks
					//
					success: () => {
						this.setModel(model);
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
	},

	showSaveAsDialog: function(url) {
		import(
			'../../../views/apps/file-browser/dialogs/files/save-as-dialog-view.js'
		).then((SaveAsDialogView) => {

			// show save as dialog
			//
			application.show(new SaveAsDialogView.default({
				model: this.getHomeDirectory(),

				// options
				//
				filename: File.defaultName + '.url',

				// callbacks
				//
				save: (directory, filename) => {

					// chedk if item exists
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
								item.update(this.getUrlFileContents(url), {

									// callbacks
									//
									success: () => {
										this.setModel(item);
										this.onSave(item);
									}
								});
							}
						});
					} else {
						this.saveAs(url, directory, filename);
					}
				}
			}));
		});
	},

	//
	// favorites methods
	//

	addToFavorites: function() {
		import(
			'../../../views/apps/web-browser/dialogs/favorites/add-to-favorites-dialog-view.js'
		).then((AddToFavoritesDialogView) => {

			// show open dialog
			//
			this.show(new AddToFavoritesDialogView.default({
				model: new BaseModel({
					name: undefined,
					url: this.url
				}),

				// callbacks
				//
				onsave: (item) => {	
					this.getChildView('sidebar favorites').addFavorites([item]);
				}
			}));
		});
	},
	
	deleteFavorites: function(items) {
		if (items && items.length > 0) {
			this.getChildView('sidebar favorites').deleteFavorites(items, {
				confirm: true
			});
		}
	},
	
	//
	// url opening methods
	//

	loadUrl: function(url) {

		// close sidebar
		//
		if (Browser.device == 'phone') {
			this.getChildView('contents').closeSideBar();
		}

		// hide any previous help message
		//
		this.hideMessage();

		// set attributes
		//
		this.url = url;

		// load url content
		//
		this.getChildView('content').loadUrl(this.url);
	},

	//
	// navigating methods
	//

	addressToUrl: function(address) {
		if (address.startsWith('http') || address.startsWith('www.')) {
			return address;
		} else {
			
			// search
			//
			let url = this.constructor.searchUrl + address.replace(' ', '+');
			return config.servers.api + '/proxy?url=' + Url.encode(url);
		}
	},

	setAddress: function(address, options) {

		// add protocol
		//
		if (address.startsWith('www')) {
			address = window.top.location.protocol + '//' + address;
		} else if (address.startsWith('#')) {
			address = window.top.location.origin + window.top.location.pathname + address;
		}

		// set dialog title
		//
		this.setTitle(address);

		// update address bar
		//
		this.getChildView('header address').setValue(address);

		// set url
		//
		this.loadUrl(this.addressToUrl(address));

		// add address to history
		//
		if (!options || !options.silent) {
			this.getChildView('header nav').push(address, options);
		}
	},
	
	//
	// sharing methods
	//

	shareByTopic: function(options) {
		this.shareLinkByTopic(this.getUrl(), _.extend({}, options, {
			message: 'Check out this link: ' + '\n'
		}));
	},

	shareByMessage: function(options) {
		this.shareLinkByMessage(this.getUrl(), _.extend({}, options, {
			message: 'Check out this link: ' + '\n'
		}));
	},

	shareByEmail: function() {
		import(
			'../../../views/apps/file-browser/sharing/mail/dialogs/share-by-email-dialog-view.js'
		).then((ShareByEmailDialogView) => {

			// show share by email dialog
			//
			this.show(new ShareByEmailDialogView.default({
				message: this.getUrl()
			}));
		});
	},

	shareByLink: function(options) {
		this.showShareByLinkDialog(this.getUrl(), options);
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		AppSplitView.prototype.onRender.call(this);

		// set initial url
		//
		if (this.model) {
			this.read(this.model);
		} else if (this.options.url != undefined) {
			this.setAddress(this.options.url);
		} else if (this.preferences.has('homepage')) {
			this.setAddress(this.preferences.get('homepage'));
		} else {

			// show initial help message
			//
			this.showMessage("Enter a web address or search terms.", {
				icon: '<i class="fa fa-search"></i>'
			});
		}
	},

	onShow: function() {

		// set focus
		//
		this.$el.find('.address-bar input').focus();
	},

	showCode: function(file) {
		application.launch('code_editor', {
			model: file
		});
	},

	showSource: function() {
		$.ajax({
			url: config.servers.api + '/proxy/source?url=' + this.url,
			type: 'GET',

			// callbacks
			//
			success: (data) => {
				this.showCode(new File({
					name: 'index.html',
					contents: data
				}));
			}
		});
	},

	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView();
	},

	//
	// content rendering methods
	//

	getSideBarView: function() {
		return new SideBarView({

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			view_kind: this.preferences.get('sidebar_view_kind'),
			favorites: this.options.favorites,

			// callbacks
			//
			ondropon: () => this.deselectAll()
		});
	},

	getContentView: function() {
		return new WebView({

			// options
			//
			url: this.url,
			useProxy: false,

			// callbacks
			//
			onload: () => this.onLoad(),
			onerror: (error) => this.showMessage(error, {
				icon: '<i class="fa fa-bug"></i>'
			})
		});
	},

	showWeb: function() {
		this.$el.find('.web').show();
	},

	hideWeb: function() {
		this.$el.find('.web').hide();
	},

	//
	// dialog rendering methods
	//

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/web-browser/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	//
	// file event handling methods
	//
	
	onSave: function(item) {

		// perform callback
		//
		if (this.options.onsave) {
			this.options.onsave(item);
		}
	}
}), {
	
	//
	// static attributes
	//

	searchUrl: 'http://www.google.com/search?q=',

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	}
});