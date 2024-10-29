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
		
		<li role="presentation" class="view-kind">
			<a class="view-lists"><i class="fa fa-check"></i><i class="fa fa-list"></i>Lists</a>
		</li>
		
		<li role="presentation" class="view-kind">
			<a class="view-cards"><i class="fa fa-check"></i><i class="fa fa-id-card"></i>Cards</a>
		</li>
		
		<li role="presentation" class="view-kind">
			<a class="view-tiles"><i class="fa fa-check"></i><i class="fa fa-th-large"></i>Tiles</a>
		</li>
		
		<li role="separator" class="divider"></li>

		<li role="presentation" class="show-toolbars dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-wrench"></i>Toolbars<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="show-toolbar dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation" class="option">
					<a class="show-tasks-bar"><i class="fa fa-check"></i><i class="fa fa-circle-check"></i>Tasks</a>
				</li>
			</ul>
		</li>

		<li role="presentation" class="hidden-xs dropdown dropdown-submenu">
			<a class="show-sidebar dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-pause"></i>Sidebar<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="show-sidebar-panels dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation">
					<a class="show-project-info-panel"><i class="fa fa-check"></i><i class="fa fa-info-circle"></i>Project Info</a>
				</li>
		
				<li role="presentation">
					<a class="show-projects-panel"><i class="fa fa-check"></i><i class="fa fa-hashtag"></i>Projects</a>
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
					<a class="view-sidebar-cards"><i class="fa fa-check"></i><i class="fa fa-id-card"></i>Cards</a>
				</li>
		
				<li role="presentation" class="sidebar-view-kind">
					<a class="view-sidebar-tiles"><i class="fa fa-check"></i><i class="fa fa-th-large"></i>Tiles</a>
				</li>
			</ul>
		</li>

		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="view-details dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-tags"></i>Details<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation" type="detail-kind">
					<a class="view-priority"><i class="fa fa-check"></i><i class="fa fa-star"></i>Priority</a>
				</li>
		
				<li role="presentation" class="dropdown dropdown-submenu">
					<a class="view-date dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-calendar-alt"></i>Date<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
					<ul class="dropdown-menu" data-toggle="dropdown-menu">
						<li role="presentation" type="detail-kind">
							<a class="view-create-date"><i class="fa fa-check"></i><i class="fa fa-magic"></i>Create Date</a>
						</li>
		
						<li role="presentation" type="detail-kind">
							<a class="view-update-date"><i class="fa fa-check"></i><i class="fa fa-edit"></i>Update Date</a>
						</li>
		
						<li role="presentation" type="detail-kind">
							<a class="view-due-date"><i class="fa fa-check"></i><i class="fa fa-calendar"></i>Due Date</a>
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
		'click .show-options': 'onClickOption',
		'click .show-sidebar': 'onClickOption',
		'click .show-sidebar-panels > a': 'onClickShowSideBarPanel',
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
	// querying mehods
	//

	enabled: function() {
		return this.parent.app.model != undefined;
	},

	selected: function() {
		let preferences = this.parent.app.preferences;
		let viewKind = preferences.get('view_kind');
		let toolbars = preferences.get('toolbars') || [];
		let detailKind = preferences.get('detail_kind');
		let dateFormat = preferences.get('date_format');
		let sidebarPanels = preferences.get('sidebar_panels') || [];
		let sidebarViewKind = preferences.get('sidebar_view_kind');

		return {

			// item options
			//
			'view-icons': viewKind == 'icons',
			'view-names': viewKind == 'names',
			'view-lists': !viewKind || viewKind == 'lists',
			'view-trees': viewKind == 'trees',
			'view-cards': viewKind == 'cards',
			'view-tiles': viewKind == 'tiles',

			// detail options
			//
			'view-details': typeof detailKind == 'string' && detailKind != '',
			'view-priority': detailKind == 'priority',
			'view-create-date': detailKind == 'create_date',
			'view-update-date': detailKind == 'update_date',
			'view-due-date': detailKind == 'due_date',

			// date options
			//
			'view-date-only': dateFormat == 'date_only',
			'view-day-date': dateFormat == 'day_date',
			'view-time-only': dateFormat == 'time_only',
			'view-date-time': dateFormat == 'date_time',
			'view-day-date-time': dateFormat == 'day_date_time' || !dateFormat,

			// viewing options
			//
			'show-comments': preferences.get('show_comments'),
			'show-options': preferences.get('show_options'),

			// toolbar options
			//
			'show-toolbars': toolbars.length > 0,
			'show-tasks-bar': toolbars.includes('tasks'),

			// sidebar options
			//
			'show-sidebar': preferences.get('show_sidebar'),
			'show-info-panel': sidebarPanels.includes('info'),
			'show-projects-panel': sidebarPanels.includes('projects'),

			// sidebar item options
			//
			'view-sidebar-icons': sidebarViewKind == 'icons',
			'view-sidebar-lists': sidebarViewKind == 'lists',
			'view-sidebar-cards': sidebarViewKind == 'cards',
			'view-sidebar-tiles': sidebarViewKind == 'tiles'
		};	
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			language: this.parent.app.preferences.get('language'),
			languages: application.session.get('config').languages
		};
	},

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
		this.setEnabled(this.enabled());
	},

	//
	// view option event handling methods
	//

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

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		$(document).off('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange');
	}
});