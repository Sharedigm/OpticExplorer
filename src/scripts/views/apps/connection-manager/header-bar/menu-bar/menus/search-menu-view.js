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
			<a class="search-by-name"><i class="fa fa-check"></i><i class="fa fa-font"></i>By Name</a>
		</li>
		
		<li role="separator" class="divider" style="display:none"></li>
		
		<li role="presentation" type="search-by" style="display:none">
			<a class="search-by-location"><i class="fa fa-check"></i><i class="fa fa-globe-americas"></i>By Location</a>
		</li>
		
		<li role="presentation" type="search-by" style="display:none">
			<a class="search-by-occupation"><i class="fa fa-check"></i><i class="fa fa-briefcase"></i>By Occupation</a>
		</li>
		
		<li role="presentation" type="search-by" style="display:none">
			<a class="search-by-age"><i class="fa fa-check"></i><i class="fa fa-hourglass-half"></i>By Age</a>
		</li>
		
		<li role="presentation" type="search-by" style="display:none">
			<a class="search-by-gender"><i class="fa fa-check"></i><i class="fa fa-transgender"></i>By Gender</a>
		</li>
		
		<li role="presentation" class="dropdown dropdown-submenu" style="display:none">
			<a class="search-by-date dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-calendar-alt"></i>By Date<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
				<li role="presentation" type="search-by">
					<a class="search-by-birth-date"><i class="fa fa-check"></i><i class="fa fa-birthday-cake"></i>Birth Date</a>
				</li>
		
				<li role="presentation" type="search-by">
					<a class="search-by-join-date"><i class="fa fa-check"></i><i class="fa fa-user-circle"></i>Join Date</a>
				</li>
				
				<li role="presentation" type="search-by">
					<a class="search-by-connect-date"><i class="fa fa-check"></i><i class="fa fa-user-friends"></i>Connect Date</a>
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

		// set initial menu state
		//
		return {
			'search-by-name': searchKind == 'name',
			'search-by-location': searchKind == 'location',
			'search-by-occupation': searchKind == 'occupation',
			'search-by-age': searchKind == 'age',
			'search-by-gender': searchKind == 'gender',
			'search-by-birth-date': searchKind == 'birth-date',
			'search-by-join-date': searchKind == 'join-date',
			'search-by-connect-date': searchKind == 'connect-date'
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
			this.parent.app.setSearch(search);
		} else {
			this.parent.app.setSearch(null);
		}
	}
});