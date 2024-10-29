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

		<li role="presentation" class="view-kind" style="display:none">
			<a class="view-names"><i class="fa fa-check"></i><i class="fa fa-align-left"></i>Names</a>
		</li>

		<li role="presentation" class="view-kind">
			<a class="view-lists"><i class="fa fa-check"></i><i class="fa fa-list"></i>Lists</a>
		</li>

		<li role="presentation" class="hidden view-kind">
			<a class="view-strips"><i class="fa fa-check"></i><i class="fa fa-columns"></i>Strips</a>
		</li>

		<li role="presentation" class="view-kind">
			<a class="view-trees"><i class="fa fa-check"></i><i class="fa fa-tree"></i>Trees</a>
		</li>

		<li role="presentation" class="view-kind">
			<a class="view-cards"><i class="fa fa-check"></i><i class="fa fa-id-card"></i>Cards</a>
		</li>

		<li role="presentation" class="view-kind">
			<a class="view-tiles"><i class="fa fa-check"></i><i class="fa fa-th-large"></i>Tiles</a>
		</li>

		<li role="presentation" class="view-kind">
			<a class="view-pages"><i class="fa fa-check"></i><i class="fa fa-book-open"></i>Pages</a>
		</li>

		<li role="presentation" class="view-kind">
			<a class="view-gallery"><i class="fa fa-check"></i><i class="fa fa-image"></i>Gallery</a>
		</li>

		<li role="presentation" class="view-kind dropdown dropdown-submenu">
			<a class="view-maps dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-map"></i>Maps<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="dropdown-menu" data-toggle="dropdown">

				<li role="presentation" class="map-mode">
					<a class="view-map"><i class="fa fa-check"></i><i class="fa fa-map"></i>Map</a>
				</li>

				<li role="presentation" class="map-mode">
					<a class="view-satellite"><i class="fa fa-check"></i><i class="fa fa-satellite"></i>Satellite</a>
				</li>

				<li role="presentation" class="map-mode">
					<a class="view-hybrid"><i class="fa fa-check"></i><i class="fa fa-map-marked-alt"></i>Hybrid</a>
				</li>

				<li role="presentation" class="map-mode">
					<a class="view-streets"><i class="fa fa-check"></i><i class="fa fa-road"></i>Streets</a>
				</li>

				<li role="presentation" class="map-mode">
					<a class="view-transportation"><i class="fa fa-check"></i><i class="fa fa-bus"></i>Transportation</a>
				</li>

				<li role="presentation" class="map-mode">
					<a class="view-aeronautical"><i class="fa fa-check"></i><i class="fa fa-plane"></i>Aeronautical</a>
				</li>

				<li role="separator" class="divider"></li>

				<li role="presentation" class="map-view-kind dropdown dropdown-submenu">
					<a class="dropdown-toggle"><i class="fa fa-map-location"></i>Items<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

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

						<li role="presentation">
							<a class="show-geo-orientations"><i class="fa fa-check"></i><i class="fa fa-location-arrow"></i>Orientations</a>
						</li>
					</ul>
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

				<li role="presentation" class="option">
					<a class="show-sharing-bar"><i class="fa fa-check"></i><i class="fa fa-share"></i>Sharing</a>
				</li>
			</ul>
		</li>

		<li role="presentation" class="show-items dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-file"></i>Items<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="dropdown-menu" data-toggle="dropdown">

				<li role="presentation">
					<a class="show-hidden-files"><i class="fa fa-check"></i><i class="far fa-file"></i>Hidden Files<span class="shift command shortcut">.</span></a>
				</li>

				<li role="presentation">
					<a class="show-file-extensions"><i class="fa fa-check"></i><i class="fa fa-file"></i>File Extensions<span class="shift command shortcut">x</span></a>
				</li>

				<li role="presentation">
					<a class="show-thumbnails"><i class="fa fa-check"></i><i class="fa fa-image"></i>Thumbnails</a>
				</li>

				<li role="presentation">
					<a class="show-image-names"><i class="fa fa-check"></i><i class="fa fa-font"></i>Image Names</a>
				</li>
			</ul>
		</li>

		<li role="presentation" class="show-properties dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-ribbon"></i>Properties<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="dropdown-menu" data-toggle="dropdown">
				<li role="presentation" type="property">
					<a class="show-places"><i class="fa fa-check"></i><i class="fa fa-globe"></i>Places</a>
				</li>

				<li role="presentation" type="property">
					<a class="show-links"><i class="fa fa-check"></i><i class="fa fa-link"></i>Links</a>
				</li>

				<li role="presentation" type="property">
					<a class="show-shares"><i class="fa fa-check"></i><i class="fa fa-share"></i>Shares</a>
				</li>

				<li role="presentation" type="property">
					<a class="show-indices"><i class="fa fa-check"></i><i class="fa fa-list"></i>Indices</a>
				</li>
			</ul>
		</li>

		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="view-details dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-tags"></i>Details<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="dropdown-menu" data-toggle="dropdown">

				<li role="presentation" type="detail-kind">
					<a class="view-size"><i class="fa fa-check"></i><i class="fa fa-download"></i>Size</a>
				</li>

				<li role="presentation" class="dropdown dropdown-submenu">
					<a class="view-date dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-calendar-alt"></i>Date<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

					<ul class="dropdown-menu" data-toggle="dropdown-menu">
						<li role="presentation" type="detail-kind">
							<a class="view-create-date"><i class="fa fa-check"></i><i class="fa fa-magic"></i>Create Date</a>
						</li>

						<li role="presentation" type="detail-kind">
							<a class="view-modify-date"><i class="fa fa-check"></i><i class="fa fa-edit"></i>Modify Date</a>
						</li>

						<li role="presentation" type="detail-kind">
							<a class="view-access-date"><i class="fa fa-check"></i><i class="fa fa-eye"></i>Access Date</a>
						</li>

						<li role="separator" class="divider"></li>

						<li role="presentation" type="date-format">
							<a class="view-date-only"><i class="fa fa-check"></i><i class="fa fa-calendar-alt"></i>Date Only</a>
						</li>

						<li role="presentation" type="date-format">
							<a class="view-day-date"><i class="fa fa-check"></i><i class="fa fa-calendar-plus"></i>Day, Date</a>
						</li>

						<li role="presentation" type="date-format">
							<a class="view-time-only"><i class="fa fa-check"></i><i class="fa fa-clock"></i>Time Only</a>
						</li>

						<li role="presentation" type="date-format">
							<a class="view-date-time"><i class="fa fa-check"></i><i class="fa fa-calendar-check"></i>Date, Time</a>
						</li>

						<li role="presentation" type="date-format">
							<a class="view-day-date-time"><i class="fa fa-check"></i><i class="fa fa-calendar-alt"></i>Day, Date, Time</a>
						</li>
					</ul>
				</li>

				<li role="presentation" class="view-audio dropdown dropdown-submenu">
					<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-music"></i>Audio<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

					<ul class="dropdown-menu" data-toggle="dropdown">
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

						<li role="presentation" type="detail-kind">
							<a class="view-length"><i class="fa fa-check"></i><i class="fa fa-clock"></i>Length</a>
						</li>

						<li role="presentation" type="detail-kind">
							<a class="view-publisher"><i class="fa fa-check"></i><i class="fa fa-money-bill"></i>Publisher</a>
						</li>

						<li role="presentation" type="detail-kind">
							<a class="view-track-number"><i class="fa fa-check"></i><i class="fa fa-list-ol"></i>Track Number</a>
						</li>

						<li role="presentation" type="detail-kind">
							<a class="view-year"><i class="fa fa-check"></i><i class="fa fa-calendar-alt"></i>Year</a>
						</li>
					</ul>
				</li>

				<li role="presentation" class="view-photo dropdown dropdown-submenu">
					<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-image"></i>Photo<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

					<ul class="dropdown-menu" data-toggle="dropdown">
						<li role="presentation" type="detail-kind">
							<a class="view-resolution"><i class="fa fa-check"></i><i class="fa fa-arrows-alt"></i>Resolution</a>
						</li>

						<li role="presentation" type="detail-kind">
							<a class="view-make-model"><i class="fa fa-check"></i><i class="fa fa-camera"></i>Make / Model</a>
						</li>

						<li role="presentation" type="detail-kind">
							<a class="view-focal-length"><i class="fa fa-check"></i><i class="fa fa-arrows-alt-h"></i>Focal Length</a>
						</li>

						<li role="presentation" type="detail-kind">
							<a class="view-exposure"><i class="fa fa-check"></i><i class="fa fa-clock"></i>Exposure</a>
						</li>

						<li role="presentation" type="detail-kind">
							<a class="view-aperture"><i class="fa fa-check"></i><i class="fa fa-dot-circle"></i>Aperture</a>
						</li>

						<li role="presentation" type="detail-kind">
							<a class="view-iso"><i class="fa fa-check"></i><i class="fa fa-film"></i>ISO</a>
						</li>

						<li role="presentation" type="detail-kind">
							<a class="view-capture-date"><i class="fa fa-check"></i><i class="fa fa-calendar-alt"></i>Capture Date</a>
						</li>
					</ul>
				</li>

				<li role="presentation" class="view-video dropdown dropdown-submenu">
					<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-video"></i>Video<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

					<ul class="dropdown-menu" data-toggle="dropdown">

						<li role="presentation" type="detail-kind">
							<a class="view-resolution"><i class="fa fa-check"></i><i class="fa fa-arrows-alt"></i>Resolution</a>
						</li>

						<li role="presentation" type="detail-kind">
							<a class="view-duration"><i class="fa fa-check"></i><i class="fa fa-clock"></i>Duration</a>
						</li>

						<li role="presentation" type="detail-kind">
							<a class="view-bit-rate"><i class="fa fa-check"></i><i class="fa fa-chart-bar"></i>Bit Rate</a>
						</li>
					</ul>
				</li>
			</ul>
		</li>

		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="show-sidebar dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-pause"></i>Sidebar<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="show-sidebar-panels dropdown-menu" data-toggle="dropdown">

				<li role="presentation">
					<a class="show-clipboard-panel"><i class="fa fa-check"></i><i class="fa fa-clipboard"></i>Clipboard</a>
				</li>

				<li role="presentation">
					<a class="show-favorites-panel"><i class="fa fa-check"></i><i class="fa fa-star"></i>Favorites</a>
				</li>

				<li role="presentation">
					<a class="show-files-panel"><i class="fa fa-check"></i><i class="fa fa-folder"></i>Files</a>
				</li>

				<li role="presentation">
					<a class="show-shared-panel"><i class="fa fa-check"></i><i class="fa fa-share"></i>Shared</a>
				</li>
			</ul>
		</li>

		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-th"></i>Sidebar Items<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="sidebar-view-kind dropdown-menu" data-toggle="dropdown">

				<li role="presentation">
					<a class="view-sidebar-icons"><i class="fa fa-check"></i><i class="fa fa-th"></i>Icons</a>
				</li>

				<li role="presentation">
					<a class="view-sidebar-lists"><i class="fa fa-check"></i><i class="fa fa-list"></i>Lists</a>
				</li>

				<li role="presentation">
					<a class="view-sidebar-trees"><i class="fa fa-check"></i><i class="fa fa-tree"></i>Trees</a>
				</li>

				<li role="presentation">
					<a class="view-sidebar-cards"><i class="fa fa-check"></i><i class="fa fa-id-card"></i>Cards</a>
				</li>

				<li role="presentation">
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
		'click .map-view-kind > a': 'onClickMapViewKind',
		'click .view-details': 'onClickViewDetails',

		// toolbar options
		//
		'click .show-toolbars > a': 'onClickShowToolbars',
		'click .show-toolbar > li > a': 'onClickShowToolbar',

		// detail options
		//
		'click .show-hidden-files': 'onClickShowHiddenFiles',
		'click .show-thumbnails': 'onClickOption',
		'click .show-image-names': 'onClickOption',
		'click .show-file-extensions': 'onClickOption',
		'click li.show-properties > a': 'onClickShowProperties',
		'click li[type=property] > a': 'onClickShowProperty',
		'click li[type=detail-kind] > a': 'onClickDetailKind',
		'click li[type=date-format] > a': 'onClickDateFormat',

		// map options
		//
		'click .map-mode > a': 'onClickMapMode',
		'click .pan-north': 'onClickPanNorth',
		'click .pan-south': 'onClickPanSouth',
		'click .pan-east': 'onClickPanEast',
		'click .pan-west': 'onClickPanWest',
		'click .zoom-in': 'onClickZoomIn',
		'click .zoom-out': 'onClickZoomOut',
		'click .reset-view': 'onClickResetView',
		'click .map-item-kind > a': 'onClickMapItemKind',
		'click .show-item-names': 'onClickOption',
		'click .show-geo-orientations': 'onClickOption',

		// sidebar options
		//
		'click .show-sidebar': 'onClickOption',
		'click .show-sidebar-panels > li > a': 'onClickShowSideBarPanel',
		'click .sidebar-view-kind > li > a': 'onClickSideBarViewKind',

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
		let numFiles = this.parent.app.model.get('num_files');

		return {
			'view-gallery': numFiles && numFiles.image > 0,
			'view-audio': numFiles && numFiles.audio > 0,
			'view-photo': numFiles && numFiles.image > 0,
			'view-video': numFiles && numFiles.video > 0,
			'view-maps': this.parent.app.hasGeolocatedItems(),
			'map-items': this.parent.app.hasGeolocatedItems(),
			'toolbars': true
		};
	},

	enabled: function() {
		let preferences = this.parent.app.preferences;
		let showingMap = preferences.get('view_kind') == 'maps';

		return {
			'pan-to': showingMap,
			'pan-north': showingMap,
			'pan-south': showingMap,
			'pan-east': showingMap,
			'pan-west': showingMap,
			'zoom-to': showingMap,
			'zoom-in': showingMap,
			'zoom-out': showingMap,
			'reset-view': showingMap
		};
	},

	selected: function() {
		let preferences = this.parent.app.preferences;
		let isDesktop = this.parent.app.isDesktop();
		let viewKind = preferences.get('view_kind');
		let mapMode = preferences.get('map_mode');
		let toolbars = preferences.get('toolbars') || [];
		let properties = preferences.get('properties') || [];
		let detailKind = preferences.get('detail_kind');
		let dateFormat = preferences.get('date_format');
		let mapViewKind = preferences.get('map_view_kind');
		let sidebarPanels = preferences.get('sidebar_panels') || [];
		let sidebarViewKind = preferences.get('sidebar_view_kind');

		return {

			// view options
			//
			'view-icons': viewKind == 'icons',
			'view-names': viewKind == 'names',
			'view-lists': viewKind == 'lists',
			'view-trees': viewKind == 'trees',
			'view-cards': viewKind == 'cards',
			'view-tiles': viewKind == 'tiles',
			'view-pages': viewKind == 'pages',
			'view-gallery': viewKind == 'gallery',
			'view-maps': viewKind == 'maps',

			// map options
			//
			'view-map': mapMode == 'map',
			'view-aerial': mapMode == 'aerial',
			'view-satellite': mapMode == 'satellite',
			'view-hybrid': mapMode == 'hybrid',
			'view-streets': mapMode == 'streets',
			'view-transportation': mapMode == 'transportation',
			'view-sectional': mapMode == 'sectional',
			'view-ifrlo': mapMode == 'ifrlo',
			'view-ifrhi': mapMode == 'ifrhi',

			// toolbar options
			//
			'show-toolbars': toolbars.length > 0,
			'show-nav-bar': toolbars.includes('nav'),
			'show-sharing-bar': toolbars.includes('sharing'),
			'show-indexing-bar': toolbars.includes('indexing'),

			// item attributes
			//
			'show-hidden-files': preferences.get('show_hidden_files') == true,
			'show-file-extensions': preferences.get('show_file_extensions') == true,
			'show-thumbnails': preferences.get('show_thumbnails') == true,
			'show-image-names': preferences.get('show_image_names') == true,

			// item properties
			//
			'show-properties': properties.length > 0,
			'show-places': properties.includes('places'),
			'show-links': properties.includes('links'),
			'show-shares': properties.includes('shares'),
			'show-indices': properties.includes('indices'),

			// map item options
			//
			'view-map-icons': mapViewKind == 'icons',
			'view-map-lists': mapViewKind == 'lists',
			'view-map-cards': mapViewKind == 'cards',
			'view-map-tiles': mapViewKind == 'tiles',
			'view-map-pages': mapViewKind == 'pages',
			'show-item-names': preferences.get('show_item_names'),
			'show-geo-orientations': preferences.get('show_geo_orientations'),

			// detail options
			//
			'view-details': typeof detailKind == 'string' && detailKind != '',
			'view-size': detailKind == 'size',
			'view-create-date': detailKind == 'create_date',
			'view-modify-date': detailKind == 'modify_date',
			'view-access-date': detailKind == 'access_date',
			'view-date-only': dateFormat == 'date_only',
			'view-day-date': dateFormat == 'day_date',
			'view-time-only': dateFormat == 'time_only',
			'view-date-time': dateFormat == 'date_time',
			'view-day-date-time': dateFormat == 'day_date_time' || !dateFormat,
			'view-resolution': detailKind == 'resolution',
			'view-make-model': detailKind == 'make_model',
			'view-focal-length': detailKind == 'focal_length',
			'view-exposure': detailKind == 'exposure',
			'view-aperture': detailKind == 'aperture',
			'view-iso': detailKind == 'iso',
			'view-capture-date': detailKind == 'capture_date',

			// sidebar options
			//
			'show-sidebar': isDesktop? preferences.get('show_desktop_sidebar') : preferences.get('show_sidebar'),
			'show-clipboard-panel': sidebarPanels.includes('clipboard'),
			'show-favorites-panel': sidebarPanels.includes('favorites'),
			'show-files-panel': sidebarPanels.includes('files'),
			'show-shared-panel': sidebarPanels.includes('shared'),

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
	// getting methods
	//

	getProperties: function() {
		return this.getElementAttributes('.show-properties li a', 'class', (value) => {
			return value.replace('show-', '').replace(/-/g, '_');
		});
	},

	getSelectedProperties: function() {
		return this.getElementAttributes('.show-properties li.selected a', 'class', (value) => {
			return value.replace('show-', '').replace('-bar', '').replace(/-/g, '_');
		});
	},

	//
	// setting methods
	//

	setOption: function(className, value) {
		let option = className.replace(/-/g, '_');

		// call superclass method
		//
		this.setItemSelected(className, value);

		// update parent
		//
		this.parent.app.setOption(option, value);
	},

	toggleOption: function(className) {
		let option = className.replace(/-/g, '_');

		// call superclass method
		//
		this.toggleMenuItem(className);

		// update parent
		//
		this.parent.app.setOption(option, this.isItemSelected(className));
	},

	toggleProperty: function(property) {

		// call superclass method
		//
		this.toggleMenuItem('show-' + property);

		// update parent
		//
		this.parent.app.setOption('properties', this.getSelectedProperties());
	},

	setMapMode: function(mapMode) {
		this.$el.find('li.map-mode').removeClass('selected');
		this.$el.find('li .view-' + mapMode).closest('li').addClass('selected');
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		ViewMenuView.prototype.onRender.call(this);

		// listen for changes in full screen status
		//
		if (this.parent.app.isDesktop()) {
			$(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', () => {
				this.setItemSelected('view-full-screen', application.isFullScreen());						
			});
		}
	},

	//
	// map event handling methods
	//

	onClickMapMode: function(event) {
		let className = $(event.currentTarget).attr('class').split(' ')[0];
		let mapMode = className.replace('view-', '').replace(/-/g, '_');

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
		this.parent.app.getActiveView().getChildView('items').resetView();
	},

	//
	// pan event handling methods
	//

	onClickPanNorth: function() {
		let itemsView = this.parent.app.getActiveView().getChildView('items');
		if (itemsView && itemsView.hasChildView('map')) {
			itemsView.getChildView('map').panToDirection('north', {
				duration: 1000
			});
		}
	},

	onClickPanSouth: function() {
		let itemsView = this.parent.app.getActiveView().getChildView('items');
		if (itemsView && itemsView.hasChildView('map')) {
			itemsView.getChildView('map').panToDirection('south', {
				duration: 1000
			});
		}
	},

	onClickPanEast: function() {
		let itemsView = this.parent.app.getActiveView().getChildView('items');
		if (itemsView && itemsView.hasChildView('map')) {
			itemsView.getChildView('map').panToDirection('east', {
				duration: 1000
			});
		}
	},
	
	onClickPanWest: function() {
		let itemsView = this.parent.app.getActiveView().getChildView('items');
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
		let itemsView = this.parent.app.getActiveView().getChildView('items');
		if (itemsView && itemsView.hasChildView('map')) {
			itemsView.getChildView('map').zoomIn({
				duration: 1000
			});
		}
	},

	onClickZoomOut: function() {
		let itemsView = this.parent.app.getActiveView().getChildView('items');
		if (itemsView && itemsView.hasChildView('map')) {
			itemsView.getChildView('map').zoomOut({
				duration: 1000
			});
		}
	},

	//
	// view option event handling methods
	//

	onClickShowProperties: function() {
		let showProperties = this.isItemSelected('show-properties');

		// update menu
		//
		this.toggleMenuItem('show-properties');
		if (!showProperties) {
			this.$el.find('.show-properties li').addClass('selected');
		} else {
			this.$el.find('.show-properties li').removeClass('selected');
		}

		// update view
		//
		this.parent.app.setOption('properties', showProperties? [] : this.getProperties());
	},

	onClickShowProperty: function(event) {
		let className = $(event.currentTarget).attr('class');

		// update menu
		//
		this.toggleMenuItem(className);

		// update view
		//
		this.parent.app.setOption('properties', this.getSelectedProperties());
	},

	onClickViewDetails: function() {

		// update menu
		//
		let classNames = this.$el.find('li[type=detail-kind]').map((index, element) => { 
			return $(element).find('a').attr('class');
		}).get();
		this.setItemsDeselected(classNames);
		this.setItemSelected('view-details', false);

		// update parent
		//
		this.parent.app.setOption('detail_kind', false);
	},

	onClickShowHiddenFiles: function() {
		this.toggleOption('show-hidden-files');
	},

	onClickShowMagnified: function() {
		this.setOption('view-magnified', true);
	},

	onClickShowUnmagnified: function() {
		this.setOption('view-magnified', false);
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		$(document).off('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange');
	}
});