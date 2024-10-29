/******************************************************************************\
|                                                                              |
|                              email-verification-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the email verification view used in the new              |
|        user registration process.                                            |
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
		<h1>Email Address Verification</h1>
		
		<div class="content">
			<p>Your account was successfully created. However, we need to first verify your email address: <a href="mailto:<%= email %>"><%= email %></a> . </p>
			<p>Please check your inbox and follow the link in the email that we sent you. </p>
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