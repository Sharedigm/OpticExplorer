/******************************************************************************\
|                                                                              |
|                                 id3-data-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing an audio file's id3 data.        |
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

export default BaseView.extend({

	//
	// attributes
	//
	
	className: 'item-list',

	template: template(`
		<% if (id3 && Object.keys(id3).length > 0) { %>
		<% let keys = Object.keys(id3).sort(); %>
		<% for (let i = 0; i < keys.length; i++) { %>
		<% let key = keys[i]; %>
		
		<% let icon = 'fa fa-info-circle'; %>
		<% if (key == 'album') { icon = 'fa fa-folder'; } %>
		<% if (key == 'artist') { icon = 'fa fa-user'; } %>
		<% if (key == 'band') { icon = 'fa fa-users'; } %>
		<% if (key == 'comment') { icon = 'fa fa-comment'; } %>
		<% if (key == 'composer') { icon = 'fa fa-magic'; } %>
		<% if (key == 'encoded_by') { icon = 'fa fa-compress'; } %>
		<% if (key == 'genre') { icon = 'fa fa-tags'; } %>
		<% if (key == 'length') { icon = 'fa fa-clock'; } %>
		<% if (key == 'part_of_a_set') { icon = 'fa fa-object-group'; } %>
		<% if (key == 'publisher') { icon = 'fa fa-money-bill'; } %>
		<% if (key == 'title') { icon = 'fa fa-font'; } %>
		<% if (key == 'track_number') { icon = 'fa fa-list'; } %>
		<% if (key == 'year') { icon = 'fa fa-calendar-alt'; } %>
		
		<% let value = id3[key]; %>
		<% if (typeof value == 'string' && value.length < 64) { %>
		<div class="item">
			<div class="info">
				<div class="icon">
					<i class="<%= icon %>"></i>
				</div>
				<label><%= key.toTitleCase().replace(/_/g,' ') %></label>
				<span class="name"><%= value %></span>
			</div>
		</div>
		<% } %>
		<% } %>
		<% } else { %>
		<div class="item">
			<div class="info">
				<span class="name">No ID3 data.</span>
			</div>
		</div>
		<% } %>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			id3: this.model? this.model.get('id3') : null
		};
	}
});