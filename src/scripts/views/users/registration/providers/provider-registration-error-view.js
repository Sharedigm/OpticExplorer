/******************************************************************************\
|                                                                              |
|                      provider-registration-error-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This view shows error information in the event of a third             |
|        party identity provider registration error.                           |
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
		<h1><i class="fa fa-bug"></i>Provider Registration Error</h1>
		
		<ol class="breadcrumb">
			<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
			<li><i class="fa fa-bug"></i>Provider Registration Error</li>
		</ol>
		
		<div class="content">
			<% if (type == 'account-exists') { %>
		
				<h2>Account Exists</h2>
				<p>You have already created an account associated with <%= provider %>.  To sign in, click the "Sign In" button and select your identity provider. </p>
		
			<% } else if (type == 'no-provider') { %>
		
				<h2>No Identity Provider</h2>
				<p>This identity provider is not supported.  Please sign in using another provider or your username/password credentials. <br/>
		
			<% } else if (type == 'provider-disabled') { %>
		
				<h2>Identity Provider Disabled</h2>
				<p>We have disabled your linked account identity provider at the current time.  Please sign in using another provider or your username/password credentials.<br/>
		
			<% } else { %>
		
				<h2>Unknown Error</h2>
				<p>There was a problem with your external identity provider.</p>
				<p>One or more of the following errors may have occurred:</p>
				<ul>
					<li>You denied consent of attribute release from your identity provider.</li>
					<li>The identity provider authentication timed out requiring you to log in again.</li>
					<li>You attempted to access a URL without following the registration process.</li>
				</ul>
				<p>Please try registering again.</p>
		
			<% } %>
		</div>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			provider: this.options.provider? this.options.provider.toTitleCase() : '?',
			type: this.options.type
		};
	}
});
