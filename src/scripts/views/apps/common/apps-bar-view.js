/******************************************************************************\
|                                                                              |
|                               apps-bar-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an icon bar that allows selection of an app.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import AppsView from '../../../views/apps/common/apps-view.js';

export default AppsView.extend({

	//
	// attributes
	//

	tagName: 'ul',
	className: 'apps nav navbar-nav navbar-right hidden-xxs',

	template: template(`
		<% for (let i = 0; i < apps.length; i++) { %>
		<% let color = colors[i]; %>
		<% if (color == 'white') { color = 'cyan' } %>
		<li class="toolbar-app">
			<a name="<%= apps[i] %>"<% if (typeof colors != 'undefined') { %> class="colored opaque <%= color %>"<% } %>  data-toggle="tooltip" title="<%= names[i] %>">
				<i class="<%= icons[i] %>"></i>
			</a>
		</li>
		<% } %>
	`),

	events: {
		'click a': 'onClickLink'
	},

	tooltips: {
		placement: 'bottom',
		container: 'body'
	},

	//
	// setting methods
	//

	setCurrent: function(appName) {
		let index = this.options.apps.indexOf(appName);
		this.setCurrentIndex(index);
	},

	setCurrentIndex: function(index) {
		this.$el.find('.current').removeClass('current');
		$(this.$el.find('li')[index]).addClass('current');
	},

	//
	// rendering methods
	//

	onRender: function() {

		// set current item
		//
		if (this.options.current) {
			this.setCurrent(this.options.current);
		}

		// add tooltip triggers
		//
		this.addTooltips();
	},

	//
	// mouse event handling methods
	//

	onClickLink: function(event) {
		let name = $(event.target).closest('a').attr('name');

		// perform callback
		//
		if (this.options.onselect) {
			this.options.onselect(name);
		}
	}
});