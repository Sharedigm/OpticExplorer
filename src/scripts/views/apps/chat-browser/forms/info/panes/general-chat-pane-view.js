/******************************************************************************\
|                                                                              |
|                           general-chat-pane-view.js                          |
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
		<div class="num-members form-group">
			<label class="control-label"><i class="fa fa-user"></i>Members</label>
			<div class="controls">
				<p class="form-control-static"><%= members.length %></p>
			</div>
		</div>

		<div class="num-invitations form-group">
			<label class="control-label"><i class="fa fa-envelope"></i>Invitations</label>
			<div class="controls">
				<p class="form-control-static"><%= num_invitations %></p>
			</div>
		</div>

		<div class="num-messages form-group">
			<label class="control-label"><i class="fa fa-comments"></i>Messages</label>
			<div class="controls">
				<p class="form-control-static"><%= num_messages %></p>
			</div>
		</div>
	`)
});