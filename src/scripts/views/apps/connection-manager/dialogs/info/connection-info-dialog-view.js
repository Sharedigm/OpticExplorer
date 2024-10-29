/******************************************************************************\
|                                                                              |
|                        connection-info-dialog-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for showing information about a connection.     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ShareRequests from '../../../../../collections/storage/sharing/share-requests.js';
import InfoDialogView from '../../../../../views/apps/common/dialogs/info/info-dialog-view.js';
import ConnectionInfoFormView from '../../../../../views/apps/connection-manager/forms/info/connection-info-form-view.js';

export default InfoDialogView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-user-friends"></i>
					</div>
					<div class="title">
						<%= connection_name %>'s Connection Info
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body"></div>
		
				<div class="modal-footer">
					<div class="buttons">
		
						<!-- general buttons -->
						<button type="submit" class="ok btn btn-primary" data-dismiss="modal">
							<i class="fa fa-check"></i>OK
						</button>
		
						<!-- sharing buttons -->
						<button class="delete-shares btn btn-primary" style="display:none" disabled>
							<i class="fa fa-trash-alt"></i>Delete Shares
						</button>
		
						<!--  cancel / close button -->
						<button class="cancel btn" data-dismiss="modal" style="display:none">
							<i class="fa fa-xmark"></i>Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	events: _.extend({}, InfoDialogView.prototype.events, {
		'click .item + .nav-tabs a': 'onClickItemTab',
		'click .save': 'onClickSave',

		// share events
		//
		'click .delete-shares': 'onClickDeleteShares'
	}),

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		InfoDialogView.prototype.initialize.call(this);

		// set attributes
		//
		this.tab = this.options.tab;

		// listen to model for changes
		//
		this.listenTo(this.model, 'change', this.onChange);
	},

	//
	// counting methods
	//
	
	numSelectedShareRequests: function() {
		return this.getChildView('form').numSelectedShareRequests();
	},

	//
	// getting methodsevent
	//

	getTab: function(event) {
		let className = $(event.target).closest('li').attr('class');
		return className.replace('tab', '').replace('active', '').trim();
	},

	getSelectedShareRequests: function() {
		return this.getChildView('form').getSelectedShareRequests();
	},

	//
	// deleting methods
	//

	deleteShareRequests: function(shareRequests, options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete Shares",
				message: "Are you sure you want to delete " + 
					(shareRequests.length == 1? "this share" : "these " + shareRequests.length + " shares") + "?",

				// callbacks
				//
				accept: () => {
					this.deleteShareRequests(shareRequests, {
						confirm: false
					});
				}
			});
		} else {

			// delete share requests
			//
			new ShareRequests(shareRequests).destroy({

				// callbacks
				//
				success: () => {

					// play delete sound
					//
					application.play('delete');
				}
			});

			// disable delete shares button
			//
			this.$el.find('.delete-shares').prop('disabled', true);		
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			connection_name: this.model.getName()
		};
	},

	onRender: function() {
		
		// call superclass method
		//
		InfoDialogView.prototype.onRender.call(this);

		// set button visibility according to tabs
		//
		if (this.tab) {
			this.setButtonVisibility();
		}
	},

	form: function() {
		return new ConnectionInfoFormView({
			model: this.model,

			// options
			//
			tab: this.options.tab,
			shareRequests: this.options.shareRequests,

			// callbacks
			//
			onchange: () => this.update(),
			onselect: () => this.update(),
			ondeselect: () => this.update()
		});
	},

	//
	// updating methods
	//

	setButtonVisibility: function() {
		
		// hide / show buttons
		//
		switch (this.tab) {

			case 'general':
			case 'history':
			case 'mutual':

				// general buttons
				//
				this.$el.find('.ok').show();
				this.$el.find('.save').hide();
				this.$el.find('.cancel').hide();

				// sharing buttons
				//
				this.$el.find('.delete-shares').hide();
				break;

			case 'sent':
			case 'received':

				// general buttons
				//
				this.$el.find('.ok').hide();
				this.$el.find('.save').hide();
				this.$el.find('.cancel').show();

				// sharing buttons
				//
				this.$el.find('.delete-shares').show();
				break;
		}
	},

	updateShareButtons: function() {
		let numSelected = this.numSelectedShareRequests();

		// enable / disable buttons
		//
		this.$el.find('.delete-shares').prop('disabled', numSelected == 0);
	},

	update: function() {
		this.updateShareButtons();
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.$el.find('.save').prop('disabled', false);
	},

	onClickItemTab: function(event) {
		this.tab = this.getTab(event);
		this.setButtonVisibility();
	},

	//
	// share event handling methods
	//

	onClickDeleteShares: function() {
		this.deleteShareRequests(this.getSelectedShareRequests());
	}
});
