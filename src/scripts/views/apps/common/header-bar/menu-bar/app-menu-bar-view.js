/******************************************************************************\
|                                                                              |
|                             app-menu-bar-view.js                             |
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

import MenuBarView from '../../../../../views/apps/common/header-bar/menu-bar/menu-bar-view.js';

export default MenuBarView.extend({

	//
	// rendering methods
	//

	onRender: function() {
		let isSignedIn = application.isSignedIn();

		// call superclass method
		//
		MenuBarView.prototype.onRender.call(this);

		// hide dropdown menus
		//
		if (!isSignedIn) {
			this.$el.find('.share.dropdown').addClass('disabled');
		}
	},

	//
	// updating methods
	//

	updateEnabled: function() {

		// set enabled / disabled
		//
		if (this.enabled != undefined) {
			this.setEnabled(_.result(this, 'enabled'));
		} else if (this.disabled != undefined) {
			this.setDisabled(_.result(this, 'disabled'));
		}
	},

	//
	// event handling methods
	//

	onLoad: function() {
		let menuViews = this.getMenuViews();
		for (let i = 0; i < menuViews.length; i++) {
			let menuView = menuViews[i];
			if (menuView && menuView.onLoad) {
				menuView.onLoad();
			}
		}
	},

	onChange: function() {
		let menuViews = this.getMenuViews();
		for (let i = 0; i < menuViews.length; i++) {
			let menuView = menuViews[i];
			if (menuView && menuView.onChange) {
				menuView.onChange();
			}
		}
	},

	onSave: function() {
		let menuViews = this.getMenuViews();
		for (let i = 0; i < menuViews.length; i++) {
			let menuView = menuViews[i];
			if (menuView && menuView.onSave) {
				menuView.onSave();
			}
		}
	},

	//
	// tab event handling methods
	//

	onChangeTab: function() {
		let menuViews = this.getMenuViews();
		for (let i = 0; i < menuViews.length; i++) {
			let menuView = menuViews[i];
			if (menuView && menuView.onChangeTab) {
				menuView.onChangeTab();
			}
		}
	},

	onCloseTab: function() {
		let menuViews = this.getMenuViews();
		for (let i = 0; i < menuViews.length; i++) {
			let menuView = menuViews[i];
			if (menuView && menuView.onChangeTab) {
				menuView.onCloseTab();
			}
		}
	},

	//
	// selection event handling methods
	//

	onSelect: function(view) {
		let menuViews = this.getMenuViews();
		for (let i = 0; i < menuViews.length; i++) {
			let menuView = menuViews[i];
			if (menuView && menuView.onSelect) {
				menuView.onSelect(view);
			}
		}
	},

	onDeselect: function() {
		let menuViews = this.getMenuViews();
		for (let i = 0; i < menuViews.length; i++) {
			let menuView = menuViews[i];
			if (menuView && menuView.onDeselect) {
				menuView.onDeselect();
			}
		}
	},

	onChangeSelection: function() {
		let menuViews = this.getMenuViews();
		for (let i = 0; i < menuViews.length; i++) {
			let menuView = menuViews[i];
			if (menuView && menuView.onChangeSelection) {
				menuView.onChangeSelection();
			}
		}
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		let menuViews = this.getMenuViews();
		for (let i = 0; i < menuViews.length; i++) {
			let menuView = menuViews[i];
			if (menuView && menuView.onKeyDown) {
				menuView.onKeyDown(event);
			}
		}
	}
});