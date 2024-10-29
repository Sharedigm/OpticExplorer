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
			<a class="search-by-name"><i class="fa fa-check"></i><i class="fa fa-font"></i>Name</a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="search-by-date dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-calendar-alt"></i>Date<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
				<li role="presentation" type="search-by">
					<a class="search-by-create-date"><i class="fa fa-check"></i><i class="fa fa-magic"></i>Create Date</a>
				</li>
		
				<li role="presentation" type="search-by">
					<a class="search-by-modify-date"><i class="fa fa-check"></i><i class="fa fa-edit"></i>Modify Date</a>
				</li>
		
				<li role="presentation" type="search-by">
					<a class="search-by-access-date"><i class="fa fa-check"></i><i class="fa fa-eye"></i>Access Date</a>
				</li>
			</ul>
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
			'search-by-name': searchKind == 'name',
			'search-by-create-date': searchKind == 'create_date',
			'search-by-modify-date': searchKind == 'modify_date',
			'search-by-access-date': searchKind == 'access_date'
		};
	},

	//
	// mouse event handling methods
	//

	onClickSearchBy: function(event) {
		let className = $(event.currentTarget).attr('class');
		let searchKind = className.replace('search-by-', '').replace(/-/g, '_');
		let searchValue = searchKind == this.parent.app.preferences.get('search_kind')? searchKind : false;

		// update menu
		//	
		this.setItemsDeselected(this.$el.find('li[type=search-by]').map((index, element) => { 
			return $(element).find('a').attr('class');
		}).get());
		this.setItemSelected(className, searchValue != false);
		
		// update search options
		//
		this.parent.app.setSearchKind(searchValue);
	}
});