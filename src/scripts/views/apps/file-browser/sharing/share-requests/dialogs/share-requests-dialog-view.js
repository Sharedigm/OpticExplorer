/******************************************************************************\
|                                                                              |
|                        share-requests-dialog-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for showing a list of share requests.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import DialogView from '../../../../../../views/dialogs/dialog-view.js';
import ShareRequestsListView from '../../../../../../views/apps/file-browser/sharing/share-requests/list/share-requests-list-view.js';

export default DialogView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-user"></i>
					</div>
					<div class="title">
						<%= name %> Shares
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<div class="share-requests-list"></div>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
		
						<!-- link buttons -->
						<button class="new-shares btn btn-primary">
							<i class="fa fa-share"></i>New Shares
						</button>
						<button class="delete-shares btn" disabled>
							<i class="fa fa-trash-alt"></i>Delete Shares
						</button>
		
						<!--  cancel / close button -->
						<button class="cancel btn" data-dismiss="modal">
							<i class="fa fa-xmark"></i>Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	regions: {
		list: '.share-requests-list'
	},

	events: _.extend({}, DialogView.prototype.events, {
		'mousedown .modal-body': 'onMouseDownModalBody',
		'click .new-shares': 'onClickNewShares',
		'click .delete-shares': 'onClickDeleteShares'
	}),

	//
	// dialog attributes
	//

	resizable: false,

	//
	// getting methods
	//

	getSelected: function() {
		return this.getChildView('list').getSelected();
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
			this.model.deleteShareRequests(shareRequests, {
				
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
			name: this.model.getName()
		};
	},

	onRender: function() {

		// call superclass method
		//
		DialogView.prototype.onRender.call(this);

		// show child views
		//
		this.showShareRequestsList();
	},

	showShareRequestsList: function() {
		this.showChildView('list', new ShareRequestsListView({
			collection: this.collection,

			// callbacks
			//
			onchange: () => this.onChange()
		}));
		this.update();
	},

	update: function() {
		let numSelected = this.getChildView('list').numSelected();
		let hasBeenShared = this.model.hasBeenShared();

		// enable / disable buttons
		//
		this.$el.find('.new-shares').prop('disabled', numSelected != 0 || hasBeenShared);
		this.$el.find('.delete-shares').prop('disabled', numSelected == 0 || hasBeenShared);
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.update();
	},

	onMouseDownModalBody: function() {

		// deselect previously selected items
		//
		if (this.hasChildView('list')) {
			this.getChildView('list').deselectAll();
		}
	},

	onClickNewShares: function() {
		import(
			'../../../../../../collections/connections/connections.js'
		).then((Connections) => {

			// fetch connections
			//
			new Connections.default().fetchByUser(application.session.user, {
				
				// callbacks
				//
				success: (collection) => {
					this.model.showNewShareRequests(collection);
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not find connections.",
						response: response
					});
				}
			});
		});
	},

	onClickDeleteShares: function() {
		this.deleteShareRequests(this.getSelected());
	}
});
