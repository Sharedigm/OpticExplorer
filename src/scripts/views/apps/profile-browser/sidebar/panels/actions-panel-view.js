/******************************************************************************\
|                                                                              |
|                             actions-panel-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a type of sidebar panel.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'actions panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-play-circle"></i>Actions</label>
		</div>
		
		<ul class="nav menu">
			<li class="invite-new-user"><a><i class="fa fa-envelope"></i>Invite New User</a></li>
			<li class="invite-google-contacts"><a><i class="fab fa-google"></i>Invite Google Contacts</a></li>
			<li class="add-connections"><a><i class="fa fa-user-plus"></i>Add Connections</a></li>
			<li class="view-connections"><a><i class="fa fa-user-friends"></i>View Connections</a></li>
		</ul>
	`),

	events: {
		'click .invite-new-user a': 'onClickInviteNewUser',
		'click .invite-google-contacts a': 'onClickInviteGoogleContacts',
		'click .add-connections a': 'onClickAddConnections',
		'click .view-connections a': 'onClickViewConnections'
	},	

	//
	// setting methods
	//

	setNumSelected: function(numSelected) {
		if (numSelected == 0) {
			this.$el.find('.invite-new-user').removeClass('disabled');
			this.$el.find('.invite-google-contacts').removeClass('disabled');
			this.$el.find('.add-connections').addClass('disabled');
		} else {
			this.$el.find('.invite-new-user').addClass('disabled');
			this.$el.find('.invite-google-contacts').addClass('disabled');
			this.$el.find('.add-connections').removeClass('disabled');
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		SideBarPanelView.prototype.onRender.call(this);

		// hide / show actions
		//
		if (!this.options.invite_google_contacts) {
			this.$el.find('.invite-google-contacts').hide();
		}
		if (this.options.hidden && this.options.hidden['add-connections']) {
			this.$el.find('.add-connections').hide();
		}
		if (this.options.hidden && this.options.hidden['view-connections']) {
			this.$el.find('.view-connections').hide();
		}
	},

	showConnections: function() {
		application.launch('connection_manager');
	},

	//
	// mouse event handling methods
	//

	onClickSearchUsers: function() {
		this.app.setSearch({
			name: undefined
		});
	},

	onClickInviteNewUser: function() {
		import(
			'../../../../../views/apps/profile-browser/dialogs/invitations/invite-user-dialog-view.js'
		).then((InviteUserDialogView) => {

			// show invite user dialog
			//
			this.app.show(new InviteUserDialogView.default());
		});
	},

	onClickInviteGoogleContacts: function() {
		this.app.importGoogleContacts((contacts) => {
			Promise.all([
				import('../../../../../collections/contacts/contacts.js'), 
				import('../../../../../views/apps/profile-browser/dialogs/invitations/invite-google-contacts-dialog-view.js')
			]).then(([Contacts, InviteGoogleContactsDialogView]) => {

				// show invite google contacts dialog
				//
				this.app.show(new InviteGoogleContactsDialogView({
					collection: new Contacts.default(contacts),
					message: config.apps.profile_browser.invitation_message
				}));
			});
		});
	},

	onClickAddConnections: function() {
		if (!this.app.getChildView('content').hasSelected()) {

			// show notification
			//
			application.notify({
				icon: '<i class="fa fa-mouse-pointer"></i>',
				title: 'Selection Error',
				message: "You must first select one or more users."
			});
			
			return;
		}

		// send connection requests to selected users
		//
		this.app.showConnectionRequestDialog(this.app.getSelectedModels());
	},

	onClickViewConnections: function() {
		this.showConnections();
	},

	//
	// event handling methods
	//

	onChangeSelected: function() {
		this.setNumSelected(this.app.numSelected());
	}
});