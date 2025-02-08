/******************************************************************************\
|                                                                              |
|                               tune-editor-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for viewing and editing tune files.          |
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
import Items from '../../../collections/storage/items.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import Multifile from '../../../views/apps/common/behaviors/tabbing/multifile.js';
import FindReplaceable from '../../../views/apps/common/behaviors/finding/find-replaceable.js';
import ItemShareable from '../../../views/apps/common/behaviors/sharing/item-shareable.js';
import HeaderBarView from '../../../views/apps/tune-editor/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/tune-editor/sidebar/sidebar-view.js';
import TabbedContentView from '../../../views/apps/tune-editor/mainbar/tabbed-content/tabbed-content-view.js';
import FooterBarView from '../../../views/apps/tune-editor/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/tune-editor/forms/preferences/preferences-form-view.js'

export default AppSplitView.extend(_.extend({}, Multifile, ItemShareable, FindReplaceable, {

	//
	// attributes
	//

	name: 'tune_editor',

	sample: `
		X:1
		T:Untitled
		M:4/4
		C:anonymous
		R:scale
		K:G
		C,D,E,F, | G,A,B,C | DEFG | ABcd | efga | bc'd'e' | f'g'a'b' | 
	`,

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

		// set collection
		//
		if (this.collection) {
			this.collection = new Items(this.getTuneFiles(this.collection.models));
		} else if (this.model) {
			this.collection = new Items([this.model]);
		} else {
			this.collection = new Items();
		}

		// set attributes
		//
		this.directory = this.getHomeDirectory();
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

	isPlaying: function() {
		if (this.hasChildView('track')) {
			return this.getChildView('track').isPlaying();
		}
	},

	hasOpenTune: function() {
		return !this.collection.isEmpty();
	},

	hasOpenTunes: function() {
		return this.collection.length > 1;
	},

	//
	// counting methods
	//

	numOpenTunes: function() {
		return this.collection.length;
	},

	//
	// getting methods
	//

	getShareableItems: function() {
		return this.collection.models;
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
	
	getTrackTime: function() {
		return this.getChildView('content').getActiveView().getTrackTime();
	},

	getDuration: function() {
		return this.getChildView('content').getActiveView().getDuration();
	},

	getTuneFiles: function(items) {
		if (items) {
			return new Items(items).filter((model) => {
				return model.getFileExtension() == 'abc';
			});
		} else {
			return [];
		}
	},

	getCursor: function() {
		return this.getChildView('content').getActiveView().getCursor();
	},

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// setting methods
	//

	setTuneFiles: function(items) {

		// set collection to tune files
		//
		this.collection.reset(this.getTuneFiles(items));

		// update footer info
		//
		if (this.hasChildView('info')) {
			this.getChildView('info').update();
		}
	},

	setCollection: function(collection) {
		this.setTuneFiles(collection.models);
	},

	setDirectory: function(directory) {

		// set attributes
		//
		this.directory = directory;

		// set title
		//
		this.setTitle(this.title());

		// set sidebar
		//
		this.getChildView('sidebar').setDirectory(directory);
	},

	setOption: function(key, value) {
		switch (key) {

			// mainbar options
			//
			case 'markup_bar_size':
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

	setTrackTime: function(time) {
		this.getChildView('content').getActiveView().setTrackTime(time);
	},

	//
	// navigating methods
	//

	pushDirectory: function(directory) {
		this.getChildView('header nav').pushDirectory(directory);
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

				// options
				//
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
	// playing methods
	//

	play: function() {
		this.getActiveView().play();
	},

	pause: function() {
		this.getActiveView().pause();
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

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			view_kind: this.preferences.get('sidebar_view_kind')
		});
	},

	getContentView: function() {
		return new TabbedContentView({
			collection: this.collection,

			// options
			//
			preferences: this.preferences,
			show_sidebar: this.preferences.get('show_markup'),
			sidebar_size: this.preferences.get('markup_bar_size'),
			sample: this.sample.trimLines(),

			// callbacks
			//
			onload: () => this.onLoad(),
			onchange: () => this.onChange(),
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
			'../../../views/apps/tune-editor/dialogs/tunes/open-tune-file-dialog-view.js'
		).then((OpenTuneFileDialogView) => {

			// show open dialog
			//
			this.show(new OpenTuneFileDialogView.default({
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
			'../../../views/apps/tune-editor/dialogs/preferences/preferences-dialog-view.js'
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

	onChangeCursor: function() {
		this.getChildView('footer status_bar').showCursorInfo();
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

	/*
	onSelect: function() {
		this.getChildView('header menu').onSelect();
	},

	onDeselect: function() {
		this.getChildView('header menu').onDeselect();
	},
	*/
	
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

	clipboard: undefined,

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	}
});