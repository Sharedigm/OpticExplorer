/******************************************************************************\
|                                                                              |
|                          theme-settings-form-view.js                         |
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

import BaseView from '../../../../views/base-view.js';
import AppearanceSettingsFormView from '../../../../views/apps/theme-manager/mainbar/appearance/appearance-settings-form-view.js';
import DesktopSettingsFormView from '../../../../views/apps/theme-manager/mainbar/desktop/desktop-settings-form-view.js';
import ControlSettingsFormView from '../../../../views/apps/theme-manager/mainbar/controls/control-settings-form-view.js';
import DialogSettingsFormView from '../../../../views/apps/theme-manager/mainbar/dialogs/dialog-settings-form-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'content',

	template: template(`
		<ul class="nav nav-tabs" role="tablist">
		
			<li role="presentation" class="theme-tab<% if (tab == 'appearance' || !tab) { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".appearance-settings">
					<i class="fa fa-eye"></i>
					<label>General</label>
				</a>
			</li>
		
			<li role="presentation" class="desktop-tab<% if (tab == 'desktop') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".desktop-settings">
					<i class="fa fa-desktop"></i>
					<label>Desktop</label>
				</a>
			</li>
		
			<li role="presentation" class="controls-tab<% if (tab == 'controls') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".control-settings">
					<i class="fa fa-sliders-h"></i>
					<label>Controls</label>
				</a>
			</li>
		
			<li role="presentation" class="dialogs-tab<% if (tab == 'dialogs') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".dialog-settings">
					<i class="far fa-window-maximize"></i>
					<label>Dialogs</label>
				</a>
			</li>
		</ul>
		
		<div class="tab-content">
		
			<div role="tabpanel" class="appearance-settings tab-pane<% if (tab == 'appearence' || !tab) { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="desktop-settings tab-pane<% if (tab == 'desktop') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="control-settings tab-pane<% if (tab == 'controls') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="dialog-settings tab-pane<% if (tab == 'dialogs') { %> active<% } %>">
			</div>
		</div>
	`),

	regions: {
		appearance: '.appearance-settings',
		desktop: '.desktop-settings',
		controls: '.control-settings',
		dialogs: '.dialog-settings'
	},

	//
	// constructor
	//

	initialize: function() {

		// listen to models for changes
		//
		this.listenTo(this.options.settings.theme, 'change', this.onChange, this);
		this.listenTo(this.options.settings.controls, 'change', this.onChange, this);
		this.listenTo(this.options.settings.desktop, 'change', this.onChange, this);	
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			tab: this.options.tab,
			show_clock: this.options.settings.desktop.get('show_clock')
		};
	},

	onRender: function() {

		// show child views
		//
		this.showChildView('appearance', new AppearanceSettingsFormView({
			tab: this.options.tab == 'appearance'? this.options.tab2 : undefined
		}));
		this.showChildView('desktop', new DesktopSettingsFormView({
			tab: this.options.tab == 'desktop'? this.options.tab2 : undefined
		}));
		this.showChildView('controls', new ControlSettingsFormView({
			tab: this.options.tab == 'controls'? this.options.tab2 : undefined
		}));
		this.showChildView('dialogs', new DialogSettingsFormView({
			tab: this.options.tab == 'dialogs'? this.options.tab2 : undefined
		}));
	},

	//
	// event handling methods
	//

	onChange: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	}
});
