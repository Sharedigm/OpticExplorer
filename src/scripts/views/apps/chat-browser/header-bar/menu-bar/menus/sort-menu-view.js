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
			<a class="sort-by-members"><i class="fa fa-check"></i><i class="fa fa-users"></i>By Members</a>
		</li>
		
		<li role="presentation" type="sort-by">
			<a class="sort-by-messages"><i class="fa fa-check"></i><i class="fa fa-comments"></i>By Messages</a>
		</li>
		
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="sort-by-date dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-calendar-alt"></i>By Date<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
				<li role="presentation" type="sort-by">
					<a class="sort-by-create-date"><i class="fa fa-check"></i><i class="fa fa-magic"></i>Create Date</a>
				</li>
		
				<li role="presentation" type="sort-by">
					<a class="sort-by-modify-date"><i class="fa fa-check"></i><i class="fa fa-edit"></i>Modify Date</a>
				</li>
			</ul>
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
		let sortKind = preferences.get('sort_kind') || 'name';
		let sortOrder = preferences.get('sort_order') || 'increasing';

		// set initial menu state
		//
		return {
			'sort-by-name': sortKind == 'name',
			'sort-by-members': sortKind == 'members',
			'sort-by-create-date': sortKind == 'create_date',
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