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
		
		<li role="presentation" type="search-by">
			<a class="search-by-kind"><i class="fa fa-check"></i><i class="fa fa-file"></i>By Kind</a>
		</li>
		
		<li role="presentation" type="search-by">
			<a class="search-by-size"><i class="fa fa-check"></i><i class="fa fa-download"></i>By Size</a>
		</li>

		<li role="separator" class="divider"></li>

		<li role="presentation" type="search-by">
			<a class="search-by-keyword"><i class="fa fa-check"></i><i class="fa fa-key"></i>By Keyword</a>
		</li>

		<li role="presentation" type="search-by">
			<a class="search-by-meaning"><i class="fa fa-check"></i><i class="fa fa-lightbulb"></i>By Meaning</a>
		</li>

		<li role="separator" class="divider"></li>

		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="search-by-date dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-calendar-alt"></i>By Date<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
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
		
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="search-by-photo dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-image"></i>By Photo<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
				<li role="presentation" type="search-by">
					<a class="search-by-resolution"><i class="fa fa-check"></i><i class="fa fa-arrows-alt"></i>Resolution</a>
				</li>
		
				<li role="presentation" type="search-by">
					<a class="search-by-make-model"><i class="fa fa-check"></i><i class="fa fa-camera"></i>Make / Model</a>
				</li>
		
				<li role="presentation" type="search-by">
					<a class="search-by-focal-length"><i class="fa fa-check"></i><i class="fa fa-arrows-alt-h"></i>Focal Length</a>
				</li>
		
				<li role="presentation" type="search-by">
					<a class="search-by-aperture"><i class="fa fa-check"></i><i class="fa fa-dot-circle"></i>Aperture</a>
				</li>
				
				<li role="presentation" type="search-by">
					<a class="search-by-exposure"><i class="fa fa-check"></i><i class="fa fa-clock"></i>Exposure</a>
				</li>
		
				<li role="presentation" type="search-by">
					<a class="search-by-iso"><i class="fa fa-check"></i><i class="fa fa-film"></i>ISO</a>
				</li>
		
				<li role="presentation" type="search-by">
					<a class="search-by-capture-date"><i class="fa fa-check"></i><i class="fa fa-calendar-alt"></i>Capture Date</a>
				</li>
			</ul>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="search-by-sharing dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-share"></i>By Sharing<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
				<li role="presentation" type="search-by">
					<a class="search-by-shared-with-me"><i class="fa fa-check"></i><i class="fa fa-reply"></i>Shared with Me</a>
				</li>
				
				<li role="presentation" type="search-by">
					<a class="search-by-shared-by-me"><i class="fa fa-check"></i><i class="fa fa-share"></i>Shared by Me</a>
				</li>
		
				<li role="presentation" type="search-by">
					<a class="search-by-links"><i class="fa fa-check"></i><i class="fa fa-link"></i>Links</a>
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
			'search-by-kind': searchKind == 'kind',
			'search-by-size': searchKind == 'size',
			'search-by-keyword': searchKind == 'keyword',
			'search-by-meaning': searchKind == 'meaning',
			'search-by-create-date': searchKind == 'create_date',
			'search-by-modify-date': searchKind == 'modify_date',
			'search-by-access-date': searchKind == 'access_date',
			'search-by-resolution': searchKind == 'resolution',
			'search-by-make-model': searchKind == 'make_model',
			'search-by-focal-length': searchKind == 'focal_length',
			'search-by-aperture': searchKind == 'aperture',
			'search-by-exposure': searchKind == 'exposure',
			'search-by-iso': searchKind == 'iso',
			'search-by-capture-date': searchKind == 'capture_date'
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
			this.parent.parent.showSearch();
		}
	}
});