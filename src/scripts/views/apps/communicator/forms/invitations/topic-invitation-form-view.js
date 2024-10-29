/******************************************************************************\
|                                                                              |
|                        topic-invitation-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a editable form view of a topic invitation.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import Connections from '../../../../../collections/users/connections/connections.js';
import FormView from '../../../../../views/forms/form-view.js';
import UsersView from '../../../../../views/apps/profile-browser/mainbar/users/users-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="topic-name form-group">
			<label class="control-label"><i class="fa fa-newspaper"></i>Topic</label>
			<div class="controls">
				<p class="form-control-static">
					<span class="topic"><%= name %></span>
				</p>
			</div>
		</div>
		
		<div class="to form-group">
			<label class="required control-label"><i class="fa fa-crosshairs"></i>To</label>
			<div class="controls">
				<span class="recipients"></span>
				<button class="select-connections btn" disabled>
					<i class="fa fa-user-friends"></i>Select Connections
				</button>
			</div>
		</div>
		
		<div class="message form-group">
			<label class="control-label"><i class="fa fa-quote-left"></i>Message</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" rows="4" maxlength="1000"></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Message" data-content="This is an optional message to the recipient(s) of the invitation."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	regions: {
		recipients: '.recipients'
	},

	events: {
		'click .select-connections': 'onClickSelectConnections'
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.collection = new Connections();
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'message':
				return this.$el.find('.message textarea').val();
		}
	},

	getValues: function() {
		return {
			message: this.getValue('message')
		};
	},

	getNames: function() {
		let names = [];
		if (this.selected) {
			for (let i = 0; i < this.selected.length; i++) {
				names.push(this.selected[i].getName());
			}
		}
		return names;
	},

	//
	// setting methods
	//

	setConnections: function(connections) {
		this.selected = connections;
		this.showConnections(connections);
	},

	//
	// form methods
	//

	submit: function(options) {

		// check form validation
		//
		if (!this.isValid()) {
			return false;
		} else {

			// save model
			//
			this.model.inviteMembers(new Connections(this.selected), _.extend({
				data: this.getValues()
			}, options));
			return true;
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		FormView.prototype.onRender.call(this);

		// fetch user connections
		//
		this.collection.fetchByUser(application.session.user, {

			// callbacks
			//
			success: () => this.$el.find('.select-connections').prop('disabled', false),
			error: () => this.$el.find('.select-connections').prop('disabled', true)
		});
	},

	showConnections: function(connections) {

		// show connections list
		//
		this.showChildView('recipients', new UsersView({
			collection: new Connections(connections),

			// options
			//
			preferences: UserPreferences.create('connection_manager', {
				view_kind: 'names',
				detail_kind: null
			}),

			// capabilities
			//
			selectable: true
		}));
	},

	//
	// mouse event handling methods
	//

	onClickSelectConnections: function() {
		import(
			'../../../../../views/apps/connection-manager/dialogs/connections/select-connections-dialog-view.js'
		).then((SelectConnectionsDialogView) => {

			// show open dialog
			//
			this.parent.opener.show(new SelectConnectionsDialogView.default({
				collection: this.collection,

				// options
				//
				selected: this.selected,

				// callbacks
				//
				select: (items) => {
					this.setConnections(items);

					// perform callback
					//
					if (this.options.onselect) {
						this.options.onselect(items);
					}
				}
			}));
		});
	}
});