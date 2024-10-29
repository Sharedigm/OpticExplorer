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
			<a class="search-by-address"><i class="fa fa-check"></i><i class="fa fa-home"></i>By Address</a>
		</li>
		
		<li role="presentation" type="search-by">
			<a class="search-by-name"><i class="fa fa-check"></i><i class="fa fa-font"></i>By Place Name</a>
		</li>
		
		<li role="presentation" type="search-by">
			<a class="search-by-coords"><i class="fa fa-check"></i><i class="fa fa-crosshairs"></i>By Coordinates</a>
		</li>
	`),

	events: {
		'click li[type=search-by] a': 'onClickSearchBy'
	},

	//
	// querying methods
	//

	hidden: function() {
		return {
			'search-by-name': true
		};
	},

	selected: function() {
		let preferences = this.parent.app.preferences;
		let searchKind = preferences.get('search_kind');

		return {
			'search-by-address': searchKind == 'address',
			'search-by-name': searchKind == 'name',
			'search-by-coords': searchKind == 'coords'
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

		// show / hide search
		//
		if (!this.isItemSelected(className)) {
			let search = [];
			search[searchKind] = undefined;
			this.parent.parent.showSearch(search);
		} else {
			this.parent.parent.showSearch(null);
		}
	}
});