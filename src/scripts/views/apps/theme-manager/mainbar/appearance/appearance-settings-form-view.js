/******************************************************************************\
|                                                                              |
|                       appearance-settings-form-view.js                       |
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
import ColorsPanelView from '../../../../../views/apps/theme-manager/mainbar/appearance/panels/colors-panel-view.js';
import MaterialsPanelView from '../../../../../views/apps/theme-manager/mainbar/appearance/panels/materials-panel-view.js';
import IconsPanelView from '../../../../../views/apps/theme-manager/mainbar/appearance/panels/icons-panel-view.js';
import TextPanelView from '../../../../../views/apps/theme-manager/mainbar/appearance/panels/text-panel-view.js';
import OptionsPanelView from '../../../../../views/apps/theme-manager/mainbar/appearance/panels/options-panel-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	tagName: 'form',
	className: 'form-vertical',

	template: template(`
		<div class="tabs vertical">
			<ul class="nav nav-tabs secondary side collapsed-xs" role="tablist">
		
				<li role="presentation" name="colors"<% if (tab == 'colors' || !tab) { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".colors.tab-pane">
						<i class="fa fa-paint-brush"></i>
						<label>Colors</label>
					</a>
				</li>
		
				<li role="presentation" name="materials"<% if (tab == 'materials') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".materials.tab-pane">
						<i class="fa fa-cube"></i>
						<label>Materials</label>
					</a>
				</li>
		
				<li role="presentation" name="icons"<% if (tab == 'icons') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".icons.tab-pane">
						<i class="fa fa-icons"></i>
						<label>Icons</label>
					</a>
				</li>
		
				<li role="presentation" name="text"<% if (tab == 'text') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".text.tab-pane">
						<i class="fa fa-font"></i>
						<label>Text</label>
					</a>
				</li>
		
				<li role="presentation" name="options"<% if (tab == 'options') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".options.tab-pane">
						<i class="fa fa-square"></i>
						<label>Options</label>
					</a>
				</li>
			</ul>
		
			<div class="tab-content">
				<div role="tabpanel" class="colors tab-pane<% if (tab == 'colors' || !tab) { %> active<% } %>"></div>
		
				<div role="tabpanel" class="materials tab-pane<% if (tab == 'materials') { %> active<% } %>"></div>
		
				<div role="tabpanel" class="icons tab-pane<% if (tab == 'icons') { %> active<% } %>"></div>
		
				<div role="tabpanel" class="text tab-pane<% if (tab == 'text') { %> active<% } %>"></div>
		
				<div role="tabpanel" class="options tab-pane<% if (tab == 'options') { %> active<% } %>"></div>
			</div>
		</div>
	`),

	regions: {
		colors: '.colors',
		materials: '.materials',
		icons: '.icons',
		text: '.text',
		options: '.options'
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
		this.showChildView('colors', new ColorsPanelView());
		this.showChildView('materials', new MaterialsPanelView());
		this.showChildView('icons', new IconsPanelView());
		this.showChildView('text', new TextPanelView());
		this.showChildView('options', new OptionsPanelView());
	}
});
