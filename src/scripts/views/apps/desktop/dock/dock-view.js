/******************************************************************************\
|                                                                              |
|                                 dock-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for displaying a dock style launch bar.      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';
import DockAppIconsView from '../../../../views/apps/desktop/dock/dock-app-icons/dock-app-icons-view.js';
import DockTaskIconsView from '../../../../views/apps/desktop/dock/dock-task-icons/dock-task-icons-view.js';
import AppLaunchable from '../../../../views/apps/common/behaviors/opening/app-launchable.js';
import Minimizable from '../../../../views/dialogs/behaviors/minimizable.js';
import Browser from '../../../../utilities/web/browser.js';

export default BaseView.extend(_.extend({}, AppLaunchable, {

	//
	// attributes
	//

	className: 'dock',

	template: template(`
		<svg class="defs"><defs></defs></svg>
		<div class="items">
			<div class="apps"></div>
			<div class="tasks"></div>
			<div class="trash"></div>
		</div>
	`), 

	regions: {
		apps: {
			el: '.apps',
			replaceElement: true
		},
		tasks: {
			el: '.tasks',
			replaceElement: true
		}
	},

	events: {
		'tap': 'onTap'
	},

	//
	// svg rendering methods
	//

	fetchSvg: function(path, options) {
		$.ajax(_.extend({}, options, {
			url: path,
			type: 'GET'
		}));
	},

	addWindowSvg: function() {
		this.fetchSvg('images/icons/flat/window.svg', {

			// callbacks
			//
			success: (data) => {
				if (!data.childNodes) {
					return;
				}
				
				// create new svg
				//
				let svg = $(data.childNodes[0]);
				svg.attr('id', 'window-icon');

				// add svg to defs
				//
				this.$el.find('defs').append(svg);
			}
		});
	},

	//
	// rendering methods
	//

	onRender: function() {

		// add window svg to defs
		//
		this.addWindowSvg();

		// show child views
		//
		if (this.options.show_app_icons && config.defaults.desktop.show_app_launcher) {
			this.showAppIcons();
		}
		this.showTaskIcons();
	},

	showAppIcons: function() {
		this.showChildView('apps', new DockAppIconsView({
			collection: application.getVisibleApps()
		}));
	},

	showTaskIcons: function() {
		this.showChildView('tasks', new DockTaskIconsView({
			collection: Minimizable.getMinimized(),

			// callbacks
			//
			onchange: () => this.onChange()
		}));
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.hideTooltips();
		this.showing_tooltips = false;
	},

	//
	// touch event handling methods
	//

	onTap: function() {

		// skip touch events if not touch enabled
		//
		if (!Browser.is_touch_enabled) {
			return;
		}

		// toggle tooltips
		//
		if (!this.showing_tooltips) {
			this.showTooltips({
				trigger: 'manual',
				container: this.parent.el		
			});
			this.showing_tooltips = true;
		} else {
			this.hideTooltips();
			this.showing_tooltips = false;	
		}
	}
}));