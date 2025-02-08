/******************************************************************************\
|                                                                              |
|                              view-menu-view.js                               |
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

import MenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/menu-view.js';

export default MenuView.extend({

	events: {

		// view options
		//
		'click .view-kind > a': 'onClickViewKind',
		'click .map-view-kind > a': 'onClickMapViewKind',
		'click .property-kind > a': 'onClickPropertyKind',

		// details options
		//
		'click .view-details': 'onClickViewDetails',
		'click .detail-kind > a': 'onClickDetailKind',
		'click .date-format > a': 'onClickDateFormat',

		// toolbar options
		//
		'click .show-toolbars': 'onClickShowToolbars',
		'click .show-toolbar > a': 'onClickShowToolbar',

		// sidebar options
		//
		'click .show-sidebar': 'onClickShowSidebar',
		'click .show-sidebar-panel > a': 'onClickShowSideBarPanel',
		'click .sidebar-view-kind > a': 'onClickSideBarViewKind',
		'click .sidebar-tile-size > a': 'onClickSideBarTileSize',

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

	visible: function() {
		let isDesktop = this.parent.app.isDesktop();
		let hasSpaces = isDesktop && this.parent.app.hasSpaces();
		let isWindowed = !isDesktop;

		return {
			'window-size': isWindowed,
			'spaces': hasSpaces,
			'windows': isDesktop,
			'view-full-screen': isDesktop
		};
	},

	//
	// getting methods
	//

	getSelectedSideBarPanels: function() {
		return this.getElementAttributes('.show-sidebar-panel.selected a', 'class', (value) => {
			return value.replace('show-', '').replace('-panel', '').replace(/-/g, '_');
		});
	},

	getSelectedToolbars: function() {
		return this.getElementAttributes('.show-toolbar.selected a', 'class', (value) => {
			return value.replace('show-', '').replace('-bar', '').replace(/-/g, '_');
		});
	},

	getSelectedLayers: function() {
		return this.getElementAttributes('.show-layer.selected a', 'class', (value) => {
			return value.replace('show-', '').replace('-layer', '').replace(/-/g, '_');
		});
	},

	//
	// setting methods
	//

	setViewKind: function(viewKind) {
		this.$el.find('.view-kind.selected').removeClass('selected');
		this.$el.find('.view-kind .view-' + viewKind).closest('li').addClass('selected');
	},

	setMapViewKind: function(viewKind) {
		this.$el.find('.map-view-kind.selected').removeClass('selected');
		this.$el.find('.view-map-' + viewKind).closest('li').addClass('selected');
	},

	setSideBarViewKind: function(viewKind) {
		this.$el.find('.sidebar-view-kind.selected').removeClass('selected');
		this.$el.find('.view-sidebar-' + viewKind).closest('li').addClass('selected');
	},

	setSideBarTileSize: function(tileSize) {
		this.$el.find('.sidebar-tile-size.selected').removeClass('selected');
		this.$el.find('.' + tileSize + '-tile-size').closest('li').addClass('selected');
	},

	setDetailKind: function(detailKind, detailValue) {
		let classNames = this.$el.find('li.detail-kind').map((index, element) => {
			return $(element).find('a').attr('class');
		}).get();

		detailKind = detailKind.replace(/_/g, '-');
		detailValue = detailValue? detailValue.replace(/_/g, '-') : false;

		// update menu
		//
		this.setItemsDeselected(classNames);
		this.setItemSelected('view-' + detailKind, detailValue);
		this.setItemSelected('view-details', detailValue);
	},

	setDateFormat: function(dateFormat) {
		let classNames = this.$el.find('li.date-format').map((index, element) => {
			return $(element).find('a').attr('class');
		}).get();

		// update menu
		//
		this.setItemsDeselected(classNames);
		this.setItemSelected('view-' + dateFormat.replace(/_/g, '-'));
	},

	//
	// toggling methods
	//

	toggleOption: function(className) {
		let option = className.replace(/-/g, '_');

		// call superclass method
		//
		this.toggleMenuItem(className);

		// update parent
		//
		this.parent.app.setOption(option, this.isItemSelected(className));
	},

	toggleToolbar: function(className) {

		// call superclass method
		//
		this.toggleMenuItem(className);

		// update parent
		//
		this.parent.app.setOption('toolbars', this.getSelectedToolbars());
	},

	toggleLayer: function(className) {

		// call superclass method
		//
		this.toggleMenuItem(className);

		// update parent
		//
		this.parent.app.setOption('layers', this.getSelectedLayers());
	},

	toggleSideBarPanel: function(className) {

		// call superclass method
		//
		this.toggleMenuItem(className);

		// update parent
		//
		this.parent.app.setOption('sidebar_panels', this.getSelectedSideBarPanels());
	},

	//
	// rendering methods
	//

	showSettingsManager: function() {
		application.launch('settings_manager', {
			app: this.parent.app
		});
	},

	//
	// mouse event handling methods
	//

	onClickOption: function(event) {
		let className = $(event.target).closest('a').attr('class');
		let option = className? className.replace('dropdown-toggle', '').trim() : undefined;

		// update menu and app
		//
		this.toggleOption(option);
	},

	onClickViewKind: function(event) {
		let className = $(event.currentTarget).attr('class').split(' ')[0];
		let viewKind = className? className.replace('view-', '').replace(/-/g, '_').trim() : undefined;

		// update menu
		//
		this.setViewKind(viewKind);

		// update parent
		//
		this.parent.app.setOption('view_kind', viewKind);
	},

	onClickMapViewKind: function(event) {
		let className = $(event.currentTarget).attr('class').split(' ')[0];
		let mapViewKind = className? className.replace('view-map-', '').replace(/-/g, '_') : undefined;

		// update menu
		//
		this.setMapViewKind(mapViewKind);

		// update parent
		//
		this.parent.app.setOption('map_view_kind', mapViewKind);
	},

	onClickViewDetails: function() {
		let classNames = this.$el.find('li.detail-kind').map((index, element) => {
			return $(element).find('a').attr('class');
		}).get();

		// update menu
		//
		this.setItemsDeselected(classNames);
		this.setItemSelected('view-details', false);

		// update parent
		//
		this.parent.app.setOption('detail_kind', false);
	},

	onClickDetailKind: function(event) {
		let className = $(event.currentTarget).attr('class');
		let detailKind = className.replace('view-', '').replace(/-/g, '_');
		let detailValue = detailKind != this.parent.app.preferences.get('detail_kind')? detailKind : false;

		// update menu
		//
		this.setDetailKind(detailKind, detailValue);

		// update parent
		//
		this.parent.app.setOption('detail_kind', detailValue);
	},

	onClickDateFormat: function(event) {
		let className = $(event.currentTarget).attr('class');
		let dateFormat = className.replace('view-', '').replace(/-/g, '_');

		// update menu
		//
		this.setDateFormat(dateFormat);

		// update parent
		//
		this.parent.app.setOption('date_format', dateFormat);
	},

	//
	// sidebar mouse event handling methods
	//

	onClickShowSidebar: function(event) {
		this.onClickOption(event);
	},

	onClickShowSideBarPanel: function(event) {
		let className = $(event.target).closest('a').attr('class');

		// update menu and app
		//
		this.toggleSideBarPanel(className);
	},

	onClickSideBarViewKind: function(event) {
		let className = $(event.currentTarget).attr('class').split(' ')[0];
		let sidebarViewKind = className? className.replace('view-sidebar-', '').replace(/-/g, '_') : undefined;

		// update menu
		//
		this.setSideBarViewKind(sidebarViewKind);

		// update parent
		//
		this.parent.app.setOption('sidebar_view_kind', sidebarViewKind);
	},

	onClickSideBarTileSize: function(event) {
		let className = $(event.currentTarget).attr('class').split(' ')[0];
		let sidebarTileSize = className? className.replace('-tile-size', '').replace(/-/g, '_') : undefined;

		// update menu
		//
		this.setSideBarTileSize(sidebarTileSize);

		// update parent
		//
		this.parent.app.setOption('sidebar_tile_size', sidebarTileSize);
	},

	//
	// toolbar mouse event handling methods
	//

	onClickShowToolbars: function() {
		let showToolbars = this.isItemSelected('show-toolbars');

		// update menu
		//
		this.toggleMenuItem('show-toolbars');

		// update app
		//
		this.parent.app.setOption('show_toolbars', !showToolbars);
	},

	onClickShowToolbar: function(event) {
		let className = $(event.target).closest('a').attr('class');

		// update toolbar
		//
		this.toggleToolbar(className);
	},

	//
	// window mouse event handling methods
	//

	onClickShrinkWindow: function() {
		this.parent.app.dialog.shrink();
	},

	onClickGrowWindow: function() {
		this.parent.app.dialog.grow();
	},

	onClickExpandWindow: function() {
		this.parent.app.expand();
	},

	//
	// desktop event handling methods
	//

	onClickPrevSpace: function() {
		this.parent.app.prevSpace();
	},

	onClickNextSpace: function() {
		this.parent.app.nextSpace();
	},

	onClickMinimizeAll: function() {
		if (this.hasParentView('desktop')) {
			this.getParentView('desktop').getChildView('modals').minimizeAll();
		}
	},

	onClickUnminimizeAll: function() {
		if (this.hasParentView('desktop')) {
			this.getParentView('desktop').getChildView('footer tasks').unminimizeAll();
		}
	},

	onClickViewFullScreen: function() {
		application.toggleFullScreen();
	},
	
	//
	// preference mouse event handling methods
	//

	onClickViewPreferences: function() {
		if (this.show_settings_manager != false) {
			this.showSettingsManager();
		} else {
			this.parent.app.showPreferencesDialog();
		}
	}
});