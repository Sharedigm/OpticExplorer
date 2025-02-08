/******************************************************************************\
|                                                                              |
|                              not-found-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the 404 / file not found view of the application.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import BaseView from '../../../../../views/base-view.js';
import SearchResultsView from '../../../../../views/apps/search-viewer/mainbar/results/search-results-view.js';
import QueryString from '../../../../../utilities/web/query-string.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<h1><i class="fa fa-search"></i>Search Results</h1>
		<div class="search-results"></div>

		<% if (config.defaults.search.credits) { %>
		<div class="credits well">
			<% if (config.defaults.search.credits.text) { %>
			<div style="margin-bottom: 10px"><%= config.defaults.search.credits.text %></div>
			<% } %>

			<% if (config.defaults.search.credits.list) { %>
			<ul>
			<% for (let i = 0; i < config.defaults.search.credits.list.length; i++) { %>
				<li><%= config.defaults.search.credits.list[i] %></li>
			<% } %>
			</ul>
			<% } %>
		</div>
		<% } %>
	`),

	regions: {
		results: {
			el: '.search-results',
			replaceElement: true
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.showResults();
	},

	showResults: function() {
		let preferences = UserPreferences.create('search_viewer');

		this.showChildView('results', new SearchResultsView({
			query: QueryString.value('query'),

			// options
			//
			search_kind: config.defaults.search.kind,
			view_kind: preferences.get('view_kind'),
			items_per_page: preferences.get('items_per_page'),
			detail_kind: preferences.get('detail_kind'),
			date_format: preferences.get('date_format'),
			show_thumbnails: 'true',

			// callbacks
			//
			onsearch: () => {

				// go to welcome view
				//
				application.navigate('#', {
					trigger: true
				});
			}
		}));
	}
});