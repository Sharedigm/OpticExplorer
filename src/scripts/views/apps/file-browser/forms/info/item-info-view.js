/******************************************************************************\
|                                                                              |
|                               item-info-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing information about a file.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import InfoFormView from '../../../../../views/apps/common/forms/info-form-view.js';
import ItemHistoryPaneView from '../../../../../views/apps/file-browser/forms/info/panes/items/item-history-pane-view.js';
import ItemPermissionsPaneView from '../../../../../views/apps/file-browser/forms/info/panes/items/item-permissions-pane-view.js';
import ItemPlacePaneView from '../../../../../views/apps/file-browser/forms/info/panes/items/item-place-pane-view.js';
import ShareRequestsListView from '../../../../../views/apps/file-browser/sharing/share-requests/list/share-requests-list-view.js';
import LinksListView from '../../../../../views/apps/file-browser/sharing/links/list/links-list-view.js';

export default InfoFormView.extend({

	//
	// attributes
	//

	events: {
		'mousedown': 'onMouseDown'
	},

	//
	// counting methods
	//

	numShareRequests: function() {
		if (this.hasChildView('sharing')) {
			return this.getChildView('sharing').collection.length;
		}
	},

	numSelectedShareRequests: function() {
		if (this.hasChildView('sharing')) {
			return this.getChildView('sharing').numSelected();
		}
	},

	numLinks: function() {
		if (this.hasChildView('links')) {
			return this.getChildView('links').collection.length;
		}
	},

	numSelectedLinks: function() {
		if (this.hasChildView('links')) {
			return this.getChildView('links').numSelected();
		}
	},
	
	//
	// getting methods
	//

	getSelectedShareRequests: function() {
		if (this.hasChildView('sharing')) {
			return this.getChildView('sharing').getSelectedModels();
		}
	},

	getSelectedLinks: function() {
		if (this.hasChildView('links')) {
			return this.getChildView('links').getSelectedModels();
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.showRegions();

		// hide tabs
		//
		if (!this.model.has('place')) {
			this.hideTab('place');
		}
		if (!this.model.get('num_links')) {
			this.hideTab('links');
		}
		if (!this.model.get('num_shares')) {
			this.hideTab('sharing');
		}
	},

	showRegion: function(name) {
		switch (name) {
			case 'item':
				this.showItem();
				break;
			case 'general':
				this.showGeneralInfo();
				break;
			case 'history':
				this.showHistoryInfo();
				break;
			case 'permissions':
				this.showPermissions();
				break;
			case 'place':
				this.showPlace();
				break;
			case 'sharing':
				this.showShareRequests();
				break;
			case 'links':
				this.showLinks();
				break;
		}
	},

	showItem: function() {
		this.showChildView('item', new (this.getIconView())({
			model: this.model,

			// capabilities
			//
			selectable: false
		}));
	},

	//
	// tab hiding and showing methods
	//

	hideTab: function(name) {
		this.$el.find('.' + name + '-tab').hide();
	},

	showTab: function(name) {
		this.$el.find('.' + name + '-tab').show();
	},

	//
	// pane rendering methods
	//

	showHistoryInfo: function() {
		this.showChildView('history', new ItemHistoryPaneView({
			model: this.model
		}));
	},

	showPermissions: function() {
		this.showChildView('permissions', new ItemPermissionsPaneView({
			model: this.model,
			recursive: false
		}));
	},

	showPlace: function() {
		this.showChildView('place', new ItemPlacePaneView({
			model: this.model
		}));
	},

	showShareRequests: function() {
		if (this.options.shareRequests) {
			this.showShareRequestsList(this.options.shareRequests);
		} else {
			this.fetchAndShowShareRequests();
		}
	},

	showLinks: function() {
		if (this.options.links) {
			this.showLinksList(this.options.links);
		} else {
			this.fetchAndShowLinks();
		}	
	},

	//
	// list rendering methods
	//

	showShareRequestsList: function(shareRequests) {
		this.showChildView('sharing', new ShareRequestsListView({
			collection: shareRequests,

			// callbacks
			//
			onchange: () => this.onChange()
		}));
	},

	showLinksList: function(links) {
		this.showChildView('links', new LinksListView({
			collection: links,

			// callbacks
			//
			onchange: () => this.onChange()
		}));
	},

	//
	// fetching methods
	//

	fetchAndShowShareRequests: function() {
		this.model.fetchShareRequests({

			// callbacks
			//
			success: (collection) => {
				if (!this.isDestroyed()) {
					this.showShareRequestsList(collection);
				}
			}
		});
	},

	fetchAndShowLinks: function() {
		this.model.fetchLinks({

			// callbacks
			//
			success: (collection) => {
				if (!this.isDestroyed()) {
					this.showLinksList(collection);
				}
			}
		});
	},

	//
	// event handling methods
	//

	onChange: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	//
	// mouse event handling methods
	//

	onMouseDown: function() {

		// deselect previously selected items
		//
		if (this.hasChildView('sharing')) {
			this.getChildView('sharing').deselectAll();
		}
		if (this.hasChildView('links')) {
			this.getChildView('links').deselectAll();
		}

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	}
});