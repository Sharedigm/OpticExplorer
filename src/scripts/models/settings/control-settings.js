/******************************************************************************\
|                                                                              |
|                              control-settings.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a set of a user's controls settings.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserSettings from '../../models/settings/user-settings.js';
import SplitView from '../../views/layout/split-view.js';
import Browser from '../../utilities/web/browser.js';

export default UserSettings.extend({

	//
	// attributes
	//

	category: Browser.device != 'desktop'? Browser.device + '_' + 'controls' : 'controls',
	defaults: UserSettings.toKeyValuePairs(config.theme.controls, Browser.device),

	//
	// constructor
	//

	initialize: function() {

		// listen for changes
		//
		this.on('change', this.onChange);
	},

	//
	// setting methods
	//

	apply: function() {

		// apply menu styles
		//
		this.applyItemMaterial(this.get('menu_material'), 'menus');
		this.applyMenubarWidth(this.get('menubar_width'));
		this.applyItemCorners(this.get('menu_corners'), 'menus');
		this.applyItemIcons(this.get('menu_icons'), 'menu');
		this.applyMenusAttached(this.get('menus_attached'));
		this.applyItemMargins(this.get('menu_margins'), 'menu');

		// apply button styles
		//
		this.applyItemMaterial(this.get('button_material'), 'buttons');
		this.applyItemCorners(this.get('button_corners'), 'buttons');
		this.applyItemIcons(this.get('button_icons'), 'button');

		// apply tab styles
		//
		this.applyItemMaterial(this.get('tab_material'), 'tabs');
		this.applyItemCorners(this.get('tab_corners'), 'tabs');
		this.applyItemAlignment(this.get('tab_alignment'), 'tabs');
		this.applyTabsMinimal(this.get('tabs_minimal'));
		this.applyTabsExpandable(this.get('tabs_expandable'));
		this.applyTabsAttached(this.get('tabs_attached'));
		this.applyItemMargins(this.get('tab_margins'), 'tab');
		this.applyItemIcons(this.get('tab_icons'), 'tab');
		this.applyItemCloseButtons(this.get('tab_close_buttons'), 'tab');

		// apply slider styles
		//
		this.applyItemMaterial(this.get('slider_material'), 'sliders');
		this.applyItemCorners(this.get('slider_corners'), 'sliders');
		this.applySliderHandleWidth(this.get('slider_handle_width'));

		// apply splitter styles
		//
		this.applySplitterWidth(this.get('splitter_width'));
		this.applySplitterHandles(this.get('splitter_handles'));
		this.applySplitterHandleWidth(this.get('splitter_handle_width'));

		// apply scrollbar styles
		//
		this.applyItemMaterial(this.get('scrollbar_material'), 'scrollbars');
		this.applyScrollbarWidth(this.get('scrollbar_width'));
		this.applyItemCorners(this.get('scrollbar_corners'), 'scrollbars');
	},

	reset: function() {
		this.set(this.defaults);
	},

	//
	// material setting methods
	//

	applyItemMaterial: function(material, item) {
		switch (material || 'auto') {
			case 'none':
			case 'flat':
				$('body').addClass('flat-' + item);
				$('body').removeClass('chalk-' + item);
				$('body').removeClass('plastic-' + item);
				$('body').removeClass('glass-' + item);
				$('body').removeClass('metal-' + item);
				$('body').removeClass('auto-' + item);
				break;
			case 'chalk':
				$('body').removeClass('flat-' + item);
				$('body').addClass('chalk-' + item);
				$('body').removeClass('plastic-' + item);
				$('body').removeClass('glass-' + item);
				$('body').removeClass('metal-' + item);
				$('body').removeClass('auto-' + item);
				break;
			case 'plastic':
				$('body').removeClass('flat-' + item);
				$('body').removeClass('chalk-' + item);
				$('body').addClass('plastic-' + item);
				$('body').removeClass('glass-' + item);
				$('body').removeClass('metal-' + item);
				$('body').removeClass('auto-' + item);
				break;
			case 'glass':
				$('body').removeClass('flat-' + item);
				$('body').removeClass('chalk-' + item);
				$('body').removeClass('plastic-' + item);
				$('body').addClass('glass-' + item);
				$('body').removeClass('metal-' + item);
				$('body').removeClass('auto-' + item);
				break;
			case 'metal':
				$('body').removeClass('flat-' + item);
				$('body').removeClass('chalk-' + item);
				$('body').removeClass('plastic-' + item);
				$('body').removeClass('glass-' + item);
				$('body').addClass('metal-' + item);
				$('body').removeClass('auto-' + item);
				break;
			case 'auto':
				$('body').removeClass('flat-' + item);
				$('body').removeClass('chalk-' + item);
				$('body').removeClass('plastic-' + item);
				$('body').removeClass('glass-' + item);
				$('body').removeClass('metal-' + item);
				$('body').addClass('auto-' + item);
		}
	},

	//
	// appearance setting methods
	//

	applyItemCorners: function(corners, items) {
		switch (corners || 'auto') {
			case 'round':
				$('body').addClass('round-' + items);
				$('body').removeClass('rounded-' + items);
				$('body').removeClass('square-' + items);
				$('body').removeClass('auto-corner-' + items);
				break;
			case 'rounded':
				$('body').removeClass('round-' + items);
				$('body').addClass('rounded-' + items);
				$('body').removeClass('square-' + items);
				$('body').removeClass('auto-corner-' + items);
				break;
			case 'square':
				$('body').removeClass('round-' + items);
				$('body').removeClass('rounded-' + items);
				$('body').addClass('square-' + items);
				$('body').removeClass('auto-corner-' + items);
				break;
			case 'auto':
				$('body').removeClass('round-' + items);
				$('body').removeClass('rounded-' + items);
				$('body').removeClass('square-' + items);
				$('body').addClass('auto-corner-' + items);
		}
	},

	applyItemAlignment: function(value, items) {
		switch (value || 'left') {
			case 'left':
				$('body').addClass('left-' + items);
				$('body').removeClass('center-' + items);
				$('body').removeClass('right-' + items);
				break;
			case 'center':
				$('body').removeClass('left-' + items);
				$('body').addClass('center-' + items);
				$('body').removeClass('right-' + items);
				break;
			case 'right':
				$('body').removeClass('left-' + items);
				$('body').removeClass('center-' + items);
				$('body').addClass('right-' + items);
				break;
		}
	},

	applyItemMargins: function(value, items) {
		if (value) {
			$('body').addClass(items + '-margins');
		} else {
			$('body').removeClass(items + '-margins');	
		}
	},

	//
	// menu setting methods
	//

	applyMenubarWidth: function(menubarWidth) {
		switch (menubarWidth || 'medium') {
			case 'thin':
				$('body').addClass('thin-menu-bars');
				break;
			case 'medium':
				$('body').removeClass('thin-menu-bars');
				break;
		}
	},

	applyMenuCorners: function(menuCorners) {
		switch (menuCorners || 'round') {
			case 'round':
				$('body').addClass('round-menus');
				$('body').removeClass('rounded-menus');
				$('body').removeClass('square-menus');
				break;
			case 'rounded':
				$('body').removeClass('round-menus');
				$('body').addClass('rounded-menus');
				$('body').removeClass('square-menus');
				break;
			case 'square':
				$('body').removeClass('round-menus');
				$('body').removeClass('rounded-menus');
				$('body').addClass('square-menus');	
				break;
		}
	},

	applyMenusAttached: function(menuAttached) {
		if (menuAttached) {
			$('body').addClass('menus-attached');
		} else {
			$('body').removeClass('menus-attached');
		}
	},

	//
	// button setting methods
	//

	applyButtonCorners: function(buttonCorners) {
		switch (buttonCorners || 'round') {
			case 'round':
				$('body').addClass('round-buttons');
				$('body').removeClass('rounded-buttons');
				$('body').removeClass('square-buttons');
				break;
			case 'rounded':
				$('body').removeClass('round-buttons');
				$('body').addClass('rounded-buttons');
				$('body').removeClass('square-buttons');
				break;
			case 'square':
				$('body').removeClass('round-buttons');
				$('body').removeClass('rounded-buttons');
				$('body').addClass('square-buttons');	
				break;
		}
	},

	//
	// tab setting methods
	//

	applyTabsMinimal: function(tabsMinimal) {
		if (tabsMinimal) {
			$('body').addClass('tabs-minimal');
		} else {
			$('body').removeClass('tabs-minimal');
		}
	},

	applyTabsExpandable: function(tabsExpandable) {
		if (tabsExpandable) {
			$('body').addClass('tabs-expandable');
		} else {
			$('body').removeClass('tabs-expandable');
		}
	},

	applyTabsAttached: function(tabsAttached) {
		if (tabsAttached) {
			$('body').addClass('tabs-attached');
		} else {
			$('body').removeClass('tabs-attached');
		}
	},

	//
	// slider setting methods
	//

	applySliderHandleWidth: function(sliderHandleWidth) {
		switch (sliderHandleWidth || 'medium') {
			case 'narrow':
				$('body').addClass('narrow-slider-handles');
				$('body').removeClass('wide-slider-handles');
				break;
			case 'medium':
				$('body').removeClass('narrow-slider-handles');
				$('body').removeClass('wide-slider-handles');
				break;
			case 'wide':
				$('body').removeClass('narrow-slider-handles');
				$('body').addClass('wide-slider-handles');	
				break;
		}
	},

	//
	// splitter setting methods
	//

	applySplitterWidth: function(splitterWidth) {
		switch (splitterWidth || 'medium') {
			case 'none':
				$('body').addClass('no-splitters');
				$('body').removeClass('narrow-splitters');
				$('body').removeClass('wide-splitters');
				SplitView.setGutterSize(2);
				break;
			case 'narrow':
				$('body').removeClass('no-splitters');
				$('body').addClass('narrow-splitters');
				$('body').removeClass('wide-splitters');
				SplitView.setGutterSize(5);
				break;
			case 'medium':
				$('body').removeClass('no-splitters');
				$('body').removeClass('narrow-splitters');
				$('body').removeClass('wide-splitters');
				SplitView.setGutterSize(10);
				break;
			case 'wide':
				$('body').removeClass('no-splitters');
				$('body').removeClass('narrow-splitters');
				$('body').addClass('wide-splitters');
				SplitView.setGutterSize(15);
				break;
		}
	},

	applySplitterHandles: function(splitterHandles) {
		if (splitterHandles) {
			$('body').removeClass('hide-splitter-handles');
		} else {
			$('body').addClass('hide-splitter-handles');
		}
	},

	applySplitterHandleWidth: function(splitterHandleWidth) {
		switch (splitterHandleWidth || 'medium') {
			case 'narrow':
				$('body').addClass('narrow-splitter-handles');
				$('body').removeClass('wide-splitter-handles');
				break;
			case 'medium':
				$('body').removeClass('narrow-splitter-handles');
				$('body').removeClass('wide-splitter-handles');
				break;
			case 'wide':
				$('body').removeClass('narrow-splitter-handles');
				$('body').addClass('wide-splitter-handles');
				break;
		}
	},

	//
	// scrollbar setting methods
	//

	applyScrollbarWidth: function(scrollbarWidth) {
		switch (scrollbarWidth || 'medium') {
			case 'thin':
				$('body').addClass('thin-scrollbars');
				$('body').removeClass('thick-scrollbars');
				break;
			case 'medium':
				$('body').removeClass('thin-scrollbars');
				$('body').removeClass('thick-scrollbars');
				break;
			case 'thick':
				$('body').removeClass('thin-scrollbars');
				$('body').addClass('thick-scrollbars');	
				break;
		}
	},

	applyScrollbarCorners: function(scrollbarCorners) {
		switch (scrollbarCorners || 'round') {
			case 'round':
				$('body').addClass('round-scrollbars');
				$('body').removeClass('rounded-scrollbars');
				$('body').removeClass('square-scrollbars');
				break;
			case 'rounded':
				$('body').removeClass('round-scrollbars');
				$('body').addClass('rounded-scrollbars');
				$('body').removeClass('square-scrollbars');
				break;
			case 'square':
				$('body').removeClass('round-scrollbars');
				$('body').removeClass('rounded-scrollbars');
				$('body').addClass('square-scrollbars');	
				break;
		}
	},

	//
	// icon appearance setting methods
	//

	applyItemIcons: function(value, items) {
		if (value) {
			$('body').removeClass('hide-' + items + '-icons');
		} else {
			$('body').addClass('hide-' + items + '-icons');
		}
	},

	applyItemCloseButtons: function(value, items) {
		if (value) {
			$('body').addClass('show-' + items + '-close-buttons');
		} else {
			$('body').removeClass('show-' + items + '-close-buttons');
		}
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.apply();
	}
});