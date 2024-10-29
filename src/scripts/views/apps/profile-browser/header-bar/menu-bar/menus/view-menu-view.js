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
		<li role="presentation" class="view-kind">
			<a class="view-icons"><i class="fa fa-check"></i><i class="fa fa-th"></i>Icons</a>
		</li>
		
		<li role="presentation" class="view-kind desktop-only">
			<a class="view-names"><i class="fa fa-check"></i><i class="fa fa-align-left"></i>Names</a>
		</li>
		
		<li role="presentation" class="view-kind">
			<a class="view-lists"><i class="fa fa-check"></i><i class="fa fa-list"></i>Lists</a>
		</li>
		
		<li role="presentation" class="view-kind">
			<a class="view-cards"><i class="fa fa-check"></i><i class="fa fa-id-card"></i>Cards</a>
		</li>
		
		<li role="presentation" class="view-kind">
			<a class="view-tiles"><i class="fa fa-check"></i><i class="fa fa-th-large"></i>Tiles</a>
		</li>
		
		<li role="presentation" class="view-kind dropdown dropdown-submenu">
			<a class="view-maps dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-map"></i>Maps<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation" class="map-mode">
					<a class="show-map"><i class="fa fa-check"></i><i class="fa fa-map"></i>Map</a>
				</li>
		
				<li role="presentation" class="map-mode">
					<a class="show-satellite"><i class="fa fa-check"></i><i class="fa fa-satellite"></i>Satellite</a>
				</li>
		
				<li role="presentation" class="map-mode">
					<a class="show-hybrid"><i class="fa fa-check"></i><i class="fa fa-map-marked-alt"></i>Hybrid</a>
				</li>
		
				<li role="presentation" class="map-mode">
					<a class="show-streets"><i class="fa fa-check"></i><i class="fa fa-road"></i>Streets</a>
				</li>
		
				<li role="presentation" class="map-mode">
					<a class="show-transportation"><i class="fa fa-check"></i><i class="fa fa-bus"></i>Transportation</a>
				</li>
		
				<li role="presentation" class="map-mode">
					<a class="show-aeronautical"><i class="fa fa-check"></i><i class="fa fa-plane"></i>Aeronautical</a>
				</li>
		
				<li role="separator" class="divider"></li>
				
				<li role="presentation" class="dropdown dropdown-submenu">
					<a class="pan-to dropdown-toggle"><i class="fa fa-arrows-alt"></i>Pan<i class="fa fa-caret-left"></i><i class="fa fa-caret-right">
					</i></a>
		
					<ul class="dropdown-menu" data-toggle="dropdown">
						<li role="presentation">
							<a class="pan-north"><i class="fa fa-arrow-up"></i>North<span class="shortcut">up arrow</span></a>
						</li>
		
						<li role="presentation">
							<a class="pan-south"><i class="fa fa-arrow-down"></i>South<span class="shortcut">down arrow</span></a>
						</li>
		
						<li role="presentation">
							<a class="pan-east"><i class="fa fa-arrow-right"></i>East<span class="shortcut">right arrow</span></a>
						</li>
						
						<li role="presentation">
							<a class="pan-west"><i class="fa fa-arrow-left"></i>West<span class="shortcut">left arrow</span></a>
						</li>
					</ul>
				</li>
		
				<li role="presentation" class="dropdown dropdown-submenu">
					<a class="zoom-to dropdown-toggle"><i class="fa fa-search"></i>Zoom<i class="fa fa-caret-left"></i><i class="fa fa-caret-right">
					</i></a>
		
					<ul class="dropdown-menu" data-toggle="dropdown">
						<li role="presentation">
							<a class="zoom-in"><i class="fa fa-search-plus"></i>Zoom In<span class="shortcut">=</span></a>
						</li>
		
						<li role="presentation">
							<a class="zoom-out"><i class="fa fa-search-minus"></i>Zoom Out<span class="shortcut">-</span></a>
						</li>
					</ul>
				</li>
		
				<li role="presentation">
					<a class="reset-view"><i class="fa fa-undo"></i>Reset<span class="shift command shortcut">R</span></a>
				</li>
			</ul>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="view-details dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-tags"></i>Details<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation" type="detail-kind">
					<a class="view-location"><i class="fa fa-check"></i><i class="fa fa-globe-americas"></i>Location</a>
				</li>
		
				<li role="presentation" type="detail-kind">
					<a class="view-occupation"><i class="fa fa-check"></i><i class="fa fa-briefcase"></i>Occupation</a>
				</li>
		
				<li role="presentation" type="detail-kind">
					<a class="view-gender"><i class="fa fa-check"></i><i class="fa fa-transgender"></i>Gender</a>
				</li>
			</ul>
		</li>
		
		<li role="separator" class="divider"></li>

		<li role="presentation" class="show-toolbars dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-wrench"></i>Toolbars<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="show-toolbar dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation" class="option">
					<a class="show-nav-bar"><i class="fa fa-check"></i><i class="fa fa-sitemap"></i>Nav</a>
				</li>
			</ul>
		</li>

		<li role="presentation" class="hidden-xs dropdown dropdown-submenu">
			<a class="show-sidebar dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-pause"></i>Sidebar<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="show-sidebar-panels dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation">
					<a class="show-actions-panel"><i class="fa fa-check"></i><i class="fa fa-play-circle"></i>Actions</a>
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
		'click .view-kind > a': 'onClickViewKind',
		'click .view-details': 'onClickViewDetails',
		'click li[type=detail-kind] > a': 'onClickDetailKind',
		'click li[type=date-format] > a': 'onClickDateFormat',

		// toolbar options
		//
		'click .show-toolbars > a': 'onClickShowToolbars',
		'click .show-toolbar > li > a': 'onClickShowToolbar',

		// sidebar options
		//
		'click .show-sidebar': 'onClickOption',
		'click .show-sidebar-panels > a': 'onClickShowSideBarPanel',

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

	hidden: function() {
		return {
			'view-maps': !this.parent.app.collection.hasGeolocation()
		};
	},

	selected: function() {
		let preferences = this.parent.app.preferences;
		let viewKind = preferences.get('view_kind');
		let toolbars = preferences.get('toolbars') || [];
		let mapMode = preferences.get('map_mode') || 'hybrid';
		let detailKind = preferences.get('detail_kind');
		let dateFormat = preferences.get('date_format');
		let sidebarPanels = preferences.get('sidebar_panels') || [];

		return {

			// item options
			//
			'view-icons': !viewKind || viewKind == 'icons',
			'view-names': viewKind == 'names',
			'view-lists': viewKind == 'lists',
			'view-trees': viewKind == 'trees',
			'view-cards': viewKind == 'cards',
			'view-tiles': viewKind == 'tiles',
			'view-maps': viewKind == 'maps',

			// mapping options
			//
			'show-map': mapMode == 'map',
			'show-satellite': mapMode == 'satellite',
			'show-hybrid': mapMode == 'hybrid',

			// detail options
			//
			'view-details': typeof detailKind == 'string' && detailKind != '',
			'view-location': detailKind == 'location',
			'view-occupation': detailKind == 'occupation',
			'view-age': detailKind == 'age',
			'view-gender': detailKind == 'gender',
			'view-birth-date': detailKind == 'birth_date',
			'view-join-date': detailKind == 'join_date',
			'view-connect-date': detailKind == 'connect_date',

			// date options
			//
			'view-date-only': dateFormat == 'date_only',
			'view-day-date': dateFormat == 'day_date',
			'view-time-only': dateFormat == 'time_only',
			'view-date-time': dateFormat == 'date_time',
			'view-day-date-time': dateFormat == 'day_date_time' || !dateFormat,

			// toolbar options
			//
			'show-toolbars': toolbars.length > 0,
			'show-nav-bar': toolbars.includes('nav'),

			// sidebar options
			//
			'show-sidebar': preferences.get('show_sidebar'),
			'show-actions-panel': sidebarPanels.includes('actions')
		};	
	},
	
	//
	// mouse event handling methods
	//

	onClickViewKind: function(event) {
		let className = $(event.currentTarget).attr('class').split(' ')[0];
		let viewKind = className.replace('view-', '').replace(/-/g, '_');

		// update menu
		//
		this.$el.find('li.view-kind').removeClass('selected');
		this.$el.find('li .view-' + viewKind).closest('li').addClass('selected');

		// update parent
		//
		this.parent.app.setOption('view_kind', viewKind);
	},

	//
	// view option event handling methods
	//
	
	onClickViewDetails: function() {
		let classNames = this.$el.find('li[type=detail-kind]').map((index, element) => { 
			return $(element).find('a').attr('class');
		}).get();
		this.setItemsDeselected(classNames);
		this.setItemSelected('view-details', false);

		// update parent
		//
		this.parent.app.setOption('detail_kind', false);
	}
});