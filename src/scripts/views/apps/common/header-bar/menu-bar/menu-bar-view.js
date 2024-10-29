/******************************************************************************\
|                                                                              |
|                               menu-bar-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing an app's menu bar.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';
import Browser from '../../../../../utilities/web/browser.js';
import '../../../../../../vendor/bootstrap/js/dropdown.js';

export default BaseView.extend({

	//
	// attributes
	//

	tagName: 'ul',
	className: 'nav nav-menus',

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
	// querying methods
	//

	hasMenu: function(name) {
		return this.hasChildView(name);
	},

	//
	// getting methods
	//

	getMenu: function(name) {
		if (this.hasChildView(name)) {
			return this.getChildView(name).$el.parent();
		}
	},

	getMenuNames: function() {
		return Object.keys(this.regions);
	},

	getMenus: function() {
		let menus = [];
		let names = this.getMenuNames();
		for (let i = 0; i < names.length; i++) {
			menus.push(this.getChildView(names[i]));
		}
		return menus;
	},

	//
	// setting methods
	//

	setEnabled: function (enabled) {
		switch (typeof enabled) {

			case 'boolean': {

				// set items to value
				//
				let names = this.getMenuNames();
				for (let i = 0; i < names.length; i++) {
					let name = names[i];
					if (this.hasMenu(name)) {
						this.setMenuEnabled(name, enabled);
					}
				}
				break;
			}

			case 'object': {

				// set items to values
				//
				for (let name in enabled) {
					if (this.hasMenu(name)) {
						this.setMenuEnabled(name, enabled[name]);
					}
				}
				break;
			}
		}
	},

	setDisabled: function(disabled) {
		switch (typeof disabled) {

			case 'boolean': {

				// set items to value
				//
				let names = this.getMenuNames();
				for (let i = 0; i < names.length; i++) {
					this.setMenuDisabled(names[i], disabled);
				}
				break;
			}

			case 'object': {

				// set items to values
				//
				for (let name in disabled) {
					this.setMenuDisabled(name, disabled[name]);
				}
				break;
			}
		}
	},

	//
	// menu setting methods
	//

	setMenuVisible: function(name, visible) {
		if (visible || visible == undefined) {
			this.getMenu(name).css('display', '');
		} else {
			this.getMenu(name).css('display', 'none');
		}
	},

	setMenuHidden: function(name, hidden) {
		if (hidden || hidden == undefined) {
			this.getMenu(name).css('display', 'none');
		} else {
			this.getMenu(name).css('display', '');
		}
	},

	setMenuEnabled: function(name, enabled) {
		if (enabled || enabled == undefined) {
			this.getMenu(name).removeClass('disabled');
		} else {
			this.getMenu(name).addClass('disabled');
		}
	},

	setMenuDisabled: function(name, disabled) {
		if (disabled || disabled == undefined) {
			this.getMenu(name).addClass('disabled');
		} else {
			this.getMenu(name).removeClass('disabled');
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// create menu regions from template dropdowns
		//
		this.addMenuRegions();

		// set attributes
		//
		this.app = this.getParentView('app');
	},

	addMenuRegions: function() {
		let dropdowns = this.$el.find('.dropdown');

		// create menu regions from dropdowns
		//
		if (dropdowns.length > 0) {
			for (let i = 0; i < dropdowns.length; i++) {
				let dropdown = $(dropdowns[i]);
				let name = dropdown.attr('class').replace('dropdown', '').trim();
				this.addRegion(name, {
					el: dropdown.find('.dropdown-menu'),
					replaceElement: true
				});
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

	update: function() {
		let keys = Object.keys(this.regions);
		for (let i = 0; i < keys.length; i++) {
			this.getChildView(keys[i]).update();
		}
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

	//
	// touch event handling methods
	//

	onTapDropdown: function(event) {

		// skip touch events if not touch enabled
		//
		if (!Browser.is_touch_enabled) {
			return;
		}

		// play tap sound
		//
		application.play('tap');
		
		let dropdown = $(event.target).closest('.dropdown');
		if (!dropdown.hasClass('open')) {
			$(event.target).closest('ul').find('.open').removeClass('open');
			this.openDropdown(dropdown);
		} else {
			this.closeDropdown(dropdown);
		}
		
		// block event from parent
		//
		this.block(event);
	}

	/*
	onTapDropdown: function(event) {

		// skip touch events if not touch enabled
		//
		if (!Browser.is_touch_enabled) {
			return;
		}

		// play tap sound
		//
		application.play('tap');
		
		// handle tap event
		//
		this.onMouseDown(event);
	}
	*/
});