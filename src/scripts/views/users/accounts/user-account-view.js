/******************************************************************************\
|                                                                              |
|                             user-account-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a read-only view of the user's account information.      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../views/forms/form-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="username form-group">
			<label class="form-label"><i class="fa fa-user"></i>Username</label>
			<p class="form-control-static">
				<%= username %>
			</p>
		</div>

		<div class="email form-group">
			<label class="form-label"><i class="fa fa-envelope"></i>Email</label>
			<p class="form-control-static">
				<a href="mailto:<%= email %>"><%= email %></a>
			</p>
		</div>
	`)
});