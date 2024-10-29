/******************************************************************************\
|                                                                              |
|                         control-settings-form-view.js                        |
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
import MenusPanelView from '../../../../../views/apps/theme-manager/mainbar/controls/panels/menus-panel-view.js';
import ButtonsPanelView from '../../../../../views/apps/theme-manager/mainbar/controls/panels/buttons-panel-view.js';
import TabsPanelView from '../../../../../views/apps/theme-manager/mainbar/controls/panels/tabs-panel-view.js';
import SlidersPanelView from '../../../../../views/apps/theme-manager/mainbar/controls/panels/sliders-panel-view.js';
import SplittersPanelView from '../../../../../views/apps/theme-manager/mainbar/controls/panels/splitters-panel-view.js';
import ScrollbarsPanelView from '../../../../../views/apps/theme-manager/mainbar/controls/panels/scrollbars-panel-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	tagName: 'form',
	className: 'form-vertical',

	template: template(`
		<div class="tabs vertical">
			<ul class="nav nav-tabs secondary side collapsed-xs" role="tablist">
		
				<li role="presentation" name="menus"<% if (tab == 'menus' || !tab) { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".menu-controls.tab-pane">
						<i class="fa fa-bars"></i>
						<label>Menus</label>
					</a>
				</li>
		
				<li role="presentation" name="buttons"<% if (tab == 'buttons') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".button-controls.tab-pane">
						<i class="fa fa-window-close"></i>
						<label>Buttons</label>
					</a>
				</li>
		
				<li role="presentation" name="tabs"<% if (tab == 'tabs') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".tab-controls.tab-pane">
						<i class="fa fa-th-list"></i>
						<label>Tabs</label>
					</a>
				</li>
		
				<li role="presentation" name="sliders"<% if (tab == 'sliders') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".slider-controls.tab-pane">
						<i class="fa fa-sliders-h"></i>
						<label>Sliders</label>
					</a>
				</li>

				<li role="presentation" name="splitters"<% if (tab == 'sliders') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".splitter-controls.tab-pane">
						<i class="fa fa-grip-lines"></i>
						<label>Splitters</label>
					</a>
				</li>
		
				<li role="presentation" name="scrollbars"<% if (tab == 'scrollbars') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".scrollbar-controls.tab-pane">
						<i class="fa fa-scroll"></i>
						<label>Scrollbars</label>
					</a>
				</li>
			</ul>
		
			<div class="tab-content">
				<div role="tabpanel" class="menu-controls tab-pane<% if (tab == 'menus' || !tab) { %> active<% } %>"></div>
		
				<div role="tabpanel" class="button-controls tab-pane<% if (tab == 'buttons') { %> active<% } %>"></div>
		
				<div role="tabpanel" class="tab-controls tab-pane<% if (tab == 'tabs') { %> active<% } %>"></div>
		
				<div role="tabpanel" class="slider-controls tab-pane<% if (tab == 'sliders') { %> active<% } %>"></div>

				<div role="tabpanel" class="splitter-controls tab-pane<% if (tab == 'splitters') { %> active<% } %>"></div>

				<div role="tabpanel" class="scrollbar-controls tab-pane<% if (tab == 'scrollbars') { %> active<% } %>"></div>
			</div>
		</div>
	`),

	regions: {
		menus: '.menu-controls',
		buttons: '.button-controls',
		tabs: '.tab-controls',
		sliders: '.slider-controls',
		splitters: '.splitter-controls',
		scrollbars: '.scrollbar-controls'
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
		this.showChildView('menus', new MenusPanelView());
		this.showChildView('buttons', new ButtonsPanelView());
		this.showChildView('tabs', new TabsPanelView());
		this.showChildView('sliders', new SlidersPanelView());
		this.showChildView('splitters', new SplittersPanelView());
		this.showChildView('scrollbars', new ScrollbarsPanelView());
	}
});