/******************************************************************************\
|                                                                              |
|                              status-bar-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing an app's menu bar.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';
import DesktopToolbarView from '../../../../../views/apps/desktop/toolbar/desktop-toolbar-view.js';
import ClockBarView from '../../../../../views/apps/desktop/header-bar/status-bar/clock-bar/clock-bar-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'status',

	template: template(`
		<div class="tools"></div>
		<div class="clock"></div>
	`),

	regions: {
		tools: {
			el: '.tools',
			replaceElement: true
		},
		clock: {
			el: '.clock',
			replaceElement: true
		}
	},

	onRender: function() {
		let settings = application.desktop? application.desktop.settings : undefined;
		let launcherStyle = settings? settings.get('launcher_style') : undefined;

		// show child views
		//
		if (launcherStyle != 'taskbar') {
			this.showToolbar();
		}
		if (settings && settings.get('show_clock') != false) {
			this.showClock();
		}

		// add tooltip triggers
		//
		this.addTooltips({
			placement: launcherStyle == 'taskbar'? 'top' : 'bottom',
			container: 'body'
		});
	},

	showToolbar: function() {
		this.showChildView('tools', new DesktopToolbarView());
	},

	showClock: function() {
		this.showChildView('clock', new ClockBarView({
			show_day: application.desktop.settings.get('show_day'),
			show_date: application.desktop.settings.get('show_date'),
			show_time: application.desktop.settings.get('show_time'),
			show_24hr: application.desktop.settings.get('show_24hr'),
			show_seconds: application.desktop.settings.get('show_seconds'),
			show_led_time: application.desktop.settings.get('show_led_time'),
		}));
	}
});