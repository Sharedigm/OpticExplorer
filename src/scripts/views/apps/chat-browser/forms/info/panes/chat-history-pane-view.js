/******************************************************************************\
|                                                                              |
|                           chat-history-pane-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a form view for displaying a chat session's information.      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="create-date form-group">
			<label class="control-label"><i class="fa fa-calendar-alt"></i>Created</label>
			<div class="controls">
				<p class="form-control-static"><%= created_at %></p>
			</div>
		</div>

		<% if (updated_at) { %>
		<div class="update-date form-group">
			<label class="control-label"><i class="fa fa-calendar-alt"></i>Updated</label>
			<div class="controls">
				<p class="form-control-static"><%= updated_at %></p>
			</div>
		</div>
		<% } %>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			created_at: this.model.get('created_at').format('mediumDate'),
			updated_at: this.model.get('updated_at').format('mediumDate')
		};
	}
});