/******************************************************************************\
|                                                                              |
|                            spectrum-editor-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for viewing and editing spectra.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import File from '../../../models/storage/files/file.js';
import Directory from '../../../models/storage/directories/directory.js';
import Spectrum from '../../../models/optics/lights/spectrum.js';
import Items from '../../../collections/storage/items.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import Multifile from '../../../views/apps/common/behaviors/tabbing/multifile.js';
import FileUploadable from '../../../views/apps/file-browser/mainbar/behaviors/file-uploadable.js';
import SelectableContainable from '../../../views/behaviors/containers/selectable-containable.js';
import MultiSelectable from '../../../views/behaviors/selection/multi-selectable.js';
import ItemShareable from '../../../views/apps/common/behaviors/sharing/item-shareable.js';
import ItemInfoShowable from '../../../views/apps/file-browser/dialogs/info/behaviors/item-info-showable.js';
import HeaderBarView from '../../../views/apps/spectrum-editor/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/spectrum-editor/sidebar/sidebar-view.js';
import TabbedContentView from '../../../views/apps/spectrum-editor/mainbar/tabbed-content/tabbed-content-view.js';
import FooterBarView from '../../../views/apps/spectrum-editor/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/spectrum-editor/forms/preferences/preferences-form-view.js'

export default AppSplitView.extend(_.extend({}, Multifile, FileUploadable, SelectableContainable, MultiSelectable, ItemShareable, ItemInfoShowable, {

	//
	// attributes
	//

	name: 'spectrum_editor',

	events: {

		// none - let subviews handle selection events
		//
	},

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);

		// set static attributes
		//
		// this.constructor.current = this;

		// set app count
		//
		this.count = this.constructor.count++;

		// set model
		//
		if (this.collection && !this.model) {
			this.model = this.collection.at(0);
		}
		if (!this.model && this.preferences.has('initial_file')) {
			this.model = new File({
				path: this.preferences.get('initial_file')
			});
		}

		// create collection
		//
		if (!this.collection) {
			if (this.model) {
				this.collection = new Items([this.model]);
			} else {
				this.collection = new Items();
			}
		}

		// disable sorting of tabs
		//
		this.collection.comparator = null;

		// set preferences
		//
		if (this.options.show_sidebar == false) {
			this.preferences.set('show_sidebar', false);
		}

		// set attributes
		//
		this.colors = {
			'primary': '#4060c0',
			'secondary': '#17c5e0',
			'tertiary': '#0d7384'
		};
		this.directory = new Directory({
			path: this.preferences.get('home_directory')
		});
		this.sharedDirectory = new Directory({
			path: config.apps.spectrum_editor.spectra_directory
		});
		this.uploadsDirectory = new Directory({
			path: this.preferences.get('uploads_directory')
		});
	},

	//
	// attribute methods
	//

	title: function() {
		return this.directory? (this.directory.getName() || 'Home'): config.apps[this.name];
	},

	//
	// querying methods
	//

	hasChanged: function() {
		return this.hasActiveModel() && !this.getActiveModel().isNew();
	},

	hasSelectedItems: function() {
		if (this.hasChildView('sidebar')) {
			return this.getChildView('sidebar').hasSelectedItems();
		}
	},

	//
	// counting methods
	//

	numWavelengths: function() {
		if (this.hasActiveView()) {
			let spectrum = this.getActiveView().spectrum;
			return spectrum? spectrum.numWavelengths() : 0;
		} else {
			return 0;
		}
	},

	//
	// getting methods
	//

	getActiveViewport: function() {
		return this.getActiveView().getChildView('mainbar');
	},
	
	getHomeDirectory: function() {
		if (application.isSignedIn()) {

			// use directory from preferences
			//
			return new Directory({
				path: this.preferences.get('home_directory')
			});
		} else if (this.model && this.model.parent) {

			// use directory from current file
			//
			return this.model.parent;
		} else {

			// use current directory
			//
			return new Directory();
		}
	},

	getActiveSpectrum: function() {
		return this.getActiveView().spectrum;
	},

	getSideBarItemView: function(model) {
		return this.getChildView('sidebar').getItemView(model);
	},

	getSelectedItemViews: function() {
		return this.getChildView('sidebar').getSelected();
	},

	getSelectedItems: function() {
		return this.getChildView('sidebar').getSelectedModels();
	},

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		switch (key) {

			// toolbar options
			//
			case "toolbars":
				this.setToolbarsVisible(value);
				break;

			// view options
			//
			case "view_kind":
				this.setViewKind(value);
				break;
		}

		// call superclass method
		//
		AppSplitView.prototype.setOption.call(this, key, value);
	},

	setDirectory: function(directory) {

		// set attributes
		//
		this.directory = directory;

		// set sidebar
		//
		this.getChildView('sidebar lights').setDirectory(directory);
	},

	//
	// navigation methods
	//

	pushDirectory: function(directory) {
		if (this.hasChildView('nav')) {
			this.getChildView('nav').pushDirectory(directory);
		}
	},

	//
	// spectrum creating methods
	//

	newFile: function() {

		// open new file
		//
		this.loadFile(new File());
	},

	newFolder: function() {
		let directoryName = this.directory.getUniqueName(Directory.defaultName);
		this.directory.createDirectory(directoryName, {

			// callbacks
			//
			success: (model) => {
			
				// play add sound
				//
				application.play('add');

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

	//
	// material opening methods
	//

	openFile: function(file, options) {

		// check if item is already open
		//
		if (this.isAlreadyOpen(file)) {

			// activate existing tab
			//
			this.setActiveModel(file);

		// load new file
		//
		} else if (!file.isNew()) {

			// open material
			//
			this.loadFile(file);

		// open material
		//
		} else {

			// set current naterial
			//
			if (options && options.material) {
				this.options.material = options.material;
			}

			// open new tab
			//
			this.collection.add(file);

			// show material
			//
			if (options && options.material) {
				this.getActiveView().setMaterial(options.material);
			}

			// clear current naterial
			//
			this.options.material = undefined;
		}

		// show material
		//
		if (options && options.material) {
			this.getActiveView().setMaterial(options.material);
		}

		// perform callback
		//
		if (options && options.success) {
			options.success(file);
		}
	},

	openSelected: function() {

		// if no selected items, show open dialog
		//
		if (!this.hasSelected()) {
			this.showOpenDialog();
		} else {
			let selected = this.getSelectedModels();
			let item = selected[0];
			this.openItem(item);
		}
	},

	//
	// file parsing methods
	//

	parseFile: function(file, text, options) {
		Spectrum.parseYaml(text, {

			// callbacks
			//
			success: (model) => {

				// perform callback
				//
				if (options && options.success) {
					options.success(model);
				}
			}
		});
	},

	//
	// file deleting methods
	//

	deleteSelectedItems: function(options) {
		this.deleteItems(this.getSelectedItems(), options);
	},

	showContents: function() {

		// call superclass method
		//
		AppSplitView.prototype.showContents.call(this);

		// show initial spectrum
		//
		if (this.options.spectrum) {
			this.getActiveView().setSpectrum(this.options.spectrum);
			this.options.spectrum = null;
		}
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
			model: this.directory,

			// sidebar preferences
			//
			panels: this.preferences.get('sidebar_panels'),
			view_kind: this.preferences.get('sidebar_view_kind'),

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item)
		});
	},

	getContentView: function() {
		return new TabbedContentView({
			collection: this.collection,

			// options
			//
			preferences: this.preferences,
			show_sidebar: this.preferences.get('show_data_editor'),
			sidebar_size: this.preferences.get('data_editor_bar_size'),
			colors: this.colors,
			app_count: this.count,

			// callbacks
			//
			onload: () => this.onLoad(),
			onactivate: () => this.onActivate(),
			onclose: (tabIndex) => this.closeTab(tabIndex)
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
		this.showMessage("No spectra.", {
			icon: '<i class="fa fa-rainbow"></i>',

			// callbacks
			//
			onclick: () => this.showOpenDialog()
		});
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

				// start with shared directory
				//
				model: directory || this.sharedDirectory,

				// options
				//
				title: "Open Wavelengths",

				// callbacks
				//
				onopen: (items) => this.openItems(items)
			}));
		});
	},

	showInfoDialog: function() {
		import(
			'../../../views/apps/spectrum-editor/dialogs/info/spectrum-info-dialog-view.js'
		).then((SpectrumInfoDialogView) => {

			// show spectrum info dialog
			//
			this.show(new SpectrumInfoDialogView.default({
				model: this.getActiveSpectrum(),
				file: this.getActiveModel()
			}));
		});
	},

	showPreferencesDialog: function() {
		/*
		require([
			'views/apps/spectrum-editor/dialogs/preferences-dialog-view',
		], (PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
		*/
	},

	//
	// drag and drop event handling methods
	//

	onDropIn: function(items) {

		// play upload sound
		//
		application.play('upload');

		// open optics files
		//
		this.openItems(items);
	},

	//
	// file event handling methods
	//

	onSave: function() {

		// update views
		//
		this.getChildView('header menu').onSave();
		this.getChildView('content').onChange();

		// reset changed flag
		//
		this.setDirty(false);
	}
}), {

	//
	// static attributes
	//

	defaultName: 'Untitled.lght',
	count: 0,

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	}
});