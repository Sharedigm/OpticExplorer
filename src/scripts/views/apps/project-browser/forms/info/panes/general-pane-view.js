/******************************************************************************\
|                                                                              |
|                             general-pane-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a form for a task project's general information.              |
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
		<div class="name form-group" style="display:none">
			<label class="control-label"><i class="fa fa-envelope"></i>Topic Name</label>
			<div class="controls">
				<p class="form-control-static"><%= name %></p>
			</div>
		</div>

		<div class="description form-group">
			<label class="control-label"><i class="fa fa-quote-left"></i>Description</label>
			<div class="controls">
				<p class="form-control-static"><%= description || 'None' %></p>
			</div>
		</div>

		<% if (keywords) { %>
		<div class="description form-group">
			<label class="control-label"><i class="fa fa-key"></i>Keywords</label>
			<div class="controls">
				<p class="form-control-static"><%= keywords || 'None' %></p>
			</div>
		</div>
		<% } %>

		<% if (typeof num_tasks == 'number') { %>
		<div class="num_tasks form-group">
			<label class="control-label"><i class="fa fa-user"></i>Tasks</label>
			<div class="controls">
				<p class="form-control-static"><%= num_tasks %>
			</div>
		</div>
		<% } %>

		<% if (typeof num_members == 'number') { %>
		<div class="num_members form-group">
			<label class="control-label"><i class="fa fa-user"></i>Members</label>
			<div class="controls">
				<p class="form-control-static"><%= num_members %>
			</div>
		</div>
		<% } %>
	`)
});