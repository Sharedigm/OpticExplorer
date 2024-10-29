/******************************************************************************\
|                                                                              |
|                              search-menu-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying search dropdown menus.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/menu-view.js';

export default MenuView.extend({

	//
	// attributes
	//

	template: template(`
		<li role="presentation" type="search-by">
			<a class="search-by-title"><i class="fa fa-check"></i><i class="fa fa-font"></i>By Title</a>
		</li>
		
		<li role="presentation" type="search-by">
			<a class="search-by-description"><i class="fa fa-check"></i><i class="fa fa-quote-left"></i>By Description</a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation" type="search-by">
			<a class="search-by-create-date"><i class="fa fa-check"></i><i class="fa fa-magic"></i>By Create Date</a>
		</li>
		
		<li role="presentation" type="search-by">
			<a class="search-by-update-date"><i class="fa fa-check"></i><i class="fa fa-pencil-alt"></i>By Update Date</a>
		</li>
		
		<li role="presentation" type="search-by">
			<a class="search-by-due-date"><i class="fa fa-check"></i><i class="fa fa-calendar"></i>By Due Date</a>
		</li>
	`),

	events: {
		'click li[type=search-by] a': 'onClickSearchBy'
	},

	//
	// querying methods
	//

	selected: function() {
		let preferences = this.parent.app.preferences;
		let searchKind = preferences.get('search_kind');

		return {
			'search-by-message': searchKind == 'message',
			'search-by-date': searchKind == 'date',
			'search-by-num-links': searchKind == 'num_links',
			'search-by-num-comments': searchKind == 'num_comments'
		};
	},

	//
	// setting methods
	//

	setSearchKind: function(searchKind) {

		// deselect all search menu items
		//
		this.setItemsDeselected(this.$el.find('li[type=search-by]').map((index, element) => { 
			return $(element).find('a').attr('class');
		}).get());

		// set selected search menu item
		//
		if (searchKind) {
			this.setItemSelected('search-by-' + searchKind.replace(/_/g, '-'), true);
		}
	},

	//
	// mouse event handling methods
	//

	onClickSearchBy: function(event) {
		let className = $(event.currentTarget).attr('class');
		let searchKind = className.replace('search-by-', '').replace(/-/g, '_');

		// update search
		//
		if (!this.isItemSelected(className)) {
			let search = [];
			search[searchKind] = undefined;
			this.parent.app.setSearch(search);
		} else {
			this.parent.app.setSearch(null);
		}
	}
});