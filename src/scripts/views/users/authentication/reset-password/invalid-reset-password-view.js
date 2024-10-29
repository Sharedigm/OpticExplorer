/******************************************************************************\
|                                                                              |
|                            invalid-reset-password-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for resetting the user's password.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<h1><i class="fa fa-undo"></i>Invalid Password Reset</h1>
		
		<div class="content">
			<p>This password reset is invalid.  Please request another password reset.</p>
		</div>
		
		<div class="buttons">
			<button class="ok btn btn-primary btn-lg">
				<i class="fa fa-check"></i>OK
			</button>
		</div>
	`),

	events: {
		'click .ok': 'onClickOk'
	},

	//
	// mouse event handling methods
	//

	onClickOk: function() {

		// go to home view
		//
		application.navigate('', {
			trigger: true
		});
	}
});