/******************************************************************************\
|                                                                              |
|                             context-menu-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a generic (abstract class) menu view.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MenuView from '../../../../views/apps/common/header-bar/menu-bar/menus/menu-view.js';
import Browser from '../../../../utilities/web/browser.js';

export default MenuView.extend({

	events: {

		// mouse events
		//
		'mouseenter .dropdown-toggle': 'onMouseEnterDropdown',
		'mouseleave .dropdown.open': 'onMouseLeaveDropdown',

		// touch events
		//
		'tap .dropdown-toggle': 'onTapDropdown'
	},

	//
	// getting methods
	//

	getMenuOrientation: function() {
		let menuWidth = this.$el.width();
		let originLeft = this.$el.position().left;
		let containerWidth = $(window).width();
		return originLeft + menuWidth > containerWidth? 'left' : 'right';
	},

	//
	// setting methods
	//

	setMenuOrientation: function(orientation) {
		let menuWidth = this.$el.width();
		let originLeft = this.$el.position().left;
		let originRight = originLeft + menuWidth;
		let menuLeft = orientation == 'right'? originLeft : originRight - menuWidth;
		let menuRight = menuLeft + menuWidth;
		let containerWidth = this.$el.closest('.app').width();

		// set orientation of menu
		//
		switch (orientation) {
			case 'left':
				this.$el.addClass('left');
				break;
			case 'right':
				this.$el.removeClass('left');
				break;
		}

		// set menu offset
		//
		if (menuLeft < 0) {
			this.$el.css('margin-left', -menuLeft);
			menuLeft = 0;
			menuRight = menuWidth;
		} else {
			this.$el.css('margin-left', '');
		}

		// set orientation of submenus
		//
		this.setSubmenuOrientation(this.$el, menuLeft, menuRight, containerWidth);
	},

	//
	// rendering methods
	//

	getItems: function() {
		if (this.items) {

			// get menu items from menu
			//
			return this.items;
		} else {
			let appView = this.getParentView('app');

			// get menu items from resources
			//
			let resources = appView.getResources('context_menu');

			if (resources) {
				return resources.items;
			} else {
				return [];
			}
		}
	},

	openDropdown: function(dropdown) {
		if (!dropdown.hasClass('disabled')) {
			dropdown.addClass('open');
			dropdown.find('.dropdown-menu').trigger('open');
		}
	},

	closeDropdown: function(dropdown) {
		dropdown.removeClass('open');
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// call superclass method
		//
		MenuView.prototype.onLoad.call(this);

		// remove hidden items
		//
		this.$el.find('> li.hidden').remove();

		// remove trailing dividers
		//
		this.$el.find('> li.divider:last-child').remove();

		// remove duplicate dividers
		//
		this.$el.find('> li.divider + li.divider').remove();

		// remove trailing dividers
		//
		this.$el.find('> li.divider:last-child').remove();
	},

	onOpen: function() {

		// do nothing
		//
	},

	//
	// mouse event handling methods
	//

	onMouseEnterDropdown: function(event) {

		// skip mouse events if touch enabled
		//
		if (Browser.is_touch_enabled) {
			return;
		}

		this.openDropdown($(event.target).closest('.dropdown'));
	},

	onMouseLeaveDropdown: function(event) {

		// skip mouse events if touch enabled
		//
		if (Browser.is_touch_enabled) {
			return;
		}

		this.closeDropdown($(event.target).closest('.dropdown.open'));
	},
});