/******************************************************************************\
|                                                                              |
|                              desktop-settings.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a set of desktop settings.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserSettings from '../../models/settings/user-settings.js';
import ImageFile from '../../models/storage/media/image-file.js';
import Browser from '../../utilities/web/browser.js';

export default UserSettings.extend({

	//
	// attributes
	//

	category: Browser.device != 'desktop'? Browser.device + '_' + 'desktop' : 'desktop',
	defaults: UserSettings.toKeyValuePairs(_.extend({}, config.defaults.desktop.preferences, config.theme.desktop), Browser.device),

	//
	// constructor
	//

	initialize: function() {

		// listen for changes
		//
		this.on('change', this.onChange);
	},

	//
	// getting methods
	//

	getBackgroundUrl: function() {
		if (this.has('background_image')) {
			let path = this.get('background_image');

			// determine if background image is accessible to current user
			//
			if (application.session.user && application.session.user.isCurrent() || path.startsWith(config.apps.file_browser.shared_directory)) {
				let model = new ImageFile({
					path: path
				});
				return model.getUrl();
			}
		}
	},
	
	//
	// setting methods
	//

	apply: function(view) {
		if (!view && !this.view) {
			return;
		}

		// set attributes
		//
		if (view) {
			this.view = view;
		} else {
			view = this.view;
		}

		// update view
		//
		if (view) {

			// set background settings
			//
			if (this.has('background_image')) {
				view.setBackgroundUrl(this.getBackgroundUrl());
			}
			if (this.has('background_size') || this.has('background_repeats')) {
				view.setBackgroundSize(this.has('background_image')? this.get('background_size') : 'none', this.get('background_repeats'));
			}
			if (this.has('background_color')) {
				view.setBackgroundColor(this.get('background_color'));
			}

			// set desktop settings
			//
			if (this.has('desktop_theme')) {
				view.setDesktopTheme(this.get('desktop_theme'));
			}
			if (this.has('launcher_style')) {
				view.setLauncherStyle(this.get('launcher_style'));
			}
			if (this.has('run_menu_items')) {
				view.setRunMenuItems(this.get('run_menu_items'));
			}
			if (this.has('run_menu_corners')) {
				view.setRunMenuCorners(this.get('run_menu_corners'));
			}
			if (this.has('run_menu_attached')) {
				view.setRunMenuAttached(this.get('run_menu_attached'));
			}
			if (this.has('run_menu_autohide')) {
				view.setRunMenuAutohide(this.get('run_menu_autohide'));
			}
			if (this.has('taskbar_alignment')) {
				view.setTaskBarAlignment(this.get('taskbar_alignment'));
			}
			if (this.has('taskbar_handles')) {
				view.setTaskBarHandles(this.get('taskbar_handles'));
			}
			if (this.has('taskbar_minimized')) {
				view.setTaskBarMinimized(this.get('taskbar_minimized'));
			}
			if (this.has('dock_tilt')) {
				view.setDockTilt(this.get('dock_tilt'));
			}
			if (this.has('dock_corners')) {
				view.setDockCorners(this.get('dock_corners'));
			}
			if (this.has('dock_attached')) {
				view.setDockAttached(this.get('dock_attached'));
			}

			// set desktop sidebar settings
			//
			if (this.has('desktop_sidebar_transparency')) {
				view.setSideBarTransparency(this.get('desktop_sidebar_transparency'));
			}
			if (this.has('desktop_sidebar_panels')) {
				view.setSideBarPanels(this.get('desktop_sidebar_panels'));
			}

			// set desktop options
			//
			if (this.has('show_app_name')) {
				view.setShowAppName(this.get('show_app_name'));
			}
			if (this.has('show_clock')) {
				view.setShowClock(this.get('show_clock'));
			}
			if (this.has('show_led_time')) {
				if (view.clockView) {
					view.clockView.setShowLEDTime(this.get('show_led_time'));
				}
			}
			if (this.has('show_trash_in_corner')) {
				view.setShowTrashInCorner(this.get('show_trash_in_corner'));
			}
			if (this.has('show_app_info')) {
				view.setShowAppInfo(this.get('show_app_info'));
			}
		}
	},

	reapply: function(view) {
		if (!view && !this.view) {
			return;
		}

		// set attributes
		//
		if (view) {
			this.view = view;
		} else {
			view = this.view;
		}

		// update child views
		//
		view.update();

		// update view
		//
		if (view) {

			// update background settings
			//
			if (this.changed.background_image !== undefined) {
				view.setBackgroundUrl(this.getBackgroundUrl());
			}
			if (this.changed.background_image !== undefined ||
				this.changed.background_size !== undefined || 
				this.changed.background_repeats !== undefined) {
				view.setBackgroundSize(this.has('background_image')? this.get('background_size') : 'none', this.get('background_repeats'));
			}
			if (this.changed.background_color !== undefined) {
				view.setBackgroundColor(this.get('background_color'));
			}
			if (this.changed.desktop_app !== undefined) {
				view.loadApp(this.get('desktop_app'));
			}

			// update desktop settings
			//
			if (this.changed.desktop_theme !== undefined) {
				view.setDesktopTheme(this.get('desktop_theme'));
			}
			if (this.changed.launcher_style !== undefined) {
				view.setLauncherStyle(this.get('launcher_style'));
			}
			if (this.changed.run_menu_items !== undefined) {
				view.setRunMenuItems(this.get('run_menu_items'));
			}
			if (this.changed.run_menu_corners !== undefined) {
				view.setRunMenuCorners(this.get('run_menu_corners'));
			}
			if (this.changed.run_menu_attached !== undefined) {
				view.setRunMenuAttached(this.get('run_menu_attached'));
			}
			if (this.changed.run_menu_autohide !== undefined) {
				view.setRunMenuAutohide(this.get('run_menu_autohide'));
			}
			if (this.changed.taskbar_alignment !== undefined) {
				view.setTaskBarAlignment(this.get('taskbar_alignment'));
			}
			if (this.changed.taskbar_handles !== undefined) {
				view.setTaskBarHandles(this.get('taskbar_handles'));
			}
			if (this.changed.taskbar_minimized !== undefined) {
				view.setTaskBarMinimized(this.get('taskbar_minimized'));
			}
			if (this.changed.dock_tilt !== undefined) {
				view.setDockTilt(this.get('dock_tilt'));
			}
			if (this.changed.dock_corners !== undefined) {
				view.setDockCorners(this.get('dock_corners'));
			}
			if (this.changed.dock_attached !== undefined) {
				view.setDockAttached(this.get('dock_attached'));
			}

			// update desktop sidebar settings
			//
			if (this.changed.desktop_sidebar_transparency !== undefined) {
				view.setSideBarTransparency(this.get('desktop_sidebar_transparency'));
			}
			if (this.changed.desktop_sidebar_panels !== undefined) {
				view.setSideBarPanels(this.get('desktop_sidebar_panels'));
			}

			// update desktop options
			//
			if (this.changed.show_app_name !== undefined) {
				view.setShowAppName(this.get('show_app_name'));
			}
			if (this.changed.show_clock !== undefined) {
				view.setShowClock(this.get('show_clock'));
			}
			if (this.has('show_led_time')) {
				if (view.clockView) {
					view.clockView.setShowLEDTime(this.get('show_led_time'));
				}
			}
			if (this.changed.show_trash_in_corner !== undefined) {
				view.setShowTrashInCorner(this.get('show_trash_in_corner'));
			}
			if (this.changed.show_app_info !== undefined) {
				view.setShowAppInfo(this.get('show_app_info'));
			}
		}
	},

	//
	// saving methods
	//

	save: function(attributes, options) {

		// round background repeat or unset
		//
		if (this.get('background_size') == 'tile') {
			this.set({
				background_repeat: Math.round(this.get('background_repeat'))
			});
		} else {
			this.unset('background_repeat');
		}

		// call superclass method
		//
		UserSettings.prototype.save.call(this, attributes, options);

		// set background repeat to default
		//
		if (this.get('background_size') != 'tile') {
			this.set({
				background_repeat: this.defaults.background_repeat
			});	
		}
	},

	//
	// event handling methods
	//

	onChange: function() {

		// apply to view
		//
		if (this.view && this.view.isRendered()) {
			this.reapply(this.view);
		}
	}
});