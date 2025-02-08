/******************************************************************************\
|                                                                              |
|                          preferences-group-view.js                           |
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

import App from '../../../../models/apps/app.js';
import Apps from '../../../../collections/apps/apps.js';
import PreferencesFormView from '../../../../views/apps/common/forms/preferences-form-view.js';
import AppIconsView from '../../../../views/apps/common/items/icons/app-icons-view.js';

export default PreferencesFormView.extend({

	//
	// attributes
	//

	className: 'preferences form-vertical',

	template: template(`
		<div class="app-icons"></div>

		<% if (typeof tabs != 'undefined') { %>
		<ul class="nav nav-tabs" role="tablist">
			<% for (let i = 0; i < tabs.length; i++) { %>
			<% let tab = tabs[i]; %>
			<% let name = tab.name; %>
			<% let icon = tab.icon; %>
			<% let className = name.toLowerCase().replace(/ /g, '-'); %>
			<li role="presentation" class="<%= className %>-tab<% if (i == 0) { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".<%= className %>-prefs">
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
			<div role="tabpanel" class="<%= className %>-prefs tab-pane<% if (i == 0) { %> active<% } %>">
			</div>
			<% } %>
		</div>
		<% } %>
	`),

	tabs: [],

	//
	// form queryimg methods
	//

	hasChanged: function() {

		// check for change from any child view
		//
		let childNames = Object.keys(this.regions);
		for (let i = 0; i < childNames.length; i++) {
			let childView = this.getChildView(childNames[i]);
			if (childView.hasChanged && childView.hasChanged()) {
				return true;
			}
		}
		return false;
	},

	getValues: function() {

		// concatenate values from all child views
		//
		let values = {};
		let childNames = Object.keys(this.regions);
		for (let i = 0; i < childNames.length; i++) {
			let childView = this.getChildView(childNames[i]);
			if (childView && childView.getValues) {
				values = _.extend(values, childView.getValues());
			}
		}
		return values;
	},

	//
	// form methods
	//

	setOption: function(key, value) {

		// notify parent
		//
		if (this.options.onchange) {
			this.options.onchange(key, value);
		} else if (this.parent.opener && this.parent.opener.setOption) {
			this.parent.opener.setOption(key, value);
		}

		// update form
		//
		if (this.update) {
			this.update();
		}
	},

	//
	// rendering methods
	//

	regions: function() {
		let regions = {
			item: {
				el: '.app-icons',
				replaceElement: true
			}
		};
		for (let i = 0; i < this.tabs.length; i++) {
			let tab = this.tabs[i];
			let region = tab.name.toLowerCase().replace(/ /g, '_');
			let className = region.replace(/_/g, '-');
			regions[region] = '.' + className + '-prefs';
		}
		return regions;
	},

	templateContext: function() {
		return {
			tab: this.options.tab,
			tabs: this.tabs
		};
	},

	showAppIcon: function(appName) {
		this.showChildView('item', new AppIconsView({
			collection: new Apps(new App(
				config.apps[appName]
			)),

			// capabilities
			//
			selectable: false
		}));
	},

	update: function() {

		// show / hide sidebar tab
		//
		if (this.hasChildView('display')) {
			if (this.getChildView('display').getValue('show_sidebar')) {
				this.$el.find('.sidebar-tab').show();
			} else {
				this.$el.find('.sidebar-tab').hide();
			}
		}
	}
});