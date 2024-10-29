/******************************************************************************\
|                                                                              |
|                        connection-history-pane-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for showing connection history information.       |
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
		<% if (typeof birth_date != 'undefined') { %>
		<div class="birth-date form-group">
			<label class="control-label"><i class="fa fa-birthday-cake"></i>Birth Date</label>
			<div class="controls">
				<p class="form-control-static">
					<%= birth_date %>
				</p>
			</div>
		</div>
		<% } %>

		<% if (typeof created_at != 'undefined') { %>
		<div class="join-date form-group">
			<label class="control-label"><i class="fa fa-pencil-alt"></i>Join Date</label>
			<div class="controls">
				<p class="form-control-static">
					<%= created_at %>
				</p>
			</div>
		</div>
		<% } %>

		<% if (typeof accepted_at != 'undefined') { %>
		<div class="connect-date form-group">
			<label class="control-label"><i class="fa fa-user-friends"></i>Connect Date</label>
			<div class="controls">
				<p class="form-control-static">
					<%= accepted_at %>
				</p>
			</div>
		</div>
		<% } %>

		<% if (typeof last_login_at != 'undefined') { %>
		<div class="last-login-date form-group">
			<label class="control-label"><i class="fa fa-keyboard"></i>Last Login Date</label>
			<div class="controls">
				<p class="form-control-static">
					<%= last_login_at %>
				</p>
			</div>
		</div>
		<% } %>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			birth_date: this.model.has('birth_date')? this.model.get('birth_date').format() : 'unknown',
			created_at: this.model.has('created_at')? this.model.get('created_at').format() : 'unknown',
			accepted_at: this.model.has('accepted_at')? this.model.get('accepted_at').format() : 'unknown',
			last_login_at: this.model.has('last_login_at')? this.model.get('last_login_at').format() : 'unknown'
		};
	}
});