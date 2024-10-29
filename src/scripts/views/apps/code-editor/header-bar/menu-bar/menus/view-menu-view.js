/******************************************************************************\
|                                                                              |
|                               view-menu-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying view dropdown menus.                    |
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
				<li role="presentation" class="font-size">
					<a class="font-size-18"><i class="fa fa-check"></i>18</a>
				</li>
				<li role="presentation" class="font-size">
					<a class="font-size-20"><i class="fa fa-check"></i>20</a>
				</li>
				<li role="presentation" class="font-size">
					<a class="font-size-24"><i class="fa fa-check"></i>24</a>
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
		
		<li role="presentation">
			<a class="show-gutter"><i class="fa fa-check"></i><i class="fa fa-ellipsis-v"></i>Gutter</a>
		</li>
		
		<li role="presentation">
			<a class="show-indent-guides"><i class="fa fa-check"></i><i class="fa fa-indent"></i>Indent Guides</a>
		</li>
		
		<li role="presentation">
			<a class="show-print-margin"><i class="fa fa-check"></i><i class="fa fa-print"></i>Print Margin</a>
		</li>
		
		<li role="presentation">
			<a class="show-invisibles"><i class="fa fa-check"></i><i class="fa fa-blind"></i>Invisibles</a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="tabify"><i class="fa fa-long-arrow-alt-right"></i>Tabify</a>
		</li>
		
		<li role="presentation">
			<a class="untabify"><i class="fa fa-angle-double-right"></i>Untabify</a>
		</li>
		
		<li role="separator" class="divider"></li>

		<li role="presentation" class="show-toolbars dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-wrench"></i>Toolbars<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="show-toolbar dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation" class="option">
					<a class="show-nav-bar"><i class="fa fa-check"></i><i class="fa fa-sitemap"></i>Nav</a>
				</li>
		
				<li role="presentation" class="option">
					<a class="show-run-bar"><i class="fa fa-check"></i><i class="fa fa-play"></i>Run</a>
				</li>
			</ul>
		</li>

		<li role="presentation" class="hidden-xs dropdown dropdown-submenu">
			<a class="show-sidebar dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-pause"></i>Sidebar<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="show-sidebar-panels dropdown-menu" data-toggle="dropdown">

				<li role="presentation">
					<a class="show-favorites-panel"><i class="fa fa-check"></i><i class="fa fa-star"></i>Favorites</a>
				</li>

				<li role="presentation">
					<a class="show-files-panel"><i class="fa fa-check"></i><i class="fa fa-file"></i>Files</a>
				</li>
			</ul>
		</li>
		
		<li role="presentation" class="sidebar-view-kind dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-th"></i>Sidebar Items<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation" class="sidebar-view-kind">
					<a class="view-sidebar-icons"><i class="fa fa-check"></i><i class="fa fa-th"></i>Icons</a>
				</li>
		
				<li role="presentation" class="sidebar-view-kind">
					<a class="view-sidebar-lists"><i class="fa fa-check"></i><i class="fa fa-list"></i>Lists</a>
				</li>
		
				<li role="presentation" class="sidebar-view-kind">
					<a class="view-sidebar-trees"><i class="fa fa-check"></i><i class="fa fa-tree"></i>Trees</a>
				</li>
		
				<li role="presentation" class="sidebar-view-kind">
					<a class="view-sidebar-cards"><i class="fa fa-check"></i><i class="fa fa-id-card"></i>Cards</a>
				</li>
		
				<li role="presentation" class="sidebar-view-kind">
					<a class="view-sidebar-tiles"><i class="fa fa-check"></i><i class="fa fa-th-large"></i>Tiles</a>
				</li>
			</ul>
		</li>

		<li role="presentation">
			<a class="show-console"><i class="fa fa-check"></i><i class="fa fa-chart-bar"></i>Console</a>
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
		'click .show-gutter': 'onClickOption',
		'click .show-indent-guides': 'onClickOption',
		'click .show-print-margin': 'onClickOption',
		'click .show-invisibles': 'onClickOption',
		'click .tabify': 'onClickTabify',
		'click .untabify': 'onClickUntabify',

		// toolbar options
		//
		'click .show-toolbars > a': 'onClickShowToolbars',
		'click .show-toolbar > li > a': 'onClickShowToolbar',

		// sidebar options
		//
		'click .show-sidebar': 'onClickOption',
		'click .show-sidebar-panels a': 'onClickShowSideBarPanel',
		'click .sidebar-view-kind a': 'onClickSideBarViewKind',
		'click .show-console': 'onClickOption',

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
		'click .view-preferences': 'onClickViewPreferences',
	},

	//
	// querying methods
	//

	disabled: function() {
		return {
			'view-preferences': !application.session.user
		};
	},

	selected: function() {
		let preferences = this.parent.app.preferences;
		let fontSize = preferences.get('font_size');
		let toolbars = preferences.get('toolbars') || [];
		let sidebarPanels = preferences.get('sidebar_panels') || [];
		let sidebarViewKind = preferences.get('sidebar_view_kind');

		return {

			// font options
			//
			'font-size-10': fontSize == 10,
			'font-size-11': fontSize == 11,
			'font-size-12': fontSize == 12,
			'font-size-13': fontSize == 13,
			'font-size-14': fontSize == 14,
			'font-size-15': fontSize == 15,
			'font-size-16': fontSize == 16,
			'font-size-18': fontSize == 18,
			'font-size-20': fontSize == 20,
			'font-size-24': fontSize == 24,

			// editing options
			//
			'show-gutter': preferences.get('show_gutter'),
			'show-indent-guides': preferences.get('show_indent_guides'),
			'show-print-margin': preferences.get('show_print_margin'),
			'show-invisibles': preferences.get('show_invisibles'),

			// toolbar options
			//
			'show-toolbars': toolbars.length > 0,
			'show-nav-bar': toolbars.includes('nav'),
			'show-run-bar': toolbars.includes('run'),

			// sidebar options
			//
			'show-sidebar': preferences.get('show_sidebar'),
			'show-files-panel': sidebarPanels.includes('files'),
			'show-favorites-panel': sidebarPanels.includes('favorites'),
			'show-console': preferences.get('show_console'),

			// sidebar item options
			//
			'view-sidebar-icons': sidebarViewKind == 'icons',
			'view-sidebar-lists': sidebarViewKind == 'lists',
			'view-sidebar-trees': sidebarViewKind == 'trees',
			'view-sidebar-cards': sidebarViewKind == 'cards',
			'view-sidebar-tiles': sidebarViewKind == 'tiles'
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
	},

	onClickTabify: function() {
		this.parent.app.tabify();
		this.setItemSelected('show-invisibles');
		this.parent.app.setOption('show_invisibles', true);
	},

	onClickUntabify: function() {
		this.parent.app.untabify();
		this.setItemSelected('show-invisibles');
		this.parent.app.setOption('show_invisibles', true);
	}
});