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

	events: {
		'click .sort-by a': 'onClickSortBy',
		'click .sort-order a': 'onClickSortOrder'
	},

	//
	// querying methods
	//

	selected: function() {
		let preferences = this.parent.app.preferences;
		let sortOrder = preferences.get('sort_order');

		// set initial menu state
		//
		return {
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
		this.$el.find('.sort-by').removeClass('selected');
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
		this.$el.find('.sort-order').removeClass('selected');
		this.$el.find('li .' + className).closest('li').addClass('selected');

		// update files
		//
		this.parent.app.setOption('sort_order', sortOrder);
		this.parent.app.getChildView('contents').onChange();
	}
});