/******************************************************************************\
|                                                                              |
|                            security-pane-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a form for a post topic's general information.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserPreferences from '../../../../../../models/preferences/user-preferences.js';
import Connections from '../../../../../../collections/users/connections/connections.js';
import FormView from '../../../../../../views/forms/form-view.js';
import UsersView from '../../../../../../views/apps/profile-browser/mainbar/users/users-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="privacy form-group">
			<label class="control-label"><i class="fa fa-lock"></i>Privacy</label>
			<div class="controls">
				<p class="form-control-static">
					<% if (public) { %>
					<label><i class="fa fa-globe"></i>Public</label>
					<% } else if (!private) { %>
					<label><i class="fa fa-user-friends"></i>Connections</label>
					<% } else { %>
					<label><i class="fa fa-lock"></i>Private</label>
					<% } %>
				</p>
			</div>
		</div>
		
		<% if (moderators) { %>
		<div class="moderators form-group">
			<label class="control-label"><i class="fa fa-check"></i>Moderators</label>
			<div class="controls">
			</div>
		</div>
		<% } %>
	`),

	regions: {
		'moderators': '.moderators .controls'
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			required: this.model.get('required') || true,
			moderators: this.model.has('user')? [this.model.get('user')] : null
		};
	},
	
	onRender: function() {

		// show sub views
		//
		if (this.model.has('user')) {
			this.showModerators([this.model.get('user')]);
		}
	},

	showModerators: function(users) {

		// show list of moderators
		//
		this.showChildView('moderators', new UsersView({
			collection: new Connections(users),

			// options
			//
			preferences: UserPreferences.create('connection_manager', {
				view_kind: 'names',
				detail_kind: null
			}),

			// capabilities
			//
			selectable: true,

			// callbacks
			//
			onOpen: function(item) {

				// show moderator's profile info
				//
				application.showUser(item.model);
			}
		}));
	},
});