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

		<li role="presentation" class="show-toolbars dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-wrench"></i>Toolbars<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="show-toolbar dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation" class="option">
					<a class="show-nav-bar"><i class="fa fa-check"></i><i class="fa fa-sitemap"></i>Nav</a>
				</li>
			</ul>
		</li>

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
		
				<li role="presentation" type="detail-kind">
					<a class="view-age"><i class="fa fa-check"></i><i class="fa fa-hourglass-half"></i>Age</a>
				</li>
				
				<li role="presentation" class="dropdown dropdown-submenu">
					<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-calendar-alt"></i>Date<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
					<ul class="dropdown-menu" data-toggle="dropdown-menu">
		
						<li role="presentation" type="detail-kind">
							<a class="view-birth-date"><i class="fa fa-check"></i><i class="fa fa-birthday-cake"></i>Birth Date</a>
						</li>
		
						<li role="presentation" type="detail-kind">
							<a class="view-join-date"><i class="fa fa-check"></i><i class="fa fa-user-circle"></i>Join Date</a>
						</li>
		
						<li role="presentation" type="detail-kind">
							<a class="view-connect-date"><i class="fa fa-check"></i><i class="fa fa-user-friends"></i>Connect Date</a>
						</li>
		
						<li role="separator" class="divider"></li>
		
						<li role="presentation" type="date-format">
							<a class="view-date-only"><i class="fa fa-check"></i><i class="fa fa-calendar-alt"></i>Date Only</a>
						</li>
		
						<li role="presentation" type="date-format">
							<a class="view-day-date"><i class="fa fa-check"></i><i class="fa fa-calendar-plus"></i>Day, Date</a>
						</li>
					</ul>
				</li>
			</ul>
		</li>

		<li role="presentation" class="map-items dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-map-location"></i>Map Items<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="dropdown-menu" data-toggle="dropdown">

				<li role="presentation" class="map-view-kind">
					<a class="view-map-icons"><i class="fa fa-check"></i><i class="fa fa-th"></i>Icons</a>
				</li>

				<li role="presentation" class="map-view-kind">
					<a class="view-map-lists"><i class="fa fa-check"></i><i class="fa fa-list"></i>Lists</a>
				</li>

				<li role="presentation" class="map-view-kind">
					<a class="view-map-cards"><i class="fa fa-check"></i><i class="fa fa-id-card"></i>Cards</a>
				</li>

				<li role="presentation" class="map-view-kind">
					<a class="view-map-tiles"><i class="fa fa-check"></i><i class="fa fa-th-large"></i>Tiles</a>
				</li>

				<li role="separator" class="divider"></li>

				<li role="presentation">
					<a class="show-item-names"><i class="fa fa-check"></i><i class="fa fa-font"></i>Names</a>
				</li>
			</ul>
		</li>

		<li role="presentation" class="hidden-xs dropdown dropdown-submenu">
			<a class="show-sidebar dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-pause"></i>Sidebar<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="show-sidebar-panels dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation">
					<a class="show-actions-panel"><i class="fa fa-check"></i><i class="fa fa-play-circle"></i>Actions</a>
				</li>
		
				<li role="presentation">
					<a class="show-groups-panel"><i class="fa fa-check"></i><i class="fa fa-user"></i>Groups</a>
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
		'click .map-mode > a': 'onClickMapMode',

		// toolbar options
		//
		'click .show-toolbars > a': 'onClickShowToolbars',
		'click .show-toolbar > li > a': 'onClickShowToolbar',

		// detail options
		//
		'click .view-details': 'onClickViewDetails',
		'click li[type=detail-kind] a': 'onClickDetailKind',
		'click li[type=date-format] a': 'onClickDateFormat',

		// map options
		//
		'click .map-view-kind > a': 'onClickMapViewKind',
		'click .show-item-names': 'onClickOption',
		'click .pan-north': 'onClickPanNorth',
		'click .pan-south': 'onClickPanSouth',
		'click .pan-east': 'onClickPanEast',
		'click .pan-west': 'onClickPanWest',
		'click .zoom-in': 'onClickZoomIn',
		'click .zoom-out': 'onClickZoomOut',
		'click .reset-view': 'onClickResetView',

		// sidebar options
		//	
		'click .show-sidebar': 'onClickOption',
		'click .show-sidebar-panels a': 'onClickShowSideBarPanel',
		'click .sidebar-view-kind a': 'onClickSideBarViewKind',

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

	disabled: function() {
		let preferences = this.parent.app.preferences;
		let showingMap = preferences.get('view_kind') == 'maps';

		return {
			'pan-to': !showingMap,
			'pan-north': !showingMap,
			'pan-south': !showingMap,
			'pan-east': !showingMap,
			'pan-west': !showingMap,
			'zoom-to': !showingMap,
			'zoom-in': !showingMap,
			'zoom-out': !showingMap,
			'reset-view': !showingMap
		};
	},

	selected: function() {
		let preferences = this.parent.app.preferences;
		let mapMode = preferences.get('map_mode');
		let viewKind = preferences.get('view_kind');
		let toolbars = preferences.get('toolbars') || [];
		let detailKind = preferences.get('detail_kind');
		let dateFormat = preferences.get('date_format');
		let mapViewKind = preferences.get('map_view_kind');
		let sidebarPanels = preferences.get('sidebar_panels') || [];
		let sidebarViewKind = preferences.get('sidebar_view_kind');

		return {

			// view options
			//
			'view-icons': !viewKind || viewKind == 'icons',
			'view-names': viewKind == 'names',
			'view-lists': viewKind == 'lists',
			'view-trees': viewKind == 'trees',
			'view-cards': viewKind == 'cards',
			'view-tiles': viewKind == 'tiles',
			'view-maps': viewKind == 'maps',

			// map options
			//
			'show-map': mapMode == 'map',
			'show-satellite': mapMode == 'satellite',
			'show-hybrid': mapMode == 'hybrid',
			'show-streets': mapMode == 'streets',
			'show-transportation': mapMode == 'transportation',
			'show-sectional': mapMode == 'sectional',
			'show-ifrlo': mapMode == 'ifrlo',
			'show-ifrhi': mapMode == 'ifrhi',

			// toolbar options
			//
			'show-toolbars': toolbars.length > 0,
			'show-nav-bar': toolbars.includes('nav'),

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

			// map item options
			//
			'view-map-icons': mapViewKind == 'icons',
			'view-map-lists': mapViewKind == 'lists',
			'view-map-cards': mapViewKind == 'cards',
			'view-map-tiles': mapViewKind == 'tiles',
			'view-map-pages': mapViewKind == 'pages',
			'show-item-names': preferences.get('show_item_names'),

			// sidebar options
			//
			'show-sidebar': preferences.get('show_sidebar'),
			'show-actions-panel': sidebarPanels.includes('actions'),
			'show-groups-panel': sidebarPanels.includes('groups'),

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

	setMapMode: function(mapMode) {
		this.$el.find('li.map-mode').removeClass('selected');
		this.$el.find('li .show-' + mapMode).closest('li').addClass('selected');
	},

	//
	// mouse event handling methods
	//

	onClickViewKind: function(event) {
		let className = $(event.currentTarget).attr('class').split(' ')[0];
		let viewKind = className.replace('view-', '').replace(/-/g, '_');

		// update menu
		//
		this.setViewKind(viewKind);

		// update parent
		//
		this.parent.app.setOption('view_kind', viewKind);

		// update map menu items
		//
		this.setDisabled(this.disabled());
	},

	//
	// map event handling methods
	//

	onClickMapMode: function(event) {
		let className = $(event.currentTarget).attr('class').split(' ')[0];
		let mapMode = className.replace('show-', '').replace(/-/g, '_');

		// update menu
		//
		this.setMapMode(mapMode);
		if (!this.isItemSelected('view-maps')) {
			this.setViewKind('maps');
		}
		
		// update parent
		//
		this.parent.app.setOption('map_mode', mapMode);
	},

	onClickResetView: function() {
		this.parent.app.getChildView('content').getChildView('items').resetView();
	},
	
	//
	// pan event handling methods
	//

	onClickPanNorth: function() {
		let itemsView = this.parent.app.getChildView('content').getChildView('items');
		if (itemsView && itemsView.hasChildView('map')) {
			itemsView.getChildView('map').panToDirection('north', {
				duration: 1000
			});
		}
	},

	onClickPanSouth: function() {
		let itemsView = this.parent.app.getChildView('content').getChildView('items');
		if (itemsView && itemsView.hasChildView('map')) {
			itemsView.getChildView('map').panToDirection('south', {
				duration: 1000
			});
		}
	},

	onClickPanEast: function() {
		let itemsView = this.parent.app.getChildView('content').getChildView('items');
		if (itemsView && itemsView.hasChildView('map')) {
			itemsView.getChildView('map').panToDirection('east', {
				duration: 1000
			});
		}
	},
	
	onClickPanWest: function() {
		let itemsView = this.parent.app.getChildView('content').getChildView('items');
		if (itemsView && itemsView.hasChildView('map')) {
			itemsView.getChildView('map').panToDirection('west', {
				duration: 1000
			});
		}
	},

	//
	// zoom event handling methods
	//

	onClickZoomIn: function() {
		let itemsView = this.parent.app.getChildView('content').getChildView('items');
		if (itemsView && itemsView.hasChildView('map')) {
			itemsView.getChildView('map').zoomIn({
				duration: 1000
			});
		}
	},

	onClickZoomOut: function() {
		let itemsView = this.parent.app.getChildView('content').getChildView('items');
		if (itemsView && itemsView.hasChildView('map')) {
			itemsView.getChildView('map').zoomOut({
				duration: 1000
			});
		}
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