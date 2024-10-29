/******************************************************************************\
|                                                                              |
|                             help-section-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for viewing help sections.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import HelpPageView from '../../../../views/apps/help-viewer/mainbar/help-page-view.js';

export default HelpPageView.extend({

	//
	// attributes
	//

	template: template(`
		<h1>
			<%= icon %>
			<%= name %>
		</h1>
		
		<ol class="breadcrumb">
			<li><a href="#help"><i class="fa fa-question-circle"></i>Help</a></li>
			<li><%= icon %></i><%= name %></li>
		</ol>
		
		<div class="content">
			<div class="attention icon"><%= icon %></div>
			<h2 id="table-of-contents">Contents:</h2>
			<ol class="table-of-contents">
			<% for (let i = 0; i < items.length; i++) { %>
			<% let item = items[i]; %>
			<li>
				<a href="<%= item.get('url') %>">
					<%= item.get('icon') %>
					<%= item.get('name') %>
				</a>
			</li>
			<% } %>
			</ol>
		</div>
	`),

	events: {
		'click a:not(.lightbox)': 'onClickLink'
	},

	//
	// mouse event handling methods
	//

	onClickLink: function(event) {
		let url = $(event.target).attr('href');

		// check for callback
		//
		if (this.options.onclicklink) {

			// suppress default link handling
			//
			event.preventDefault();

			// perform callback
			//
			this.options.onclicklink(url);
		}
	}
});