/******************************************************************************\
|                                                                              |
|                               file-browser-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for navigating and manipulating files.       |
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
import ArchiveFile from '../../../models/storage/files/archive-file.js';
import Directory from '../../../models/storage/directories/directory.js';
import Volume from '../../../models/storage/directories/volume.js';
import BaseCollection from '../../../collections/base-collection.js';
import Items from '../../../collections/storage/items.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import MultiDoc from '../../../views/apps/common/behaviors/tabbing/multidoc.js';
import SelectableContainable from '../../../views/behaviors/containers/selectable-containable.js';
import MultiSelectable from '../../../views/behaviors/selection/multi-selectable.js';
import ItemOpenable from '../../../views/apps/common/behaviors/opening/item-openable.js';
import FileCopyable from '../../../views/apps/file-browser/mainbar/behaviors/file-copyable.js';
import FileDownloadable from '../../../views/apps/file-browser/mainbar/behaviors/file-downloadable.js';
import ItemShareable from '../../../views/apps/common/behaviors/sharing/item-shareable.js';
import ItemFavorable from '../../../views/apps/common/behaviors/opening/item-favorable.js';
import ItemInfoShowable from '../../../views/apps/file-browser/dialogs/info/behaviors/item-info-showable.js';
import DropboxUploadable from '../../../views/apps/file-browser/mainbar/behaviors/dropbox-uploadable.js';
import GDriveUploadable from '../../../views/apps/file-browser/mainbar/behaviors/gdrive-uploadable.js';
import Indexable from '../../../views/apps/common/behaviors/indexing/indexable.js';
import Unindexable from '../../../views/apps/common/behaviors/indexing/unindexable.js';
import HeaderBarView from '../../../views/apps/file-browser/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/file-browser/sidebar/sidebar-view.js';
import TabbedContentView from '../../../views/apps/file-browser/mainbar/tabbed-content/tabbed-content-view.js';
import FileDisposable from '../../../views/apps/file-browser/mainbar/behaviors/file-disposable.js';
import FileIconView from '../../../views/apps/file-browser/mainbar/files/icons/file-icon-view.js';
import FooterBarView from '../../../views/apps/file-browser/footer-bar/footer-bar-view.js';
import ContextMenuView from '../../../views/apps/file-browser/context-menus/context-menu-view.js';
import PreferencesFormView from '../../../views/apps/file-browser/forms/preferences/preferences-form-view.js'
import Browser from '../../../utilities/web/browser.js';
import Url from '../../../utilities/web/url.js';
import '../../../utilities/scripting/array-utils.js';

export default AppSplitView.extend(_.extend({}, MultiDoc, SelectableContainable, MultiSelectable, ItemOpenable, FileCopyable, FileDownloadable, ItemShareable, ItemFavorable, ItemInfoShowable, DropboxUploadable, GDriveUploadable, Indexable, Unindexable, {

	//
	// attributes
	//

	name: 'file_browser',

	events: {
		'click > .body': 'onClick',
		'change > .body > input[type="file"]': 'onChangeFile',
		'contextmenu > .body': 'onContextMenu'
	},

	caching: false,
	duration: 300,

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);

		// set attributes
		//
		if (!this.model) {
			if (this.collection) {
				this.model = this.collection.at(0);
			} else {
				this.model = application.getDirectory();
			}
		}
		if (!this.collection) {
			this.collection = new BaseCollection([this.model]);	

			// force reload
			//
			this.model.loaded = false;
		}
		
		// set optional parameters
		//
		if (this.options.hidden) {
			this.hidden = this.options.hidden;
		}
		if (this.options.dialog) {
			this.dialog = this.options.dialog;
		}
		if (this.options.preferences) {
			if (this.options.preferences.get('view_kind') == 'maps') {
				if (!this.model.contents.hasGeolocation()) {
					this.options.preferences.set('view_kind', 'icons');
				}
			}
		}

		// add to list
		//
		this.constructor.list.push(this);
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasActiveView()) {
			let activeView = this.getActiveView();
			if (activeView.each) {
				activeView.each(callback, filter, options);
			}
		}
	},

	//
	// attribute methods
	//

	icon: function() {
		if (this.model instanceof Volume) {
			return 'fa fa-database';
		}

		switch (this.model.getName()) {
			case '':
				return 'fa fa-home';
			case 'Trash':
				return 'fa fa-trash';
			case '.Clipboard':
				return 'fa fa-clipboard';
			case '.Thumbs':
				return 'fa fa-picture-o';
			default:
				return config.apps[this.name].icon;
		}
	},

	getFolderName: function(directory) {
		return directory? (directory.getName() || 'Home') : config.apps[this.name].name;
	},

	title: function() {
		let names = [];
		for (let i = 0; i < this.collection.length; i++) {
			names.push(this.getFolderName(this.collection.at(i)));
		}
		return names.join(' | ');
	},

	//
	// querying methods
	//

	isRoot: function() {
		return !this.dialog;
	},

	isTrashEmpty: function() {
		return FileDisposable.isTrashEmpty();
	},

	isClipboardEmpty: function() {
		return FileCopyable.isClipboardEmpty();
	},

	isWritableBy: function(items, user) {
		for (let i = 0; i < items.length; i++) {
			if (!items[i].isWritableBy(user)) {
				return false;
			}
		}
		return true;
	},

	hasTop: function() {
		return true;
	},

	hasGeolocatedItems: function() {
		return this.model.hasItems(Items.filters.is_geolocated) ||
			this.model.hasItems(Items.filters.is_geopositioned);
	},

	hasOpenFolder: function() {
		return !this.collection.isEmpty();
	},

	hasOpenFolders: function() {
		return this.collection.length > 1;
	},

	//
	// counting methods
	//

	numVisibleItems: function() {
		if (this.hasActiveModel()) {
			return this.getActiveModel().numVisibleItems(this.preferences.get('show_hidden_files'));
		}
	},

	//
	// getting methods
	//

	getHomeDirectory: function() {
		return application.isSignedIn()? application.getDirectory() : this.model;
	},

	getTop: function() {
		if (this.constructor.root) {
			return this.constructor.root;
		} else {
			return this;
		}
	},

	getItemView: function(model) {
		if (this.hasActiveView()) {
			return this.getActiveView().getItemView(model);
		}
	},

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	getDetails: function() {
		if (!this.preferences) {
			return [];
		}

		// get details
		//
		let details = this.preferences.get('properties');

		// add detail kind
		//
		if (this.preferences.has('detail_kind')) {
			details.push(this.preferences.get('detail_kind'))
		}

		return details;
	},

	//
	// setting methods
	//

	setDirectory: function(directory) {

		// check if directory id already open in another tab 
		//
		if (this.collection.contains(directory)) {
			let activeIndex = this.collection.indexOf(directory);
			this.setActiveIndex(activeIndex);
			return;
		}
		
		// set attributes
		//
		this.model = directory;
		this.contents = null;

		// update collection
		//
		let activeIndex = this.getActiveIndex();
		this.collection.remove(this.collection.at(activeIndex));
		this.collection.add(directory, {
			at: activeIndex
		});

		// update dialog title
		//
		this.setTitle(this.title());

		// reset active tab
		//
		this.setActiveIndex(activeIndex);

		// update view
		//
		this.onChange();
	},

	setDefaultPreferences: function() {

		// if all items can display thumbnails, then show tiles
		//
		if (this.model.isAllThumbs() && !this.model.isTop()) {

			// show tiles
			//
			this.preferences.set({
				'view_kind': 'tiles'
			});

			// set view menu to tiles
			//
			if (this.hasChildView('header menu view')) {
				this.getChildView('header menu view').setViewKind('tiles');
			}
		}
	},

	setSelected: function(selected) {
		if (selected.length == undefined) {
			this.selectItem(selected);
		} else {
			this.selectItems(selected);
		}
	},
	
	//
	// selecting methods
	//

	select: function(which, options) {
		switch (which) {
			case 'files':
				this.deselectAll();
				this.selectAll((item) => item.model instanceof File);
				break;
			case 'folders':
				this.deselectAll();
				this.selectAll((item) => item.model instanceof Directory || item.model instanceof Volume);
				break;
			default:
				this.getActiveView().select(which, {
					silent: true
				});
				break;
		}
		if (!options || !options.silent) {
			this.onSelect();
		}
	},

	selectItem: function(item) {
		let model = this.model.getItemNamed(item.getName());
		if (model) {
			let view = this.getItemView(model);
			if (view) {
				view.select();

				// update to reflect selection
				//
				this.onChangeSelection();
			}
		}
	},

	selectItems: function(items) {
		for (let i = 0; i < items.length; i++) {
			this.selectItem(items[i]);
		}
	},

	//
	// uploading methods
	//

	upload: function() {

		// trigger file input
		//
		this.$el.find('> .body > input[type="file"]').click();
	},

	uploadCloudItems: function(items) {
		this.getActiveView().uploadFiles(items, this.model, {
			show_progress: true,
			overwrite: true,

			// callbacks
			//
			success: () => {

				// play upload sound
				//
				application.play('upload');
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					title: "Upload Error",
					message: "Could not upload '" + model.get('name') + "'. ",
					response: response
				});
			}
		});
	},

	//
	// compressing methods
	//

	compressItem: function(item) {
		item.compress({

			// callbacks
			//
			success: (data) => {

				// play compress sound
				//
				application.play('compress');

				// add archive to directory
				//
				this.model.add(new ArchiveFile(data));
			}
		});
	},

	compressItems: function(items) {
		for (let i = 0; i < items.length; i++) {
			this.compressItem(items[i]);
		}
	},

	compress: function() {
		this.compressItems(this.getSelectedModels());
	},

	//
	// expansion methods
	//

	expandSelected: function() {
		this.expandFile(this.getSelectedModels()[0]);
	},

	//
	// file downloading methods
	//

	downloadSelected: function() {
		this.download(this.getSelectedModels());

		// play download sound
		//
		application.play('download');
	},


	//
	// indexing methods
	//

	indexSelected: function(options) {
		this.showIndexItemDialog(this.getSelectedModel(), options);
	},

	unindexSelected: function(options) {
		this.showUnindexItemDialog(this.getSelectedModel(), options);
	},

	//
	// editing methods
	//

	cut: function(items, options) {
		this.getActiveView().cut(items, _.extend({}, options, {

			// callbacks
			//
			success: () => {

				// play cut sound
				//
				application.play('cut');

				// perform callback
				//
				if (options && options.success) {
					options.success(items);
				}
			}
		}));
	},

	cutSelected: function(options) {
		let effect = application.settings.theme.get('icon_open_effect');

		// call attention to selected items
		//
		this.each((item) => {
			if (item.isSelected()) {
				item.showEffect(effect);
			}
		});

		// cut selected items
		//
		this.cut(this.getSelectedModels(), options);
	},

	copy: function(items, options) {
		this.getActiveView().copy(items, _.extend({}, options, {

			// callbacks
			//
			success: () => {

				// play copy sound
				//
				application.play('copy');

				// perform callback
				//
				if (options && options.success) {
					options.success(items);
				}
			}
		}));
	},

	copySelected: function(options) {
		let effect = application.settings.theme.get('icon_open_effect');

		// call attention to selected items
		//
		this.each((item) => {
			if (item.isSelected()) {
				item.showEffect(effect);
			}
		});

		// copy selected items
		//
		this.copy(this.getSelectedModels(), options);
	},

	paste: function(options) {
		this.getActiveView().paste(_.extend({}, options, {

			// callbacks
			//
			success: () => {

				// enable empty trash
				//
				if (FileDisposable.isTrashDirectory(this.model)) {
					if (this.hasChildView('header menu file')) {
						this.getChildView('header menu file').setItemEnabled('empty-trash');
					}
				}

				// play paste sound
				//
				application.play('paste');

				// perform callback
				//
				if (options && options.success) {
					options.success();
				}
			}
		}));
	},

	duplicate: function(items, options) {
		this.getActiveView().duplicate(items, _.extend({}, options, {

			// callbacks
			//
			success: () => {

				// play duplicate sound
				//
				application.play('duplicate');

				// perform callback
				//
				if (options && options.success) {
					options.success(items);
				}
			}
		}));
	},

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

		// check if items can be deleted
		//
		if (!this.isWritableBy(items, application.session.user)) {

			// show alert message
			//
			application.alert({
				icon: '<i class="fa fa-lock"></i>',
				title: "Permissions Error",
				message: "You do not have permissions to delete " + (items.length == 1? '"' + items[0].getName() + '"' : "these " + items.length + " items") + ".",
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

			// add shrink effect
			//
			for (let i = 0; i < items.length; i++) {
				let itemView = this.getItemView(items[i]);
				if (itemView && itemView.shrink) {
					itemView.shrink();
				}
			}

			this.getActiveView().deleteItems(items, {

				// callbacks
				//
				success: () => {

					// play delete sound
					//
					application.play('delete');
			
					// enable empty trash menu item
					//
					if (this.hasChildView('header menu file')) {
						this.getChildView('header menu file').setItemEnabled('empty-trash');
					}
				}
			});
		}
	},

	deleteSelected: function(options) {
		this.deleteItems(this.getSelectedModels(), options);
	},

	destroyItems: function(items, options) {

		// check if there are items to delete
		//
		if (items.length == 0) {

			// show notification
			//
			application.notify({
				icon: '<i class="fa fa-xmark"></i>',
				title: "Destroy Error",
				message: "No items selected."
			});

			return;
		}

		// check if items can be destroyed
		//
		if (!this.isWritableBy(items, application.session.user)) {

			// show alert message
			//
			application.alert({
				icon: '<i class="fa fa-lock"></i>',
				title: "Permissions Error",
				message: "You do not have permissions to destroy " + (items.length == 1? '"' + items[0].getName() + '"' : "these " + items.length + " items") + ".",
			});

			return;
		}

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm destroy
			//
			application.confirm({
				icon: '<i class="fa fa-xmark"></i>',
				title: "Destroy",
				message: "Are you sure you want to destroy (delete without recycling) " + (items.length == 1? '"' + items[0].getName() + '"' : "these " + items.length + " items") + "?",

				// callbacks
				//
				accept: () => {
					this.destroyItems(items, _.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {

			// add shrink effect
			//
			for (let i = 0; i < items.length; i++) {
				let itemView = this.getItemView(items[i]);
				if (itemView && itemView.shrink) {
					itemView.shrink();
				}
			}

			this.getActiveView().destroyItems(items, {

				// callbacks
				//
				success: () => {

					// play remove sound
					//
					application.play('remove');

					// enable empty trash menu item
					//
					if (this.hasChildView('header menu file')) {
						this.getChildView('header menu file').setItemEnabled('empty-trash');
					}
				}
			});
		}
	},

	destroySelected: function(options) {
		this.destroyItems(this.getSelectedModels(), options);
	},

	emptyTrash: function() {
		this.getActiveView().emptyTrash({

			// callbacks
			//
			success: () => {

				// play recycle sound
				//
				application.play('recycle');

				// disable empty trash menu item
				//
				if (this.hasChildView('header menu file')) {
					this.getChildView('header menu file').setItemDisabled('empty-trash');
				}
			}	
		});
	},
	
	//
	// folder creating methods
	//

	newFolder: function() {
		this.model.newDirectory({

			// callbacks
			//
			success: (model) => {
			
				// play new sound
				//
				application.play('new');

				// deselect previously selected items
				//
				this.deselectAll();

				// add grow effect
				//
				let itemView = this.getItemView(model);
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

	//
	// file creating methods
	//

	createNewTextFile: function(options) {

		// set optional parameter defaults
		//
		if (!options) {
			options = {};
		}
		if (!options.filename) {
			options.filename = 'Untitled.txt';
		}

		// make sure that directory is writable
		//
		if (!this.model.isWritable()) {

			// show alert message
			//
			application.alert({
				icon: '<i class="fa fa-lock"></i>',
				title: "Permissions Error",
				message: "You do not have permission to write to this directory."
			});

			return;
		}

		// create new text file
		//
		this.model.add(new File({
			path: (this.model.get('path') || '') + options.filename
		}), {

			// callbacks
			//
			success: (model) => {

				// save file
				//
				model.write(options.content || '', {

					// callbacks
					//
					success: () => {

						// play new sound
						//
						application.play('new');

						// add grow effect
						//
						let itemView = this.getItemView(model);
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

					error: (response) => {

						// show error message
						//
						application.error({
							message: "Could not save file.",
							response: response
						});
					}
				});
			}
		});
	},

	createNewVolume: function(attributes, options) {

		// set optional parameter defaults
		//
		if (!options) {
			options = {};
		}
		if (!options.filename) {
			options.filename = 'Untitled.' + attributes.type;
		}

		delete(attributes.type);

		// make sure that directory is writable
		//
		if (!this.model.isWritable()) {

			// show alert message
			//
			application.alert({
				icon: '<i class="fa fa-lock"></i>',
				title: "Permissions Error",
				message: "You do not have permission to write to this directory."
			});

			return;
		}

		// create new volume
		//
		this.model.add(new Volume({
			path: (this.model.get('path') || '') + options.filename
		}), {

			// callbacks
			//
			success: (model) => {

				// save file
				//
				model.write(JSON.stringify(attributes, null, '\t'), {

					// callbacks
					//
					success: () => {

						// play new sound
						//
						application.play('new');

						// add grow effect
						//
						let itemView = this.getItemView(model);
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
							message: "Could not save volume.",
							response: response
						});
					}
				});
			}
		});
	},

	//
	// directory opening methods
	//

	openDirectory: function(directory, options) {

		// check if dialogs are allowed
		//			
		if (this.constructor.allowDialogs) {

			// check if we are to open folders in a new window
			//
			if (!this.dialog ||
				this.preferences.get('open_folders_in_new_window') ||
				this.preferences.get('view_kind') == 'maps' ||
				options && options.open_folders_in_new_window) {

				// open directory in new dialog
				//
				this.showDirectory(directory, options);
			} else {

				// open directory in existing dialog
				//
				window.setTimeout(() => {
					this.getChildView('header nav').pushDirectory(directory, options);
				}, this.duration);
			}
		} else {

			// go to directory view
			//
			application.navigate('home?path=' + Url.encode(directory.get('path')), {
				trigger: true
			});
		}
	},

	openDirectories: function(directories, options) {
		if (options && options.open_folders_in_new_tab && options.open_folders_in_new_window) {
			
			// open directories in new tabbed window
			//
			this.openDirectory(new BaseCollection(directories), options);
		} else if (options && options.open_folders_in_new_tab) {

			// open directories in new tab
			//
			for (let i = 0; i < directories.length; i++) {
				this.collection.add(directories[i]);
			}
		} else {

			// open directories in same or new window
			//
			for (let i = 0; i < directories.length; i++) {
				this.openDirectory(directories[i], options);
			}
		}

		this.onChange();
	},

	openItem: function(item, options) {
		this.openItems([item], options);
	},

	openItems: function(items, options) {
		let effect = application.settings.theme.get('icon_open_effect');

		// call attention to selected items
		//
		this.each((item) => {
			if (item.isSelected && item.isSelected()) {
				if (item.showEfect) {
					item.showEffect(effect);
				}
			}
		});

		if (options && options.onopen) {

			// perform callback
			//
			this.options.onopen(items);
		} else if (items.length > 0) {	
			let item = items[0];

			if (item instanceof Directory || item instanceof Volume) {

				// open directories
				//
				this.openDirectories(items, options);
			} else if (item instanceof File) {

				// open files
				//
				this.openFiles(items, options);
			}
		} else {

			// no items selected - show dialog
			//
			this.showOpenDialog();
		}
	},

	//
	// compression methods
	//

	expandFile: function(archiveFile) {
		archiveFile.fetchContents({

			// callbacks
			//
			success: (data) => {
				application.confirm({
					icon: '<i class="fa fa-expand"></i>',
					title: "Expand File",
					message: "This archive contains " + ArchiveFile.getContentsDescription(data) +  ". " + "Would you like to expand (uncompress) this file?",

					// callbacks
					//
					accept: () => {
						archiveFile.extract({

							// callbacks
							//
							success: () => {

								// play extract sound
								//
								application.play('extract');

								// add contents to current directory
								//
								this.model.addItems(Items.toItems(data));
							},

							error: (response) => {

								// show error message
								//
								application.error({
									message: "Could not extract archive file.",
									response: response
								});									
							}
						});
					}
				});
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not get contents of archive file.",
					response: response
				});	
			}
		});
	},

	//
	// app launching methods
	//

	showDirectory: function(directory, options) {
		application.launch("file_browser", {
			model: directory instanceof Directory || directory instanceof Volume? directory : null,
			collection: directory instanceof BaseCollection? directory : null,
			favorites: this.options.favorites,
			preferences: this.preferences.copy(),
			selected: options? options.selected : undefined,
			parent: this
		}, {
			new_window: true,
			success: options? options.success : undefined
		});
	},

	//
	// file renaming methods
	//

	rename: function(views) {
		if (views.length > 0) {
			views[0].editName();	
		} else {

			// show notification
			//
			application.notify({
				icon: '<i class="fa fa-mouse-pointer"></i>',
				title: "Select",
				message: "No items selected."
			});
		}
	},

	//
	// searching methods
	//

	searchFor: function(search) {

		// save contents
		//
		if (!this.contents) {
			this.contents = this.model.contents.models.clone();
		}

		// show searching message
		//
		this.showMessage("Searching folder...", {
			icon: '<i class="fa fa-spin fa-spinner"></i>',
		});

		// start search
		//
		this.model.load({

			// options
			//
			search: search,
			recursive: true,
			details: this.getDetails(),

			// callbacks
			//
			success: () => {

				// end searching
				//
				this.hideMessage();

				// update view
				//
				this.showStatusMessage();
			}
		});
	},

	clearSearch: function() {

		// restore contents
		//
		if (this.contents) {
			this.model.contents.set(this.contents);
			this.contents = null;
		}

		// update view
		//
		this.showStatusMessage();
	},

	//
	// rendering methods
	//

	onRender: function() {

		// configure splitter
		//
		this.splitSizes = [
			this.preferences.get('sidebar_size'),
			100 - this.preferences.get('sidebar_size')
		];

		// call superclass method
		//
		AppSplitView.prototype.onRender.call(this);

		// check if this is the root file browser
		//
		if (this.model.isRoot && this.model.isRoot()) {

			// add root class
			//
			this.$el.addClass('root');

			// save reference to root
			//
			this.constructor.root = this;
		}

		// show / hide sidebar view
		//
		if (this.isDesktop() && !this.preferences.get('show_desktop_sidebar') ||
			!this.preferences.get('show_sidebar')) {
			this.getChildView('contents').hideSideBar();
		} else {
			this.showSideBar();
		}

		// show footer bar
		//
		if (!this.options.hidden || !this.options.hidden['footer-bar']) {
			this.showFooterBar();
		} else {
			this.$el.find('.footer-bar').remove();
		}
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

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			view_kind: this.preferences.get('sidebar_view_kind'),
			directory: this.constructor.root? this.constructor.root.model : this.model,
			favorites: this.options.favorites
		});
	},

	getContentView: function() {
		return new TabbedContentView({
			collection: this.collection,

			// options
			//
			preferences: this.preferences,
			selected: this.getSelectedModels(),
			filter: this.options.filter,
			multicolumn: true,

			// capabilities
			//
			selectable: true,
			editable: true,
			draggable: true,

			// callbacks
			//
			onload: (item) => this.onLoad(item),
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondragend: () => this.onDragEnd(),
			onshowdropzone: () => this.onShowDropzone(),
			onhidedropzone: () => this.onHideDropzone(),
			ondropon: (items) => this.onDropOn(items),
			ondroponchild: (items, child, options) => this.onDropOnChild(items, child, options),
			ondropinitems: (items) => this.onDropInItems(items),
			ondropinfiles: (items) => this.onDropInFiles(items),
			ondropout: (items) => this.onDropOut(items),
			onchangetab: (index) => this.onChangeTab(index),
			onclose: (index) => this.closeTab(index)
		});
	},

	getContextMenuView: function() {
		return new ContextMenuView();
	},

	showStatusMessage: function() {
		if (this.numVisibleItems() == 0) {
			this.showMessage("No files or folders.", {
				icon: '<i class="far fa-folder"></i>'
			});
		} else {
			this.hideMessage();
		}
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

	showOpenDialog: function(directory) {
		import(
			'../../../views/apps/file-browser/dialogs/files/open-items-dialog-view.js'
		).then((OpenItemsDialogView) => {

			// show open dialog
			//
			this.show(new OpenItemsDialogView.default({
				model: directory || this.getHomeDirectory(),

				// options
				//
				title: "Open Items",

				// callbacks
				//
				onopen: (items) => {
					this.openItems(items);
				}
			}));
		});
	},

	showOpenWithDialog: function(items) {
		import(
			'../../../views/apps/app-launcher/dialogs/apps/open-app-dialog-view.js'
		).then((OpenAppDialogView) => {

			// show open with dialog
			//
			this.show(new OpenAppDialogView.default({

				// callbacks
				//
				onopen: (model) => {
					this.openFilesWith(model.get('id'), items, {
						all: true
					});
				}
			}));
		});
	},

	showNewVolumeDialog: function() {
		import(
			'../../../views/apps/file-browser/dialogs/files/new-volume-dialog-view.js'
		).then((NewVolumeDialogView) => {

			// show preferences dialog
			//
			this.show(new NewVolumeDialogView.default({

				// callbacks
				//
				onsave: (attributes) => {
					this.createNewVolume(attributes);
				}
			}));
		});
	},

	showInfoDialog: function(options) {
		let items = this.getSelectedModels();
		let effect = application.settings.theme.get('icon_open_effect');
		let delay = effect && effect != 'none'? 500 : 0;

		// call attention to selected items 
		//
		this.each((item) => {
			if (item.isSelected && item.isSelected()) {
				if (item.showEffect) {
					item.showEffect(effect);
				}
			}
		});

		window.setTimeout(() => {
			if (items.length > 0) {
				this.showItemsInfoDialog(items, options);
			} else {

				// show notification
				//
				application.notify({
					icon: '<i class="fa fa-info-circle"></i>',
					title: "Show Info",
					message: "No items selected."
				});
			}
		}, delay);
	},

	showSetItemPlaceDialogView: function(item) {
		import(
			'../../../views/apps/file-browser/dialogs/places/set-item-place-dialog-view.js'
		).then((SetItemPlaceDialogView) => {

			// show set place dialog
			//
			application.show(new SetItemPlaceDialogView.default({
				model: item.model,

				// callbacks
				//
				onsubmit: (place) => {

					// update database
					//
					item.model.setPlace(place);

					// update model
					//
					item.model.set('place', place);

					// update views
					//
					item.render();
				}
			}));
		});
	},
	
	showPreferencesDialog: function() {
		import(
			'../../../views/apps/file-browser/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	//
	// full screen methods
	//

	enterFullScreen: function() {
		this.dialog.maximize({
			full_screen: true
		});
	},

	exitFullScreen: function() {
		if (this.dialog.isMaximized()) {
			this.dialog.unmaximize();
		}
	},

	requestFullScreen: function() {
		application.requestFullScreen(document.documentElement);
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// call superclass method
		//
		AppSplitView.prototype.onLoad.call(this);

		// update modal header
		//
		this.updateHeader();

		// update view
		//
		this.showStatusMessage();

		// show selected item
		//
		if (this.options.selected) {
			this.setSelected(this.options.selected);
		}

		// listen to model for changes
		//
		this.listenTo(this.model, 'change', this.onChange);

		// perform callback
		//
		if (this.options.onload) {
			this.options.onload();
		}
	},

	onChange: function() {

		// call superclass method
		//
		AppSplitView.prototype.onChange.call(this);

		// update view
		//
		this.showStatusMessage();
	},

	onChangeTab: function() {

		// update attributes
		//
		if (this.hasActiveModel()) {
			this.model = this.getActiveModel();
		}

		// update view
		//
		this.onChange();
	},

	onCloseTab: function(index) {

		// call mixin method
		//
		MultiDoc.onCloseTab.call(this, index);

		// update child views
		//
		this.getChildView('content').updateTabs();

		// update modal header
		//
		this.updateHeader();
	},

	//
	// drag and drop event handling methods
	//

	onDragEnd: function() {
		if (this.hasChildView('header menu')) {
			this.getChildView('header menu').onChangeSelection();
		}
		if (this.hasChildView('footer directory_info')) {
			this.getChildView('footer directory_info').onChange();
		}
	},
	
	onShowDropzone: function() {
		this.hideMessage();
	},

	onHideDropzone: function() {
		this.showStatusMessage();
	},

	onDropOn: function(items) {

		// bring dialog to top and focus
		//
		if (this.dialog) {
			if (this.dialog.toTop) {
				this.dialog.toTop();
			}
			this.dialog.focus();
		}

		// move dragged items
		//
		this.getActiveView().moveItems(items, this.model, {

			// callbacks
			//
			success: () => {

				// enable empty trash
				//
				if (FileDisposable.isTrashDirectory(this.model)) {
					if (this.hasChildView('header menu file')) {
						this.getChildView('header menu file').setItemEnabled('empty-trash');
					}
				}

				// play move sound
				//
				application.play('move');
			}
		});
	},

	onDropOnChild: function(items, child, options) {
		this.getActiveView().moveItems(items, child.model, {

			// callbacks
			//
			success: () => {

				// play move sound
				//
				application.play('move');

				// enable empty trash
				//
				if (FileDisposable.isTrashDirectory(child)) {
					if (this.hasChildView('header menu file')) {
						this.getChildView('header menu file').setItemEnabled('empty-trash');
					}
				}

				// perform callback
				//
				if (options && options.success) {
					options.success();
				}
			}
		});
	},

	onDropInItems: function(items) {
		let directory = this.hasChildren(this.filters.highlighted)? this.getChildModels(this.filters.highlighted)[0] : this.model;

		/*
		this.countItems(items, function(num) {
			alert("found " + num + " items");	
		}, {
			filter: this.filters.is_visible,
		});
		return;
		*/

		/*
		let callback = function(item, options) {

			// perform callback
			//
			if (options && options.success) {
				options.success();
			}
		};

		this.iterateItems(items, callback, {
			async: true,
			filter: this.filters.is_visible,
		});
		return;
		*/

		this.getActiveView().uploadItems(items, directory, {
			show_progress: true,

			// callbacks
			//
			success: () => {

				// play upload sound
				//
				application.play('upload');
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					title: "Upload Error",
					message: "Could not upload '" + model.get('name') + "'. ",
					response: response
				});
			}
		});
	},

	onDropInFiles: function(files, options) {
		let directory = this.hasHighlighted()? this.getHighlightedModels()[0] : this.model;

		this.getActiveView().uploadFiles(files, directory, {
			show_progress: true,
			
			// callbacks
			//
			success: () => {

				// peform callback
				//
				if (options && options.success) {
					options.success();
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					title: "Upload error",
					message: "Could not upload '" + model.get('name') + "'. ",
					response: response
				});
			}
		});
	},

	onDropOut: function(items) {

		// download dropped items
		//
		this.download(items);

		// play download sound
		//
		application.play('download');
	},

	onUnminimize: function() {

		// redraw to address Chrome svg problem with file icon text size
		//
		if (Browser.is_chrome) {
			window.setTimeout(() => {
				if (this.hasActiveView()) {
					this.getActiveView().each((view) => {
						if (view instanceof FileIconView) {
							view.render();
						}
					});
				}
			}, 100);
		}
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {

		// allow files to process events
		//
		if (this.hasActiveView() && !this.getActiveView().onKeyDown(event)) {

			// call superclass method
			//
			AppSplitView.prototype.onKeyDown.call(this, event);
		}
	},

	//
	// file event handling methods
	//

	onChangeFile: function(event) {
		let path = $(event.target).val();
		if (path) {
			this.getActiveView().uploadFiles(event.target.files, this.model, {
				show_progress: true,

				// callbacks
				//
				success: () => {

					// play upload sound
					//
					application.play('upload');
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						title: "Upload Error",
						message: "Could not upload '" + model.get('name') + "'. ",
						response: response
					});
				}
			});
		}
	},
	
	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		this.constructor.list.remove(this);
	}
}), {

	//
	// static attributes
	//

	root: null,
	list: [],
	allowDialogs: true,

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	}
});