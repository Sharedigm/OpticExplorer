/******************************************************************************\
|                                                                              |
|                         desktop-settings-form-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for viewing and editing theme settings.           |
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
import BackgroundPanelView from '../../../../../views/apps/theme-manager/mainbar/desktop/panels/background-panel-view.js';
import LauncherPanelView from '../../../../../views/apps/theme-manager/mainbar/desktop/panels/launcher-panel-view.js';
import ClockPanelView from '../../../../../views/apps/theme-manager/mainbar/desktop/panels/clock-panel-view.js';
import DesktopSidebarPanelView from '../../../../../views/apps/theme-manager/mainbar/desktop/panels/desktop-sidebar-panel-view.js';
import DesktopOptionsPanelView from '../../../../../views/apps/theme-manager/mainbar/desktop/panels/desktop-options-panel-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	tagName: 'form',
	className: 'form-vertical',

	template: template(`
		<div class="tabs vertical">
			<ul class="nav nav-tabs secondary side collapsed-xs" role="tablist">
		
				<li role="presentation" name="background"<% if (tab == 'background' || !tab) { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".background.tab-pane">
						<i class="fa fa-image"></i>
						<label>Background</label>
					</a>
				</li>
		
				<li role="presentation" name="launcher"<% if (tab == 'launcher') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".launcher.tab-pane">
						<i class="fa fa-rocket"></i>
						<label>Launcher</label>
					</a>
				</li>
		
				<li role="presentation" name="clock"<% if (tab == 'clock') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".clock.tab-pane">
						<i class="fa fa-clock"></i>
						<label>Clock</label>
					</a>
				</li>
		
				<li role="presentation" name="options"<% if (tab == 'desktop_sidebar') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".desktop-sidebar.tab-pane">
						<i class="fa fa-pause"></i>
						<label>Sidebar</label>
					</a>
				</li>
		
				<li role="presentation" name="options"<% if (tab == 'desktop_options') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".desktop-options.tab-pane">
						<i class="fa fa-info-circle"></i>
						<label>Options</label>
					</a>
				</li>
			</ul>
		
			<div class="tab-content">
				<div role="tabpanel" class="background tab-pane<% if (tab == 'background' || !tab) { %> active<% } %>"></div>
		
				<div role="tabpanel" class="launcher tab-pane<% if (tab == 'launcher') { %> active<% } %>"></div>
		
				<div role="tabpanel" class="clock tab-pane<% if (tab == 'clock') { %> active<% } %>"></div>
		
				<div role="tabpanel" class="desktop-sidebar tab-pane<% if (tab == 'desktop_sidebar') { %> active<% } %>"></div>
		
				<div role="tabpanel" class="desktop-options tab-pane<% if (tab == 'desktop_options') { %> active<% } %>"></div>
			</div>
		</div>
	`),

	regions: {
		background: '.background',
		launcher: '.launcher',
		clock: '.clock',
		sidebar: '.desktop-sidebar',
		options: '.desktop-options'
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			tab: this.options.tab
		};
	},

	onRender: function() {

		// show child views
		//
		this.showChildView('background', new BackgroundPanelView());
		this.showChildView('launcher', new LauncherPanelView());
		this.showChildView('clock', new ClockPanelView());
		this.showChildView('sidebar', new DesktopSidebarPanelView());
		this.showChildView('options', new DesktopOptionsPanelView());
	}
});
