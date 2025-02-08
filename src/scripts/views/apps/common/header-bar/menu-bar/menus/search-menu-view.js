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

	events: {
		'click .search-by > a': 'onClickSearchBy'
	},

	//
	// setting methods
	//

	setSearchKind: function(searchKind) {

		// get class names of searches
		//
		let classNames = this.$el.find('.search-by').map((index, element) => {
			return $(element).find('a').attr('class');
		}).get();

		// deselect all search menu items
		//
		this.setItemsDeselected(classNames);

		// set selected search menu item
		//
		if (searchKind) {
			let searchBy = searchKind.replace(/_/g, '-');
			searchBy = searchBy.replace('min', 'num').replace('max', 'num');
			searchBy = searchBy.replace('before_', '').replace('after_', '');
			searchBy = searchBy.replace('before', 'date').replace('after', 'date');
			this.setItemSelected('search-by-' + searchBy, true);
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
			this.parent.parent.showSearch();
		}
	},
});