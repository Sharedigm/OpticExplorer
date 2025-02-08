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
		'click .detail-kind a': 'onClickDetailKind',

		// toolbar options
		//
		'click .show-toolbars': 'onClickShowToolbars',
		'click .show-toolbar > a': 'onClickShowToolbar',

		// sidebar options
		//
		'click .show-sidebar': 'onClickShowSidebar',
		'click .show-sidebar-panel > a': 'onClickShowSideBarPanel',
		'click .sidebar-view-kind > a': 'onClickSideBarViewKind',
		'click .show-analyser': 'onClickOption',

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

	selected: function() {
		let preferences = this.parent.app.preferences;
		let detailKind = preferences.get('detail_kind');
		let toolbars = preferences.get('toolbars') || [];
		let sidebarPanels = preferences.get('sidebar_panels') || [];
		let sidebarViewKind = preferences.get('sidebar_view_kind');

		return {

			// detail options
			//
			'view-name-only': !detailKind,
			'view-album': detailKind == 'album',
			'view-artist': detailKind == 'artist',
			'view-band': detailKind == 'band',
			'view-composer': detailKind == 'composer',
			'view-genre': detailKind == 'genre',
			'view-length': detailKind == 'length',
			'view-publisher': detailKind == 'publisher',
			'view-track-number': detailKind == 'track_number',
			'view-year': detailKind == 'year',

			// toolbar options
			//
			'show-toolbars': toolbars.length > 0,
			'show-play-bar': toolbars.includes('play'),
			'show-volume-bar': toolbars.includes('volume'),
			'show-track-bar': toolbars.includes('track'),

			// sidebar options
			//
			'show-sidebar': preferences.get('show_sidebar'),
			'show-favorites-panel': sidebarPanels.includes('favorites'),
			'show-track-info-panel': sidebarPanels.includes('track_info'),
			'show-files-panel': sidebarPanels.includes('files'),
			'show-analyser': preferences.get('show_analyser'),

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
	// setting methods
	//

	setDetailKind: function(detailKind) {

		// update menu
		//
		this.$el.find('li[type=detail-kind].selected').removeClass('selected');
		this.$el.find('.view-' + detailKind).closest('li').addClass('selected');
	},

	//
	// event handling methods
	//
	
	onChange: function() {
		if (this.parent.app.model) {
			this.setDisabled(false);
		}
	},

	//
	// mouse event handling methods
	//

	onClickVolumeUp: function() {
		this.parent.app.volumeUp();
	},

	onClickVolumeDown: function() {
		this.parent.app.volumeDown();
	},

	onClickTrackInfo: function() {
		this.toggleMenuItem('show-track-info');
		this.parent.app.setOption('show_track_info', this.isItemSelected('show-track-info'));
	}
});