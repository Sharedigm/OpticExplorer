/******************************************************************************\
|                                                                              |
|                          account-settings-form-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing an account settings form.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SettingsFormView from '../../../../../views/apps/common/forms/settings-form-view.js';
import UserAccountView from '../../../../../views/users/accounts/user-account-view.js';
import UserAccountHistoryView from '../../../../../views/users/accounts/user-account-history-view.js';

export default SettingsFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="settings icon-grid">
			<div class="item">
				<div class="row">
					<div class="icon colored grey">
						<img src="images/icons/settings/account.svg" />
						<i class="fa fa-key"></i>
					</div>
				</div>
				<div class="row">
					<div class="name">Account</div>
				</div>
			</div>
		</div>

		<ul class="nav nav-tabs" role="tablist">

			<li role="presentation" class="general-tab<% if (tab == 'general' || !tab) { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".general-settings">
					<i class="fa fa-check"></i>
					<label>General</label>
				</a>
			</li>

			<li role="presentation" class="history-tab<% if (tab == 'history') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".history-settings">
					<i class="fa fa-calendar"></i>
					<label>History</label>
				</a>
			</li>
		</ul>

		<div class="tab-content">

			<div role="tabpanel" class="general-settings tab-pane<% if (tab == 'general' || !tab) { %> active<% } %>">
				<div class="account">
					<div style="text-align:center">
						<i class="fa fa-spinner spinning" style="margin-right: 5px"></i>
						<span>Loading...</span>
					</div>
				</div>

				<br />

				<div class="buttons" style="text-align:center">
					<button class="edit-account btn btn-primary">
						<i class="fa fa-pencil-alt"></i>Edit Account
					</button>
					<button class="change-password btn">
						<i class="fa fa-key"></i>Change Password
					</button>
					<button class="delete-account btn colored red">
						<i class="fa fa-trash-alt"></i>Delete Account
					</button>
				</div>
			</div>

			<div role="tabpanel" class="history-settings tab-pane<% if (tab == 'history') { %> active<% } %>">
				<div class="account-history">
					<div style="text-align:center">
						<i class="fa fa-spinner spinning" style="margin-right: 5px"></i>
						<span>Loading...</span>
					</div>
				</div>
			</div>
		</div>
	`),

	events: {
		'click .edit-account': 'onClickEditAccount',
		'click .change-password': 'onClickChangePassword',
		'click .delete-account': 'onClickDeleteAccount'
	},

	regions: {
		'account': '.account',
		'history': '.account-history'
	},

	//
	// deleting methods
	//

	destroyAccount: function() {

		// delete user
		//
		application.session.user.destroy({

			// callbacks
			//
			success: () => {
				application.session.user = null;
				
				// show notification
				//
				application.notify({
					icon: '<i class="fa fa-trash-alt"></i>',
					title: "Account Deleted",
					message: "Your user account has been successfuly deleted.",

					// callbacks
					//
					accept: () => application.logout()
				});
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not delete your user account.",
					response: response
				});
			}
		});
	},

	deleteAccount: function(options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete My Account",
				message: "Are you sure that you want to delete your user account? " +
					"When you delete an account, all of your user data will be deleted.",

				// callbacks
				//
				accept: () => {
					this.deleteAccount({
						confirm: false
					});
				}
			});
		} else {

			// delete account
			//
			this.destroyAccount();
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			tab: this.options.tab
		};
	},

	onRender: function() {

		// show child views
		//
		this.showUserAccount();
		this.showUserAccountHistory();
	},

	showUserAccount: function() {
		this.showChildView('account', new UserAccountView({
			model: this.model
		}));
	},

	showUserAccountHistory: function() {
		this.showChildView('history', new UserAccountHistoryView({
			model: this.model
		}));
	},

	//
	// dialog rendering methods
	//

	showEditAccountDialog: function() {
		import(
			'../../../../../views/users/accounts/dialogs/edit-user-account-dialog-view.js'
		).then((EditUserAccountDialogView) => {
			
			// show edit user account dialog
			//
			application.show(new EditUserAccountDialogView.default({
				model: this.model,

				// callbacks
				//
				onchange: () => {
					this.render();
				}
			}));
		});
	},

	showChangePasswordDialog: function() {
		import(
			'../../../../../views/users/accounts/dialogs/change-password-dialog-view.js'
		).then((ChangePasswordDialogView) => {
			
			// show change password dialog
			//
			application.show(new ChangePasswordDialogView.default({
				model: this.model
			}));
		});
	},

	//
	// mouse event handling methods
	//

	onClickEditAccount: function() {
		this.showEditAccountDialog();
	},

	onClickChangePassword: function() {
		this.showChangePasswordDialog();
	},

	onClickDeleteAccount: function() {
		this.deleteAccount();
	}
});