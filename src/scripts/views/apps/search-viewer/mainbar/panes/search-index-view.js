/******************************************************************************\
|                                                                              |
|                             search-index-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for displaying search index results.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import User from '../../../../../models/users/user.js';
import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import File from '../../../../../models/storage/files/file.js';
import Items from '../../../../../collections/storage/items.js';
import BaseView from '../../../../../views/base-view.js';
import ItemOpenable from '../../../../../views/apps/common/behaviors/opening/item-openable.js';
import FilesView from '../../../../../views/apps/search-viewer/mainbar/files/files-view.js';
import PagerView from '../../../../../views/apps/common/mainbar/pager/pager-view.js';
import FileIndex from '../../../../../utilities/files/file-index.js';

export default BaseView.extend(_.extend({}, ItemOpenable, {

	//
	// attributes
	//

	className: 'results',

	template: template(`
		<div class="message well">Searching search index...</div>
		<div class="files"></div>
		<div class="pager"></div>
	`),

	regions: {
		files: '.files',
		pager: {
			el: '.pager',
			replaceElement: true
		}
	},

	items_per_page: 30,

	//
	// constructor
	//

	initialize: function() {
		this.options.date_format = 'date_only';

		// set attributes
		//
		if (this.options.items_per_page) {
			this.items_per_page = this.options.items_per_page;
		}
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

	getRange: function() {
		if (this.hasChildView('pager')) {
			return this.getChildView('pager').getRange();
		} else {
			return {
				from:0,
				to: this.items_per_page - 1
			};
		}
	},

	//
	// setting methods
	//

	setNumItems: function(numItems) {
		this.numItems = numItems;
		if (this.hasChildView('pager')) {
			this.getChildView('pager').setNumItems(this.numItems);
		}
	},

	//
	// fetching methods
	//

	fetchSearchIndex: function(query, options) {
		let range = this.getRange();

		FileIndex.search(query, {

			// options
			//
			details: this.options.preferences? this.options.preferences.get('detail_kind') : undefined,
			after: this.options.date_range? this.options.date_range[0] : undefined,
			before: this.options.date_range? this.options.date_range[1] : undefined,
			from: range.from,
			to: range.to,

			// callbacks
			//
			success: (data) => {
				let collection = new Items();

				// find max score
				//
				if (this.max_score == undefined && data.length > 0) {
					this.max_score = data[0].score
				}

				// parse files
				//
				for (let i = 0; i < data.length; i++) {
					let item = data[i];
					let owner = new User(item.user);

					// add file to collection
					//
					collection.add(new File({
						path: (owner.isAdmin()? '/' : '') + data[i].path,
						size: item.size,
						file_id: item.id,
						// owner: owner,
						score: item.score,
						created_at: new Date(item.created_at),
						modified_at: new Date(item.updated_at),
						accessed_at: new Date(item.updated_at)
					}));
				}

				// perform callback
				//
				if (options && options.success) {
					options.success(collection);
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
		this.searchFor(this.options.query);
	},

	showMessage: function(message) {
		this.$el.find('.message').text(message);
	},

	showCount: function(count) {
		this.showMessage(count + ' indexed ' + (count == 1? "file was" : "files were") + " found.");
	},

	searchFor: function(query) {

		// perform search
		//
		this.fetchSearchIndex(query, {

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

				// show results
				//
				if (collection.length > 0 && !this.hasChildView('pager')) {
					this.showPager(collection);
					if (this.numItems) {
						this.getChildView('pager').setNumItems(this.numItems);
					}
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
			max_score: this.max_score,
			multicolumn: this.options.multicolumn,
			preferences: new UserPreferences({
				view_kind: this.options.view_kind,
				detail_kind: this.options.detail_kind,
				date_format: this.options.date_format,
				show_thumbnails: true,
				sort_kind: 'score',
				sort_order: 'decreasing'
			}),

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: (item) => this.onOpen(item)
		}));
	},

	showPager: function(collection) {
		this.showChildView('pager', new PagerView({
			collection: collection,

			// options
			//
			item_type: 'files',
			items_per_page: this.items_per_page,

			// callbacks
			//
			onchange: () => {
				this.searchFor(this.options.query);
			}
		}));
	},

	//
	// event handling methods
	//

	onOpen: function(item) {
		this.openItem(item.model);
	}
}));