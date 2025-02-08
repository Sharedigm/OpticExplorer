/******************************************************************************\
|                                                                              |
|                               settings-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying and manipulating settings.    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ItemsView from '../../../../../views/items/items-view.js';
import SettingsIconsView from '../../../../../views/apps/settings-browser/sidebar/items/icons/settings-icons-view.js';
import SettingsListView from '../../../../../views/apps/settings-browser/sidebar/items/lists/settings-list-view.js';
import SettingsCardsView from '../../../../../views/apps/settings-browser/sidebar/items/cards/settings-cards-view.js';

export default ItemsView.extend({

	//
	// attributes
	//

	className: 'items',

	template: template(`<div class="items"></div>`),

	regions: {
		items: {
			el: '.items',
			replaceElement: true
		}
	},

	empty: "No apps",

	//
	// constructor
	//

	initialize: function() {
		
		// set optional parameter defaults
		//
		if (this.options.emptyView) {
			this.emptyView = this.options.emptyView;
		}

		// set default options
		//
		this.options.selectable = true;
		this.options.deselectable = false;
		this.options.editable = false;
		this.options.draggable = false;
		this.options.droppable = false;
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
			case 'lists':
				this.showLists();
				break;
			case 'cards':
				this.showCards();
				break;
		}
	},

	showIcons: function() {
		this.showChildView('items', new SettingsIconsView(_.extend({
			collection: this.collection
		}, this.options)));
	},

	showLists: function() {
		this.showChildView('items', new SettingsListView(_.extend({
			collection: this.collection
		}, this.options)));
	},

	showCards: function() {
		this.showChildView('items', new SettingsCardsView(_.extend({
			collection: this.collection
		}, this.options)));
	}
});