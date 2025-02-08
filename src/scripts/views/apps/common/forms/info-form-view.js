/******************************************************************************\
|                                                                              |
|                               info-form-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract base class for form views.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TabbedFormView from '../../../../views/forms/tabbed-form-view.js';

export default TabbedFormView.extend({

	//
	// rendering attributes
	//

	template: template(`
		<% if (item) { %>
		<%= item %>
		<% } %>

		<% if (typeof tabs != 'undefined') { %>
		<ul class="nav nav-tabs" role="tablist">
			<% for (let i = 0; i < tabs.length; i++) { %>
			<% let tab = tabs[i]; %>
			<% let name = tab.name; %>
			<% let icon = tab.icon; %>
			<% let className = name.toLowerCase().replace(/ /g, '-'); %>
			<li role="presentation" class="<%= className %>-tab<% if ((!active && i == 0) || active == className) { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".<%= className %>">
					<i class="<%= icon %>"></i>
					<label><%= name %></label>
				</a>
			</li>
			<% } %>
		</ul>

		<div class="tab-content">
			<% for (let i = 0; i < tabs.length; i++) { %>
			<% let tab = tabs[i]; %>
			<% let name = tab.name; %>
			<% let icon = tab.icon; %>
			<% let className = name.toLowerCase().replace(/ /g, '-'); %>
			<div role="tabpanel" class="<%= className %> tab-pane<% if ((!active && i == 0) || active == className) { %> active<% } %>">
			</div>
			<% } %>
		</div>
		<% } %>
	`),

	item: `
		<div class="items">
			<div class="icon-grid"></div>
		</div>
	`,

	//
	// rendering methods
	//

	regions: function() {
		let regions = {
			item: '.icon-grid'
		};
		for (let i = 0; i < this.tabs.length; i++) {
			let tab = this.tabs[i];
			let region = tab.name.toLowerCase().replace(/ /g, '_');
			let className = region.replace(/_/g, '-');
			regions[region] = '.' + className + '.tab-pane';
		}
		return regions;
	},

	templateContext: function() {
		return {
			item: this.item,
			tabs: this.tabs,
			active: this.options.tab
		};
	},

	onRender: function() {
		this.showRegions();
	}
});