/******************************************************************************\
|                                                                              |
|                               code-editor-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for viewing and editing code files.          |
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
import Directory from '../../../models/storage/directories/directory.js';
import Items from '../../../collections/storage/items.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import Multifile from '../../../views/apps/common/behaviors/tabbing/multifile.js';
import ContainableSelectable from '../../../views/behaviors/containers/containable-selectable.js';
import FindReplaceable from '../../../views/apps/common/behaviors/finding/find-replaceable.js';
import ItemShareable from '../../../views/apps/common/behaviors/sharing/item-shareable.js';
import ItemFavorable from '../../../views/apps/common/behaviors/opening/item-favorable.js';
import FileDownloadable from '../../../views/apps/file-browser/mainbar/behaviors/file-downloadable.js';
import FileUploadable from '../../../views/apps/file-browser/mainbar/behaviors/file-uploadable.js';
import FileDisposable from '../../../views/apps/file-browser/mainbar/behaviors/file-disposable.js';
import HeaderBarView from '../../../views/apps/code-editor/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/code-editor/sidebar/sidebar-view.js';
import TabbedContentView from '../../../views/apps/code-editor/mainbar/tabbed-content/tabbed-content-view.js';
import FooterBarView from '../../../views/apps/code-editor/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/code-editor/forms/preferences/preferences-form-view.js'

export default AppSplitView.extend(_.extend({}, Multifile, ContainableSelectable, FindReplaceable, ItemShareable, ItemFavorable, FileDownloadable, FileUploadable, FileDisposable, {

	//
	// attributes
	//

	name: 'code_editor',

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);

		// set model
		//
		if (this.collection && !this.model) {
			this.model = this.collection.at(0);
		}
		if (!this.model) {
			this.model = new File();
		}

		// create collection
		//
		if (!this.collection) {
			this.collection = new Items([this.model]);
		}

		// disable sorting of tabs
		//
		this.collection.comparator = null;

		// set attributes
		//
		this.directory = this.model.parent || application.getDirectory(this.preferences.get('home_directory'));

		// hide sidebar if not signed in and no directory
		//
		if (!application.session.user && !this.model.parent) {
			this.preferences.set({
				'show_sidebar': false
			});
		}
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('sidebar')) {
			this.getChildView('sidebar').each(callback, filter, options);
		}
	},

	//
	// attribute methods
	//

	title: function() {
		return this.directory? (this.directory.getName() || 'Home'): config.apps[this.name].name;
	},

	//
	// querying methods
	//

	isCodeFile: function(item) {
		let extension = item.getFileExtension().toLowerCase();
		let appName = application.settings.associations.get(extension);
		return appName == this.name;
	},

	hasOpenFile: function() {
		return !this.collection.isEmpty();
	},

	hasOpenFiles: function() {
		return this.collection.length > 1;
	},

	hasSelected: function() {
		return this.getActiveView().hasSelected();
	},

	hasSelectedItems: function() {
		if (this.hasChildView('sidebar')) {
			return this.getChildView('sidebar').hasSelectedItems();
		}
	},

	//
	// getting methods
	//

	getActiveView: function() {
		if (this.hasActiveView()) {
			return this.getChildView('content').getActiveView().getChildView('mainbar');
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

	getSelectedItems: function() {
		return this.getChildView('sidebar').getSelectedItems();
	},

	getItemView: function(model) {
		if (this.hasActiveView()) {
			return this.getActiveView().getItemView(model);
		}
	},

	getCursor: function() {
		return this.getActiveView().getCursor();
	},

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// setting methods
	//

	setDirectory: function(directory) {

		// set attributes
		//
		this.directory = directory;

		// set title
		//
		this.setTitle(this.title());

		// set sidebar
		//
		this.getChildView('sidebar').getChildView('files').setDirectory(directory);
	},

	//
	// navigating methods
	//

	pushDirectory: function(directory) {
		this.getChildView('header nav').pushDirectory(directory);
	},

	//
	// directory opening methods
	//

	openDirectory: function(directory) {
		if (directory.loaded) {
			this.setDirectory(directory);
		} else {
			directory.load({

				// callbacks
				//
				success: () => this.openDirectory(directory)
			});
		}
	},

	//
	// folder creating methods
	//

	newFolder: function() {
		this.directory.newDirectory({

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
	// selecting methods
	//

	select: function(which, options) {
		this.getActiveView().select(which, options);
	},

	selectRange: function() {
		let cursor = this.getActiveView().getCursor();
		let numLines = this.getActiveView().numLines();

		import(
			'../../../views/apps/common/dialogs/selection/select-range-dialog-view.js'
		).then((SelectRangeDialogView) => {

			// show select range dialog
			//
			application.show(new SelectRangeDialogView.default({
				start: cursor.row != numLines? cursor.row + 1: undefined,
				end: cursor.row == numLines? numLines + 1: undefined,

				// callbacks
				//
				accept: (start, end) => {
					if (!start) {
						start = 1;
					}
					if (!end) {
						end = numLines;
					}
					this.getActiveView().selectRange(start, end);
				}
			}));
		});
	},

	deselect: function() {
		this.getActiveView().deselect();
	},

	//
	// editing methods
	//

	undo: function() {
		this.getActiveView().undo();
	},

	redo: function() {
		this.getActiveView().redo();
	},

	cut: function() {
		application.clipboard = this.getActiveView().cut();
	},

	copy: function() {
		application.clipboard = this.getActiveView().copy();
	},

	paste: function() {
		this.getActiveView().paste(application.clipboard);
	},

	delete: function() {
		this.getActiveView().cut();
	},

	//
	// indenting methods
	//

	indent: function() {
		this.getActiveView().indent();
	},

	outdent: function() {
		this.getActiveView().outdent();
	},

	//
	// finding / replacing methods
	//

	find: function(needle, options) {

		// find needle in text
		//
		return this.getActiveView().find(needle, options);
	},

	replace: function(replacement) {

		// replace selected text with replacement text
		//
		return this.getActiveView().replace(replacement);
	},

	findReplace: function(replacement, options) {

		// replace selected text with replacement and find next
		//
		return this.getActiveView().findReplace(replacement, options);
	},

	replaceAll: function(replacement, options) {

		// replace all occurances of selected text with replacement
		//
		return this.getActiveView().replaceAll(replacement, options);
	},

	//
	// tabifying methods
	//

	tabify: function() {
		this.getActiveView().tabify();
	},

	untabify: function() {
		this.getActiveView().untabify();
	},

	//
	// running methods
	//

	run: function(options) {

		// show initial help message
		//
		this.showMessage("Running...", {
			icon: '<i class="fa fa-spin fa-spinner"></i>',
		});

		return $.ajax(config.servers.api + '/execute', {
			type:'POST',

			// options
			//
			dataType:'json',
			data: {
				'file': this.getActiveModel().get('path')
			},

			// callbacks
			//
			success: () => {
				this.hideMessage();
				this.getChildView('sidebar').getChildView('files').update();

				// perform callback
				//
				if (options && options.success) {
					options.success();
				}
			},
			error: () => {
				this.hideMessage();
				this.getChildView('sidebar').getChildView('files').update();

				// perform callback
				//
				if (options && options.error) {
					options.error();
				}		
			}
		});
	},

	stop: function() {
		return $.ajax(config.servers.api + '/stop', {
			type:'POST',

			// options
			//
			dataType:'json',
			data: {
				'file': this.getActiveModel().get('path')
			},

			// callbacks
			//
			success: () => {
				this.hideMessage();
			},
			error: () => {
				this.hideMessage();		
			}
		});
	},

	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView({
			preferences: this.preferences
		});
	},

	//
	// contents rendering methods
	//

	getSideBarView: function() {
		return new SideBarView({
			model: this.directory,

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			view_kind: this.preferences.get('sidebar_view_kind'),

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item)
		});
	},

	getContentView: function() {
		return new TabbedContentView({
			collection: this.collection,

			// options
			//
			preferences: this.preferences,
			show_sidebar: this.preferences.get('show_console'),
			sidebar_size: this.preferences.get('console_size'),

			// callbacks
			//
			onload: () => this.onLoad(),
			onchange: () => this.setDirty(),
			onchangecursor: () => this.onChangeCursor(),
			onchangeselection: () => this.onChangeSelection(),
			oncopy: () => this.parent.copy(),
			onclose: (index) => this.closeTab(index)
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

			// show open dialog
			//
			this.show(new OpenItemsDialogView.default({
				model: this.getHomeDirectory(),

				// options
				//
				title: "Open Code Files",

				// callbacks
				//
				onopen: (items) => this.openItems(items)
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
				model: this.getActiveView().model
			}, options)));				
		});	
	},

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/code-editor/dialogs/preferences/preferences-dialog-view.js'
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

		// reset state
		//
		this.setDirty(false);

		// call superclass method
		//
		AppSplitView.prototype.onLoad.call(this);
	},

	onChangeCursor: function() {
		let statusBarView = this.getChildView('footer status');
		if (statusBarView) {
			statusBarView.showCursorInfo(this.getCursor());
		}

		// perform callback (to update desktop status bar)
		//
		if (this.options.onchangeselection) {
			this.options.onchangeselection();
		}
	},

	//
	// file event handling methods
	//

	onOpen: function(item) {

		// open selected items
		//
		if (!this.options.onopen) {
			if (this.isCodeFile(item.model)) {

				// use this app to open
				//
				this.openSelected();
			} else if (item.model instanceof Directory) {

				// set current directory
				//
				this.setDirectory(item.model);
			} else {

				// use another app to open
				//
				application.openItem(item.model);
			}
		}

		// perform callback
		//
		if (this.options.onopen) {
			this.options.onopen(item);
		}
	},

	onSave: function() {

		// reset changed flag
		//
		this.setDirty(false);

		// call superclass method
		//
		AppSplitView.prototype.onSave.call(this);
	},

	//
	// selection event handling methods
	//

	onChangeSelection: function() {
		if (this.hasSelected()) {
			this.onSelect();
		} else {
			this.onDeselect();
		}
	},

	onSelect: function() {
		this.getChildView('header menu').onSelect();
	},

	onDeselect: function() {
		this.getChildView('header menu').onDeselect();
	},
	
	//
	// search and replace event handling methods
	//

	onFound: function() {
		this.getActiveView().focus();
		this.getChildView('header menu').onFound();
	},

	onReplaced: function() {
		this.getChildView('header menu').onReplaced();
	}
}), {

	//
	// static attributes
	//

	defaultName: 'Untitled.txt',
	clipboard: undefined,

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	}
});