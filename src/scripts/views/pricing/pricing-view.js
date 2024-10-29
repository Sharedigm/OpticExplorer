/******************************************************************************\
|                                                                              |
|                                pricing-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing pricing.                              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<h1><i class="fa fa-mouse-pointer"></i>Pricing</h1>
		
		<ol class="breadcrumb">
			<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
			<li><i class="fa fa-mouse-pointer"></i>Pricing</li>
		</ol>
		
		<div class="content">
			<p>Choose the <%= application.name %> account type to suit your needs: </p>
		
			<div style="width:100%; overflow:auto">
				<table class="bold" style="text-align:center">
					<thead>
						<tr>
							<th colspan="5" style="padding-bottom:0">
								<label>Account Type</label>
							</th>
						</tr>
						<tr>
							<th>
							</th>
							<th style="text-align:center">
								<i class="fa fa-user"></i>
								<label>Personal</label>
							</th>
							<th style="text-align:center">
								<i class="fa fa-plus"></i>
								<label>Plus</label>
							</th>
							<th style="text-align:center">
								<i class="fa fa-briefcase"></i>
								<label>Pro</label>
							</th>
							<th style="text-align:center">
								<i class="fa fa-building"></i>
								<label>Enterprise</label>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th style="text-align:center">
								<i class="fa fa-database"></i>
								<label>Storage</label>
							</th>
							<td class="bold"><span class="success">5 GB</span></td>
							<td class="bold"><span class="caution">100 GB</span></td>
							<td class="bold"><span class="warning">1 TB</span></td>
							<td class="bold"><span class="info">10 TB</span></td>
						</tr>
						<tr>
							<th style="text-align:center">
								<i class="fa fa-money-bill"></i>
								<label>Cost</label>
							</th>
							<td><span class="success"><span class="bold">FREE</span></span></td>
							<td><span class="caution"><span class="bold">$2.99</span> / month</span></td>
							<td><span class="warning"><span class="bold">$9.99</span> / month</span></td>
							<td><span class="info"><span class="bold">$49.99</span> / month</span></td>
						</tr>
						<tr>
							<th style="text-align:center">
								<i class="fa fa-money-bill"></i>
								<label>Cost / GB</label>
							</th>
							<td><span class="success"><span class="bold">FREE</span></span></td>
							<td><span class="caution"><span class="bold">$0.03</span> / GB / month</span></td>
							<td><span class="warning"><span class="bold">$0.01</span> / GB / month</span></td>
							<td><span class="info"><span class="bold">$0.005</span> / GB / month</span></td>
						</tr>
						<tr>
							<th style="text-align:center">
								<i class="fa fa-users"></i>
								<label>Users</label>
							</th>
							<td><span class="bold"><span class="success">1</span></span></td>
							<td><span class="bold"><span class="caution">1</span></span></td>
							<td><span class="bold"><span class="warning">1</span></span></td>
							<td><span class="bold"><span class="info">10</span></span></td>
						</tr>
						<tr>
							<th style="text-align:center">
								<i class="fa fa-money-bill"></i>
								<label>Cost / User</label>
							</th>
							<td><span class="success"><span class="bold">FREE</span></span></td>
							<td><span class="caution"><span class="bold">$2.99</span> / user / month</span></td>
							<td><span class="warning"><span class="bold">$9.99</span> / user / month</span></td>
							<td><span class="info"><span class="bold">$4.99</span> / user / month</span></td>
						</tr>
						<tr>
							<th style="text-align:center">
								<i class="fa fa-pencil-alt"></i>
								<label>Sign Up</label>
							</th>
							<td>
								<button id="personal" class="sign-up btn">
									<i class="fa fa-pencil-alt"></i>Sign Up
								</button>
							</td>
							<td>
								<button id="plus" class="sign-up btn">
									<i class="fa fa-pencil-alt"></i>Sign Up
								</button>
							</td>
							<td>
								<button id="pro" class="sign-up btn">
									<i class="fa fa-pencil-alt"></i>Sign Up
								</button>
							</td>
							<td>
								<button id="enterprise" class="sign-up btn">
									<i class="fa fa-pencil-alt"></i>Sign Up
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		
			<h2><i class="fa fa-user"></i>Personal Accounts</h2>
			<p>It's easy and free to <a href="#help/getting-started/creating-account">create a personal account</a>.  Personal accounts offer 5 GB of free storage. To create a personal account, just click the "Sign Up" button on the header bar. </p>
		
			<h2><i class="fa fa-plus"></i>Plus Accounts</h3>
			<p>Plus accounts offer increased storage up to 100 GB. You can sign up for a Plus account or you can upgrade your free Personal account to a Plus account at any point in time.</p>
		
			<h2><i class="fa fa-briefcase"></i>Pro Accounts</h3>
			<p>If you are a pro user and need even more storage, then you can create a Pro account.  Pro accounts offer increased storage up to 1 TB. </p>
		
			<h2><i class="fa fa-building"></i>Enterprise Accounts</h3>
			<p>If you would like to set up a large amount of storage for a team or workgroup, then the Enterprise acccount is right for you. With enterprise accounts, your storage quota is shared among the members of the team for additional flexibility. </p>
		
			<h2><i class="fa fa-cloud"></i>Unlimited - The Cloud's The Limit!</h2>
			<p>If you really need a lot of storage or you need additional privacy or you need your files to be available privately from your own server or intranet, then can create your own <%= application.name %> instance.  With your own self-hosted <%= application.name %> instance, you can have as much storage as you need for as many users as you need.  You can customize the interface with your own branding and you can enforce your own policies.  When setting up your own <%= application.name %> instance, we can set up the hosting for you (for example: <a href=""><%= location.hostname.replace('www.', 'mycompany.') %></a>) or we can help you to install it on your own servers.  It's just like <%= application.name %> but it's all yours! <a href="#contact">Contact us</a> for details. </p>
		</div>
	`),

	events: {
		'click .sign-up ': 'onClickSignUp'
	},

	//
	// methods
	//

	signUpWithStripe: function(accountType) {
		Stripe(config.publishable).redirectToCheckout(config.options[accountType]).then((result) => {

			// show error dialog
			//
			application.error({
				message: "Could not redirect to checkout.",
				response: result
			});
		});
	},

	signUp: function(accountType) {
		if (accountType == 'personal') {
			application.signUp();
		} else if (config.enabled) {
			this.signUpWithStripe(accountType);
		} else {

			// show notification
			//
			application.notify({
				icon: '<i class="fa fa-exclamation-triangle"></i>',
				title: 'Working On It!',
				message: 'This feature is not yet available.  Coming soon!'
			});	
		}
	},
	
	//
	// mouse event handling methods
	//

	onClickSignUp: function(event) {
		let accountType = $(event.target).attr('id');
		this.signUp(accountType);
	}
});
