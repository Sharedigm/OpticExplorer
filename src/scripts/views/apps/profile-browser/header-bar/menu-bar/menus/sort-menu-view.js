/******************************************************************************\
|                                                                              |
|                               sort-menu-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying sort dropdown menus.                    |
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
		<li role="presentation" type="sort-by">
			<a class="sort-by-name"><i class="fa fa-check"></i><i class="fa fa-font"></i>By Name</a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation" type="sort-by">
			<a class="sort-by-location"><i class="fa fa-check"></i><i class="fa fa-globe-americas"></i>By Location</a>
		</li>
		
		<li role="presentation" type="sort-by">
			<a class="sort-by-occupation"><i class="fa fa-check"></i><i class="fa fa-briefcase"></i>By Occupation</a>
		</li>
		
		<li role="presentation" type="sort-by">
			<a class="sort-by-gender"><i class="fa fa-check"></i><i class="fa fa-transgender"></i>By Gender</a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation" type="sort-order">
			<a class="sort-increasing"><i class="fa fa-check"></i><i class="fa fa-sort-amount-up"></i>Increasing</a>
		</li>
		
		<li role="presentation" type="sort-order">
			<a class="sort-decreasing"><i class="fa fa-check"></i><i class="fa fa-sort-amount-down"></i>Decreasing</a>
		</li>
	`),

	events: {
		'click li[type=sort-by] a': 'onClickSortBy',
		'click li[type=sort-order] a': 'onClickSortOrder'
	},

	//
	// querying methods
	//

	selected: function() {
		let preferences = this.parent.app.preferences;
		let sortKind = preferences.get('sort_kind');
		let sortOrder = preferences.get('sort_order');

		// set initial menu state
		//
		return {
			'sort-by-name': sortKind == 'name',
			'sort-by-location': sortKind == 'location',
			'sort-by-occupation': sortKind == 'occupation',
			'sort-by-age': sortKind == 'age',
			'sort-by-gender': sortKind == 'gender',
			'sort-by-birth-date': sortKind == 'birth_date',
			'sort-by-join-date': sortKind == 'join_date',
			'sort-by-connect-date': sortKind == 'connect_date',
			'sort-increasing': sortOrder == 'increasing',
			'sort-decreasing': sortOrder == 'decreasing'
		};
	},

	//
	// mouse event handling methods
	//

	onClickSortBy: function(event) {
		let className = $(event.currentTarget).attr('class');
		let sortKind = className.replace('sort-by-', '').replace(/-/g, '_');

		// update menu
		//
		this.$el.find('li[type="sort-by"]').removeClass('selected');
		this.$el.find('li .' + className).closest('li').addClass('selected');

		// update files
		//
		this.parent.app.setOption('sort_kind', sortKind);
		this.parent.app.getChildView('contents').onChange();
	},

	onClickSortOrder: function(event) {
		let className = $(event.currentTarget).attr('class');
		let sortOrder = className.replace('sort-', '').replace(/-/g, '_');

		// update menu
		//
		this.$el.find('li[type="sort-order"]').removeClass('selected');
		this.$el.find('li .' + className).closest('li').addClass('selected');

		// update files
		//
		this.parent.app.setOption('sort_order', sortOrder);
		this.parent.app.getChildView('contents').onChange();
	}
});