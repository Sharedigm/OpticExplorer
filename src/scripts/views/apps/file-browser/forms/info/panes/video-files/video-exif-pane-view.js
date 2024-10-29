/******************************************************************************\
|                                                                              |
|                            video-exif-pane-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing photo image file information.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="item-list">
			<% if (exif && Object.keys(exif).length > 0) { %>
			<% let keys = Object.keys(exif).sort(); %>
			<% for (let i = 0; i < keys.length; i++) { %>
			<% let key = keys[i]; %>
			<% let value = exif[key]; %>
			<div class="item">
				<div class="info">
					<div class="icon">
						<i class="fa fa-info-circle"></i>
					</div>
					<label><%= key.toTitleCase().replace(/_/g,' ') %></label>
					<% if (typeof value == 'object') { %>
					<% value = JSON.stringify(value); %>
					<% } %>
					<span class="name"><%= value.toString() %></span>
				</div>
			</div>
			<% } %>
			<% } else { %>
			<div class="item">
				<div class="info">
					<span class="name">No EXIF data.</span>
				</div>
			</div>
			<% } %>
		</div>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			exif: this.model? this.model.get('exif') : null
		};
	}
});