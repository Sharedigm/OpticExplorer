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

	template: template(`
		<li role="presentation" class="font-sizes dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-font"></i>Font Size<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="dropdown-menu" data-toggle="dropdown">

				<li role="presentation" class="font-size">
					<a class="font-size-10"><i class="fa fa-check"></i>10</a>
				</li>
				<li role="presentation" class="font-size">
					<a class="font-size-11"><i class="fa fa-check"></i>11</a>
				</li>
				<li role="presentation" class="font-size">
					<a class="font-size-12"><i class="fa fa-check"></i>12</a>
				</li>
				<li role="presentation" class="font-size">
					<a class="font-size-13"><i class="fa fa-check"></i>13</a>
				</li>
				<li role="presentation" class="font-size">
					<a class="font-size-14"><i class="fa fa-check"></i>14</a>
				</li>
				<li role="presentation" class="font-size">
					<a class="font-size-15"><i class="fa fa-check"></i>15</a>
				</li>
				<li role="presentation" class="font-size">
					<a class="font-size-16"><i class="fa fa-check"></i>16</a>
				</li>

				<li role="separator" class="divider"></li>

				<li role="presentation">
					<a class="decrease-font-size"><i class="fa fa-minus"></i>Decrease<span class="shift command shortcut">-</span></a>
				</li>

				<li role="presentation">
					<a class="increase-font-size"><i class="fa fa-plus"></i>Increase<span class="shift command shortcut">=</span></a>
				</li>
			</ul>
		</li>

		<li role="separator" class="divider"></li>

		<li role="presentation" class="mobile-only">
			<a class="expand-window"><i class="fa fa-expand"></i>Expand</a>
		</li>
		
		<li role="presentation" class="windowed-app-only window-size dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="far fa-window-maximize"></i>Window Size<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
			
				<li role="presentation">
					<a class="shrink-window"><i class="fa fa-minus"></i>Shrink<span class="command shortcut">[</span></a>
				</li>
		
				<li role="presentation">
					<a class="grow-window"><i class="fa fa-plus"></i>Grow<span class="command shortcut">]</span></a>
				</li>
		
				<li role="presentation">
					<a class="expand-window"><i class="fa fa-expand"></i>Expand<span class="command shortcut">\\</span></a>
				</li>
			</ul>
		</li>
		
		<li role="presentation" class="desktop-app-only spaces dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="far fa-window-maximize"></i>Spaces<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="dropdown-menu" data-toggle="dropdown">

				<li role="presentation">
					<a class="prev-space"><i class="fa fa-chevron-left"></i>Prev<span class="command shortcut">left arrow</span></a>
				</li>

				<li role="presentation">
					<a class="next-space"><i class="fa fa-chevron-right"></i>Next<span class="command shortcut">right arrow</span></a>
				</li>
			</ul>
		</li>

		<li role="presentation" class="desktop-app-only windows dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="far fa-window-restore"></i>Windows<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="dropdown-menu" data-toggle="dropdown">

				<li role="presentation">
					<a class="minimize-all"><i class="fa fa-window-minimize"></i>Minimize All</a>
				</li>

				<li role="presentation">
					<a class="unminimize-all"><i class="fa fa-window-restore"></i>Unminimize All</a>
				</li>
			</ul>
		</li>
		
		<li role="presentation" class="desktop-app-only">
			<a class="view-full-screen"><i class="fa fa-check full-screen-visible"></i><i class="fa fa-desktop"></i>Full Screen<span class="command shortcut">\\</span></a>
		</li>
		
		<% if (application.session.user) { %>
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="view-preferences"><i class="fa fa-snowflake"></i>Preferences</a>
		</li>
		<% } %>
	`),

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