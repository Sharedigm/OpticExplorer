/******************************************************************************\
|                                                                              |
|                        user-account-history-view.js                          |
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
import DateUtils from '../../../utilities/time/date-utils.js';
import TimeUtils from '../../../utilities/time/time-utils.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="since-sign-in form-group">
			<label class="form-label"><i class="fa fa-sign-in-alt"></i>Signed in</label>
			<p class="form-control-static">
				<%= time_since_sign_in %>
			</p>
		</div>
		
		<div class="created form-group">
			<label class="form-label"><i class="fa fa-magic"></i>Created</label>
			<p class="form-control-static">
				<%= created_at %>
			</p>
		</div>
		
		<div class="previous-sign-in form-group">
			<label class="form-label"><i class="fa fa-calendar-alt"></i>Previous</label>
			<p class="form-control-static">
				<%= previous_sign_in %>
			</p>
		</div>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {

			// elapsed times
			//
			time_since_sign_in: TimeUtils.timeToString(this.model.getTimeSinceSignIn()),
			time_since_previous_sign_in: TimeUtils.timeToString(this.model.getTimeSincePreviousSignIn()),

			// dates
			//
			created_at: DateUtils.dateToHTML(this.model.get('created_at')),
			modified_at: DateUtils.dateToHTML(this.model.get('updated_at')),
			previous_sign_in: DateUtils.dateToHTML(this.model.get('penultimate_login_at'))
		};
	}
});