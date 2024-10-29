/******************************************************************************\
|                                                                              |
|                         dialog-settings-form-view.js                         |
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
import DialogColorsPanelView from '../../../../../views/apps/theme-manager/mainbar/dialogs/panels/dialog-colors-panel-view.js';
import DialogShapesPanelView from '../../../../../views/apps/theme-manager/mainbar/dialogs/panels/dialog-shapes-panel-view.js';
import DialogHeadersPanelView from '../../../../../views/apps/theme-manager/mainbar/dialogs/panels/dialog-headers-panel-view.js';
import DialogButtonsPanelView from '../../../../../views/apps/theme-manager/mainbar/dialogs/panels/dialog-buttons-panel-view.js';
import DialogEffectsPanelView from '../../../../../views/apps/theme-manager/mainbar/dialogs/panels/dialog-effects-panel-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	tagName: 'form',
	className: 'form-vertical',

	template: template(`
		<div class="tabs vertical">
			<ul class="nav nav-tabs secondary side collapsed-xs" role="tablist">
		
				<li role="presentation" name="dialog-colors"<% if (tab == 'colors' || !tab) { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".dialog-colors.tab-pane">
						<i class="fa fa-paint-brush"></i>
						<label>Colors</label>
					</a>
				</li>
		
				<li role="presentation" name="dialog-shapes"<% if (tab == 'shapes') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".dialog-shapes.tab-pane">
						<i class="fa fa-square"></i>
						<label>Shapes</label>
					</a>
				</li>
		
				<li role="presentation" name="dialog-headers"<% if (tab == 'headers') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".dialog-headers.tab-pane">
						<i class="fa fa-window-maximize"></i>
						<label>Headers</label>
					</a>
				</li>
		
				<li role="presentation" name="dialog-buttons"<% if (tab == 'buttons') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".dialog-buttons.tab-pane">
						<i class="fa fa-window-close"></i>
						<label>Buttons</label>
					</a>
				</li>
		
				<li role="presentation" name="effects-buttons"<% if (tab == 'effects') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".dialog-effects.tab-pane">
						<i class="fa fa-video"></i>
						<label>Effects</label>
					</a>
				</li>
			</ul>
		
			<div class="tab-content">
				<div role="tabpanel" class="dialog-colors tab-pane<% if (tab == 'colors' || !tab) { %> active<% } %>"></div>
		
				<div role="tabpanel" class="dialog-shapes tab-pane<% if (tab == 'shapes') { %> active<% } %>"></div>
		
				<div role="tabpanel" class="dialog-headers tab-pane<% if (tab == 'headers') { %> active<% } %>"></div>
		
				<div role="tabpanel" class="dialog-buttons tab-pane<% if (tab == 'buttons') { %> active<% } %>"></div>
		
				<div role="tabpanel" class="dialog-effects tab-pane<% if (tab == 'effects') { %> active<% } %>"></div>
			</div>
		</div>
	`),

	regions: {
		colors: '.dialog-colors',
		shapes: '.dialog-shapes',
		headers: '.dialog-headers',
		buttons: '.dialog-buttons',
		effects: '.dialog-effects'
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
		this.showChildView('colors', new DialogColorsPanelView());
		this.showChildView('shapes', new DialogShapesPanelView());
		this.showChildView('headers', new DialogHeadersPanelView());
		this.showChildView('buttons', new DialogButtonsPanelView());
		this.showChildView('effects', new DialogEffectsPanelView());
	}
});
