/******************************************************************************\
|                                                                              |
|                          sign-in-settings-form-view.js                       |
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

import UserIdentities from '../../../../../collections/users/auth/user-identities.js';
import SettingsFormView from '../../../../../views/apps/common/forms/settings-form-view.js';
import UserIdentitiesListView from '../../../../../views/users/accounts/providers/list/user-identities-list-view.js';

export default SettingsFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="settings icon-grid">
			<div class="item">
				<div class="row">
					<div class="icon colored grey">
						<img src="images/icons/settings/sign-ins.svg" />
						<i class="fa fa-sign-in-alt"></i>
					</div>
				</div>
				<div class="row">
					<div class="name">Sign-Ins</div>
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
		</ul>

		<div class="tab-content">
			<div role="tabpanel" class="general-settings tab-pane<% if (tab == 'general' || !tab) { %> active<% } %>">
				<p>Identity providers are services that manage your identity information and allow you to sign to this application without entering a password.</p>

				<div class="identities"></div>

				<div class="buttons">
					<button class="add-sign-in btn">
						<i class="fa fa-plus"></i>Add Sign In
					</button>
				</div>
			</div>
		</div>
	`),

	regions: {
		'identities': {
			el: '.identities',
			replaceElement: true
		}
	},

	events: {
		'click .add-sign-in': 'onClickAddSignIn'
	},

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.show_identities == undefined) {
			this.options.show_identities = application.session.get('config').identity_providers != null;
		}

		// set attributes
		//
		this.collection = new UserIdentities();
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
		this.fetchAndShowIdentities();
	},

	showUserIdentitiesList: function() {
		this.showChildView('identities', new UserIdentitiesListView({
			collection: this.collection,

			// options
			//
			show_delete: true,
			ondelete: () => this.render()
		}));
	},

	fetchAndShowIdentities: function() {

		// fetch collection of identities
		//
		this.collection.fetchByCurrentUser({

			// callbacks
			//
			success: () => {

				// check if view still exists
				//
				if (this.isDestroyed()) {
					return;
				}
				
				this.showUserIdentitiesList({
					show_description: false,
					show_external_id: false,
					show_delete: true
				});
			},

			error: () => {

				// show error message
				//
				application.error({
					message: "Could not get identities for this user."
				});
			}
		});
	},

	showAddSignInDialog: function() {
		import(
			'../../../../../views/users/accounts/providers/dialogs/add-provider-sign-in-dialog-view.js'
		).then((AddProviderSignInDialogView) => {
			
			// show add provider sign in dialog
			//
			application.show(new AddProviderSignInDialogView.default({
				collection: this.collection
			}));
		});
	},

	//
	// mouse event handling methods
	//

	onClickAddSignIn: function() {
		this.showAddSignInDialog();
	}
});
