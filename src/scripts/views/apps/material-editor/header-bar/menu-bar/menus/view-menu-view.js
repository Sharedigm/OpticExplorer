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
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ViewMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/view-menu-view.js';

export default ViewMenuView.extend({

	//
	// attributes
	//

	template: template(`
		<li role="presentation">
			<a class="data-sheet view-kind"><i class="fa fa-check"></i><i class="fa fa-table"></i>Data Sheet</a>
		</li>

		<li role="presentation">
			<a class="refraction view-kind"><i class="fa fa-check"></i><i class="fa fa-arrow-trend-down"></i>Refraction</a>
		</li>

		<li role="presentation">
			<a class="reflection view-kind"><i class="fa fa-check"></i><i class="fa fa-right-left"></i>Reflection</a>
		</li>

		<li role="presentation">
			<a class="transmission view-kind"><i class="fa fa-check"></i><i class="fa fa-arrows-up-to-line rotated"></i>Transmission</a>
		</li>

		<li role="separator" class="divider"></li>

		<li role="presentation" class="show-toolbars dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-wrench"></i>Toolbars<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="show-toolbar dropdown-menu" data-toggle="dropdown">

				<li role="presentation" class="option">
					<a class="show-nav-bar"><i class="fa fa-check"></i><i class="fa fa-sitemap"></i>Nav</a>
				</li>

				<li role="presentation" class="option">
					<a class="show-view-bar"><i class="fa fa-check"></i><i class="fa fa-eye"></i>View</a>
				</li>
			</ul>
		</li>

		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="show-sidebar dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-pause"></i>Sidebar<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="show-sidebar-panels dropdown-menu" data-toggle="dropdown">
				<li role="presentation">
					<a class="show-materials-panel"><i class="fa fa-check"></i><i class="fa fa-gem"></i>Materials</a>
				</li>
		
				<li role="presentation">
					<a class="show-shared-panel"><i class="fa fa-check"></i><i class="fa fa-book"></i>Materials Library</a>
				</li>			
			</ul>
		</li>

		<li role="presentation" class="sidebar-view-kind dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-th"></i>Sidebar Items<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="show-sidebar-items dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation">
					<a class="show-sidebar-icons"><i class="fa fa-check"></i><i class="fa fa-th"></i>Icons</a>
				</li>
				
				<li role="presentation">
					<a class="show-sidebar-lists"><i class="fa fa-check"></i><i class="fa fa-list"></i>Lists</a>
				</li>

				<li role="presentation">
					<a class="show-sidebar-trees"><i class="fa fa-check"></i><i class="fa fa-tree"></i>Trees</a>
				</li>

				<li role="presentation">
					<a class="show-sidebar-cards"><i class="fa fa-check"></i><i class="fa fa-id-card"></i>Cards</a>
				</li>
				
				<li role="presentation">
					<a class="show-sidebar-tiles"><i class="fa fa-check"></i><i class="fa fa-th-large"></i>Tiles</a>
				</li>
			</ul>
		</li>

		<li role="presentation">
			<a class="show-data-editor"><i class="fa fa-check"></i><i class="fa fa-table"></i>Data Editor<span class="command shortcut">D</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
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

		// mode options
		//
		'click .view-kind': 'onClickViewKind',

		// toolbar options
		//
		'click .show-toolbars > a': 'onClickShowToolbars',
		'click .show-toolbar > li > a': 'onClickShowToolbar',

		// sidebar options
		//
		'click .show-sidebar': 'onClickOption',
		'click .show-sidebar-panels a': 'onClickShowSideBarPanel',
		'click .show-sidebar-items a': 'onClickSideBarViewKind',
		'click .show-data-editor': 'onClickShowDataEditor',

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

	selected: function() {
		let preferences = this.parent.app.preferences;
		let viewKind = preferences.get('view_kind');
		let toolbars = preferences.get('toolbars') || [];
		let sidebarPanels = preferences.get('sidebar_panels') || [];
		let sidebarViewKind = preferences.get('sidebar_view_kind');

		return {

			// mode
			//
			'data-sheet': viewKind == 'data_sheet',
			'refraction': viewKind == 'refraction',
			'reflection': viewKind == 'reflection',
			'transmission': viewKind == 'transmission',

			// toolbar options
			//
			'show-toolbars': toolbars.length > 0,
			'show-nav-bar': toolbars.includes('nav'),
			'show-view-bar': toolbars.includes('view'),

			// sidebar options
			//
			'show-sidebar': preferences.get('show_sidebar'),
			'show-materials-panel': sidebarPanels.includes('materials'),
			'show-shared-panel': sidebarPanels.includes('shared'),
			'show-sidebar-icons': sidebarViewKind == 'icons',
			'show-sidebar-lists': sidebarViewKind == 'lists',
			'show-sidebar-trees': sidebarViewKind == 'trees',
			'show-sidebar-cards': sidebarViewKind == 'cards',
			'show-sidebar-tiles': sidebarViewKind == 'tiles',
			'show-data-editor': preferences.get('show_data_editor')
		}
	},

	enabled: function() {
		let material = this.parent.app.getActiveMaterial();
		let isEditable = true;
		let isRefractive = isEditable || material && material.isRefractive();
		let isReflective = isEditable || material && material.isReflective();
		let isTransmissive = isEditable || material && material.isTransmissive();

		return {
			'data-sheet': true,
			'refraction': isRefractive == true,
			'reflection': isReflective == true,
			'transmission': isTransmissive == true
		};
	},

	//
	// setting methods
	//

	setViewKind: function(viewKind) {
		this.setItemsDeselected(['data-sheet', 'refraction', 'reflection', 'transmission']);
		this.toggleMenuItem(viewKind);
	},

	//
	// mouse event handling methods
	//

	onClickShowDataEditor: function() {
		this.toggleMenuItem('show-data-editor');
		this.parent.app.setOption('show_data_editor', this.isItemSelected('show-data-editor'));
	}
});