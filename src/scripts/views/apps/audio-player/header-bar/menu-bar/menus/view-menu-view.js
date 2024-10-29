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
		<li role="presentation" type="detail-kind">
			<a class="view-name-only"><i class="fa fa-check"></i><i class="fa fa-font"></i>Name Only</a>
		</li>

		<li role="presentation" type="detail-kind">
			<a class="view-album"><i class="fa fa-check"></i><i class="fa fa-folder"></i>Album</a>
		</li>
		
		<li role="presentation" type="detail-kind">
			<a class="view-artist"><i class="fa fa-check"></i><i class="fa fa-user"></i>Artist</a>
		</li>
		
		<li role="presentation" type="detail-kind">
			<a class="view-band"><i class="fa fa-check"></i><i class="fa fa-users"></i>Band</a>
		</li>
		
		<li role="presentation" type="detail-kind">
			<a class="view-composer"><i class="fa fa-check"></i><i class="fa fa-magic"></i>Composer</a>
		</li>
		
		<li role="presentation" type="detail-kind">
			<a class="view-genre"><i class="fa fa-check"></i><i class="fa fa-tags"></i>Genre</a>
		</li>
		
		<li role="presentation" type="detail-kind" style="display:none">
			<a class="view-length"><i class="fa fa-check"></i><i class="fa fa-clock"></i>Length</a>
		</li>
		
		<li role="presentation" type="detail-kind">
			<a class="view-publisher"><i class="fa fa-check"></i><i class="fa fa-money-bill"></i>Publisher</a>
		</li>
		
		<li role="presentation" type="detail-kind">
			<a class="view-title"><i class="fa fa-check"></i><i class="fa fa-font"></i>Title</a>
		</li>
		
		<li role="presentation" type="detail-kind">
			<a class="view-track-number"><i class="fa fa-check"></i><i class="fa fa-list-ol"></i>Track Number</a>
		</li>
		
		<li role="presentation" type="detail-kind">
			<a class="view-year"><i class="fa fa-check"></i><i class="fa fa-calendar-alt"></i>Year</a>
		</li>
		
		<li role="separator" class="divider"></li>

		<li role="presentation" class="show-toolbars dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-wrench"></i>Toolbars<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="show-toolbar dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation" class="option">
					<a class="show-play-bar"><i class="fa fa-check"></i><i class="fa fa-play"></i>Play</a>
				</li>
		
				<li role="presentation" class="option">
					<a class="show-volume-bar"><i class="fa fa-check"></i><i class="fa fa-volume-up"></i>Volume</a>
				</li>

				<li role="presentation" class="option">
					<a class="show-track-bar"><i class="fa fa-check"></i><i class="fa fa-list"></i>Track</a>
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
					<a class="show-track-info-panel"><i class="fa fa-check"></i><i class="fa fa-table"></i>Track Info<span class="command shortcut">I</span></a>
				</li>

				<li role="presentation">
					<a class="show-files-panel"><i class="fa fa-check"></i><i class="fa fa-file"></i>Files</a>
				</li>
			</ul>
		</li>
		
		<li role="presentation">
			<a class="show-analyser"><i class="fa fa-check"></i><i class="fa fa-chart-bar"></i>Analyser</a>
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
		'click li[type="detail-kind"] a': 'onClickDetailKind',

		// toolbar options
		//
		'click .show-toolbars > a': 'onClickShowToolbars',
		'click .show-toolbar > li > a': 'onClickShowToolbar',

		// sidebar options
		//
		'click .show-sidebar': 'onClickOption',
		'click .show-sidebar-panels a': 'onClickShowSideBarPanel',
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
			'show-analyser': preferences.get('show_analyser')
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

	onClickDetailKind: function(event) {
		let className = $(event.currentTarget).attr('class');
		let detailKind = className.replace('view-', '').replace(/-/g, '_');

		// update menu
		//
		this.setDetailKind(detailKind);

		// update parent
		//
		this.parent.app.setOption('detail_kind', detailKind);
	},

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