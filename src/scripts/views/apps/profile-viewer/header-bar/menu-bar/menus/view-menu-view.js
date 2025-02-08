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

	events: {

		// view options
		//
		'click li[type="detail-kind"]': 'onClickDetailKind',

		// sidebar options
		//
		'click .show-sidebar': 'onClickShowSidebar',
		'click .show-sidebar-panel > a': 'onClickShowSideBarPanel',
		'click .sidebar-view-kind > a': 'onClickSideBarViewKind',

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

	//
	// querying methods
	//

	visible: function() {
		let hasMapViewer = config.apps.map_viewer != undefined && config.apps.map_viewer.hidden != true;

		return {
			'show-actions-panel': hasMapViewer
		};
	},

	enabled: function() {
		let isCurrent = this.parent.app.model.isCurrent();

		return {
			'show-mutual-connections-panel': !isCurrent
		};
	},

	selected: function() {
		let preferences = this.parent.parent.app.preferences;
		let detailKind = preferences.get('detail_kind');
		let sidebarPanels = preferences.get('sidebar_panels') || [];
		let sidebarViewKind = preferences.get('sidebar_view_kind');

		return {

			// detail options
			//
			'view-profile': detailKind == 'profile',
			'view-posts': detailKind == 'posts',
			'view-connections': detailKind == 'connections',
			'view-sharing': detailKind == 'sharing',

			// sidebar options
			//
			'show-sidebar': preferences.get('show_sidebar'),
			'show-activity-panel': sidebarPanels.includes('activity'),
			'show-status-panel': sidebarPanels.includes('status'),
			'show-actions-panel': sidebarPanels.includes('actions'),
			'show-mutual-connections-panel': sidebarPanels.includes('mutual_connections'),

			// sidebar item options
			//
			'view-sidebar-icons': sidebarViewKind == 'icons',
			'view-sidebar-lists': sidebarViewKind == 'lists',
			'view-sidebar-cards': sidebarViewKind == 'cards',
			'view-sidebar-tiles': sidebarViewKind == 'tiles'
		};
	}
});