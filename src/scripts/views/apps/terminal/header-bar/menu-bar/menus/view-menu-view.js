/******************************************************************************\
|                                                                              |
|                               view-menu-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying file dropdown menus.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ViewMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/view-menu-view.js';

export default ViewMenuView.extend({

	//
	// attributes
	//

	events: {

		// view options
		//
		'click .font-size': 'onClickFontSize',
		'click .decrease-font-size': 'onClickDecreaseFontSize',
		'click .increase-font-size': 'onClickIncreaseFontSize',

		// window options
		//
		'click .shrink-window': 'onClickShrinkWindow',
		'click .grow-window': 'onClickGrowWindow',
		'click .expand-window': 'onClickExpandWindow',

		// desktop options
		//
		'click .prev-space': 'onClickPrevSpace',
		'click .next-space': 'onClickNextSpace',
		'click .minimize-all': 'onClickMinimizeAll',
		'click .unminimize-all': 'onClickUnminimizeAll',
		'click .view-full-screen': 'onClickViewFullScreen',

		// preferences options
		//
		'click .view-preferences': 'onClickViewPreferences'
	},

	selected: function() {
		let preferences = this.parent.app.preferences;
		let fontSize = preferences.get('font_size');

		return {

			// font options
			//
			'font-size-10': fontSize == 10,
			'font-size-11': fontSize == 11,
			'font-size-12': fontSize == 12,
			'font-size-13': fontSize == 13,
			'font-size-14': fontSize == 14,
			'font-size-15': fontSize == 15,
			'font-size-16': fontSize == 16
		};
	},

	//
	// mouse event handling methods
	//

	onClickFontSize: function(event) {
		let className = $(event.target).closest('a').attr('class')
			.replace('dropdown-toggle', '').trim();
		let fontSize = parseInt(className.replace('font-size-', ''));
		this.$el.find('.font-size').removeClass('selected');
		this.setItemSelected('font-size-' + fontSize, true);
		this.parent.app.setOption('font_size', fontSize);
	},

	onClickDecreaseFontSize: function() {
		let items = this.$el.find('.font-size');
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			if ($(item).hasClass('selected')) {
				if (i > 0) {
					let prevItem = items[i - 1];
					let className = $(prevItem).find('a').attr('class');
					let fontSize = parseInt(className.replace('font-size-', ''));
					$(item).removeClass('selected');
					this.setItemSelected('font-size-' + fontSize, true);
					this.parent.app.setOption('font_size', fontSize);
					return;
				}
			}
		}
	},

	onClickIncreaseFontSize: function() {
		let items = this.$el.find('.font-size');
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			if ($(item).hasClass('selected')) {
				if (i < items.length - 1) {
					let prevItem = items[i + 1];
					let className = $(prevItem).find('a').attr('class');
					let fontSize = parseInt(className.replace('font-size-', ''));
					$(item).removeClass('selected');
					this.setItemSelected('font-size-' + fontSize, true);
					this.parent.app.setOption('font_size', fontSize);
					return;
				}
			}
		}
	}
});