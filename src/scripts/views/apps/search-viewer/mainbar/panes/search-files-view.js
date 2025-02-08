/******************************************************************************\
|                                                                              |
|                             search-files-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for displaying file search results.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import BaseView from '../../../../../views/base-view.js';
import ItemOpenable from '../../../../../views/apps/common/behaviors/opening/item-openable.js';
import FilesView from '../../../../../views/apps/file-browser/mainbar/files/files-view.js';

export default BaseView.extend(_.extend({}, ItemOpenable, {

	//
	// attributes
	//

	className: 'results',

	template: template(`
		<div class="message well">Searching shared files...</div>
		<div class="files"></div>
	`),

	regions: {
		files: '.files'
	},

	//
	// querying methods
	//

	hasSelected: function() {
		return this.getChildView('files').hasSelected();
	},

	numResults: function() {
		return this.collection? this.collection.length : 0;
	},

	//
	// getting methods
	//

	getSelectedModels: function() {
		return this.getChildView('files').getSelectedModels();
	},

	//
	// fetching methods
	//

	fetchSharedFiles: function(query, path, options) {
		application.getDirectory(path).load({
			search: {
				name: query
			},
			recursive: true,
			details: 'size',

			// callbacks
			//
			success: (model) => {
				this.collection = model.contents;

				// perform callback
				//
				if (options && options.success) {
					options.success(this.collection);
				}
			}
		});
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show child views
		//
		this.searchFor(this.options.query, this.options.directory);
	},

	showMessage: function(message) {
		this.$el.find('.message').text(message);
	},

	showCount: function(count) {
		this.showMessage(count + " shared " + (count == 1? "item was" : "items were") + " found.");
	},

	searchFor: function(query, directory) {

		// perform search
		//
		this.fetchSharedFiles(query, directory, {

			// callbacks
			//
			success: (collection) => {
				this.collection = collection;

				// check if view still exists
				//
				if (this.isDestroyed()) {
					return;
				}

				// show results
				//
				if (collection.length > 0) {
					this.showFiles();
				}

				// perform callback
				//
				if (this.options.onchange) {
					this.options.onchange(collection);
				}
			}
		});
	},

	showFiles: function() {
		this.showChildView('files', new FilesView({
			collection: this.collection,

			// options
			//
			multicolumn: this.options.multicolumn,
			preferences: new UserPreferences({
				view_kind: this.options.view_kind,
				detail_kind: this.options.detail_kind,
				date_format: this.options.date_format,
				show_thumbnails: true
			}),

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: (item) => this.onOpen(item)
		}));
	},

	//
	// event handling methods
	//

	onOpen: function(item) {
		this.openItem(item.model);
	}
}));