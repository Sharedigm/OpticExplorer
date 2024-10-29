/******************************************************************************\
|                                                                              |
|                        provider-sign-in-error-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This view shows error information in the event of a third             |
|        party identity provider sign in error.                                |
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
		<h1><i class="fa fa-bug"></i>Provider Sign In Error</h1>
		
		<ol class="breadcrumb">
			<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
			<li><i class="fa fa-bug"></i>Provider Sign In Error</li>
		</ol>
		
		<div class="content">
			<% if (type == 'no-account') { %>
		
				<h2>No Account<%= provider? ' With ' + provider.toTitleCase() : '' %></h2>
				<p>You do not yet have an account that is associated with this identity provider.  To create an account, click the "Sign Up" button and then select the identity provider of your choice. </p>
		
			<% } else if (type == 'account-exists') { %>
		
				<h2>Account Exists</h2>
				<p>You have already created a sign in associated with <%= provider.toTitleCase() %>.
		
			<% } else if (type == 'account-disabled') { %>
		
				<h2>Account Disabled</h2>
				<p>An administrator disabled your account.<br/>
		
			<% } else if (type == 'provider-account-disabled') { %>
		
				<h2>Provider Account Disabled</h1>
				<p>An administrator disabled your linked account and you will not be able to use it for authentication at this time. Please sign in using your credentials.<br/>
		
			<% } else if (type == 'provider-account-not-verified') { %>
		
				<h2>Provider Account Not Verified</h1>
				<p>Your account with your identity provider has not been verified. </p>
		
			<% } else if (type == 'no-provider') { %>
		
				<h2>No Identity Provider</h2>
				<p>This identity provider is not supported.  Please sign in using another provider or your username/password credentials. <br/>
		
			<% } else if (type == 'provider-disabled') { %>
		
				<h2>Identity Provider Disabled</h2>
				<p>We have disabled <%= provider? ' With ' + provider.toTitleCase() : 'this identity provider' %> as an identity provider at the current time.  Please sign in using another provider or your username/password credentials.<br/>
		
			<% } else { %>
		
				<h2>General Error</h2>
				<p>There was a problem with your external identity provider.</p>
				<p>One or more of the following errors may have occurred:</p>
				<ul>
					<li>You denied consent of attribute release from your identity provider.</li>
					<li>The identity provider authentication timed out requiring you to log in again.</li>
					<li>You attempted to access a URL without following the login process.</li>
				</ul>
				<p>Please try logging in again.</p>
		
			<% } %>
		</div>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			provider: this.options.provider,
			type: this.options.type
		};
	}
});
