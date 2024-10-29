/******************************************************************************\
|                                                                              |
|                                  apps-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying and manipulating files.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ItemsView from '../../../../views/items/items-view.js';
import AppIconsView from '../../../../views/apps/common/items/icons/app-icons-view.js';
import AppCardsView from '../../../../views/apps/common/items/cards/app-cards-view.js';
import AppsListView from '../../../../views/apps/common/items/lists/apps-list-view.js';
import AppsMenuView from '../../../../views/apps/common/items/menus/apps-menu-view.js';

export default ItemsView.extend({

	//
	// attributes
	//

	className: 'items',
	empty: "No apps.",

	template: template(`
		<div class="items"></div>
	`),

	regions: {
		items: {
			el: '.items',
			replaceElement: true
		}
	},

	//
	// constructor
	//

	initialize: function() {
		
		// set optional parameter defaults
		//
		if (this.options.emptyView) {
			this.emptyView = this.options.emptyView;
		}
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('items')) {
			this.getChildView('items').each(callback, filter, options);
		}
	},

	//
	// selecting methods
	//

	selectByName: function(name) {
		let model = this.collection.getByName(name);
		let itemView = this.getChildView('items').getItemView(model);

		// deselect currently selected item
		//
		this.$el.find('.selected').removeClass('selected');

		// select new item
		//
		if (itemView) {
			itemView.select({
				silent: true
			});
		}

		return itemView;
	},

	deselectAll: function() {
		if (this.hasChildView('items')) {
			this.getChildView('items').deselectAll();
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show files and directories
		//
		switch (this.options.view_kind || 'icons') {
			case 'icons':
				this.showIcons();
				break;
			case 'cards':
				this.showCards();
				break;
			case 'lists':
				this.showLists();
				break;
			case 'menus':
				this.showMenus();
				break;
		}
	},

	showIcons: function() {
		this.showChildView('items', new AppIconsView(_.extend({
			collection: this.collection
		}, this.options)));
	},

	showCards: function() {
		this.showChildView('items', new AppCardsView(_.extend({
			collection: this.collection
		}, this.options)));
	},

	showLists: function() {
		this.showChildView('items', new AppsListView(_.extend({
			collection: this.collection
		}, this.options)));
	},

	showMenus: function() {
		this.showChildView('items', new AppsMenuView(_.extend({
			collection: this.collection
		}, this.options)));
	}
});