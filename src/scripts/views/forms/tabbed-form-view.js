/******************************************************************************\
|                                                                              |
|                             tabbed-form-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a form having multiple tabs.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	tabs: [
	],

	template: template(`
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

	//
	// querying methods
	//

	hasTabNamed: function(tabName) {
		return this.$el.find('.' + tabName + '.tab').length > 0;
	},

	//
	// getting methods
	//

	getTabNamed: function(tabName) {
		return this.$el.find('.' + tabName + '.tab');
	},

	getPaneNamed: function(tabName) {
		return this.$el.find('.' + tabName + '.tab-pane');
	},

	getActiveIndex: function() {
		let tabs = this.$el.find('.tab');
		let activeTab = this.$el.find('.active.tab');
		return tabs.index(activeTab);
	},

	getActiveTabName: function() {
		let activeTab = this.$el.find('li.active');
		let className = activeTab.attr('class');
		let tabName = className.replace('-tab', '').replace('active', '').trim();
		return tabName;
	},

	getValues: function() {
		let values = {};
		for (let i = 0; i < this.tabs.length; i++) {
			let tab = this.tabs[i];
			let region = tab.name.toLowerCase().replace(/ /g, '_');
			values = _.extend(values, this.getChildView(region).getValues());
		}
		return values;
	},

	//
	// setting methods
	//

	setActiveIndex: function(index) {
		let tabs = this.$el.find('.tab');
		let panes = this.$el.find('.tab-pane');

		if (tabs.length < index - 1) {
			return;
		}

		// set active tab
		//
		tabs.removeClass('active');
		$(tabs[index]).addClass('active');

		// set active pane
		//
		panes.removeClass('active');
		$(panes[index]).addClass('active');
	},

	setActiveTabName: function(tabName) {
		if (this.hasTabNamed(tabName)) {
			this.$el.find('.active').removeClass('active');
			this.getTabNamed(tabName).addClass('active');
			this.getPaneNamed(tabName).addClass('active');
		}
	},
	
	//
	// rendering methods
	//
	
	regions: function() {
		let regions = {};
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
			tabs: this.tabs,
			active: this.options.tab
		};
	},

	onRender: function() {
		let keys = Object.keys(this.regions);
		for (let i = 0; i < keys.length; i++) {
			this.showTab(keys[i]);
		}
	},

	//
	// hiding / showing methods
	//

	hideTab: function(name) {
		this.$el.find('.' + name + '-tab').hide();
	},

	showTab: function(name) {
		this.$el.find('.' + name + '-tab').show();
	}
});