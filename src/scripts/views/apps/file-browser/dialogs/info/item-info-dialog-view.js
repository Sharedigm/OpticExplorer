/******************************************************************************\
|                                                                              |
|                            item-info-dialog-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for showing information about a file.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Directory from '../../../../../models/storage/directories/directory.js';
import InfoDialogView from '../../../../../views/apps/common/dialogs/info/info-dialog-view.js';
import FileUtils from '../../../../../utilities/files/file-utils.js';

export default InfoDialogView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-info-circle"></i>
					</div>
					<div class="title">
						<%= item_name %> Info
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
						<% if (show_enclosing) { %>
						<button class="open-folder btn btn" data-dismiss="modal">
							<i class="fa fa-folder"></i>Open Enclosing Folder
						</button>
						<% } %>
		
						<!-- permissions buttons -->
						<button class="save btn btn-primary" style="display:none" disabled>
							<i class="fa fa-save"></i>Save
						</button>

						<!-- location buttons -->
						<button class="set-place btn btn-primary" style="display:none">
							<i class="fa fa-map-pin"></i>Set Place
						</button>
						<button class="edit-place btn btn-primary" style="display:none">
							<i class="fa fa-pencil"></i>Edit Place
						</button>
						<button class="delete-place btn" style="display:none">
							<i class="fa fa-trash-alt"></i>Delete Place
						</button>

						<!-- sharing buttons -->
						<button class="new-shares btn btn-primary" style="display:none">
							<i class="fa fa-share"></i>New Shares
						</button>
						<button class="delete-shares btn" style="display:none" disabled>
							<i class="fa fa-trash-alt"></i>Delete Shares
						</button>
		
						<!-- link buttons -->
						<button class="new-link btn btn-primary" style="display:none" disabled>
							<i class="fa fa-link"></i>New Link
						</button>
						<button class="edit-link btn" style="display:none" disabled>
							<i class="fa fa-pencil-alt"></i>Edit Link
						</button>
						<button class="copy-link btn" style="display:none" disabled>
							<i class="fa fa-copy"></i>Copy Link
						</button>
						<% if (false) { %>
						<button class="view-link btn" style="display:none" disabled>
							<i class="fa fa-eye"></i>View Link
						</button>
						<% } %>
						<button class="delete-links btn" style="display:none" disabled>
							<i class="fa fa-trash-alt"></i>Delete Links
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
		'click .items + .nav-tabs a': 'onClickItemTab',

		// general events
		//
		'click .open-folder': 'onClickOpenFolder',

		// permissions events
		//
		'click .save': 'onClickSave',

		// place events
		//
		'click .set-place': 'onClickSetPlace',
		'click .edit-place': 'onClickEditPlace',
		'click .delete-place': 'onClickDeletePlace',

		// share events
		//
		'click .new-shares': 'onClickNewShares',
		'click .delete-shares': 'onClickDeleteShares',

		// link events
		//
		'click .new-link': 'onClickNewLink',
		'click .edit-link': 'onClickEditLink',
		'click .copy-link': 'onClickCopyLink',
		'click .view-link': 'onClickViewLink',
		'click .delete-links': 'onClickDeleteLinks'
	}),

	//
	// constructor
	//

	initialize: function() {
		this.tab = this.options.tab;

		// call superclass constructor
		//
		InfoDialogView.prototype.initialize.call(this);
	},

	//
	// counting methods
	//

	numSelectedShareRequests: function() {
		return this.getChildView('form').numSelectedShareRequests();
	},

	numSelectedLinks: function() {
		return this.getChildView('form').numSelectedLinks();
	},

	//
	// getting methods
	//

	getTab: function(event) {
		let className = $(event.target).closest('li').attr('class');
		return className.replace('-tab', '').replace('active', '').trim();
	},

	getItem: function() {
		return this.model;
	},

	getItemName: function() {
		return this.model.getName();
	},

	getSelectedShareRequests: function() {
		return this.getChildView('form').getSelectedShareRequests();
	},

	getSelectedLinks: function() {
		return this.getChildView('form').getSelectedLinks();
	},

	//
	// setting methods
	//

	setPlace: function(place) {
		this.model.set('place', place);

		// update dialog
		//
		this.updatePlace();
	},

	updatePlace: function() {
		this.getChildView('form').showPlace();
		this.update();
	},

	deletePlace: function() {
		this.model.set('place', null);

		// update dialog
		//
		this.update();
	},

	setButtonVisibility: function() {

		// hide / show buttons for each tab
		//
		switch (this.tab) {
			case 'permissions':
				this.showFooterButtons(['save', 'cancel']);
				break;
			case 'place':
				if (this.model.has('place')) {
					this.showFooterButtons(['edit-place', 'delete-place', 'cancel']);
				} else {
					this.showFooterButtons(['set-place', 'cancel']);
				}
				break;
			case 'sharing':
				this.showFooterButtons(['new-shares', 'delete-shares', 'cancel']);
				break;
			case 'links':
				this.showFooterButtons(['new-link', 'edit-link', 'view-link', 'copy-link', 'delete-links']);
				break;
			default:
				this.showFooterButtons(['ok', 'open-folder']);
				break;
		}
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
			this.getItem().deleteShareRequests(shareRequests, {

				// callbacks
				//
				success: () => {

					// disable delete shares button
					//
					this.$el.find('.delete-shares').prop('disabled', true);

					// play delete sound
					//
					application.play('delete');
				},

				error: () => {
					this.error({
						message: "Could not delete share requests."
					});
				}
			});
		}
	},

	deleteLinks: function(links, options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete Links",
				message: "Are you sure you want to delete " + 
					(links.length == 1? "this link" : "these " + links.length + " links") + "?",

				// callbacks
				//
				accept: () => {
					this.deleteLinks(links, {
						confirm: false
					});
				}
			});
		} else {

			// delete links from model
			//
			this.getItem().deleteLinks(links, {

				// callbacks
				//
				success: () => {

					// disable delete button
					//
					this.$el.find('.delete-links').prop('disabled', true);

					// play delete sound
					//
					application.play('delete');
				},

				error: () => {
					this.error({
						message: "Could not delete links."
					});
				}
			});
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			item_name: this.getItemName(),
			show_enclosing: !this.getItem().isAttached()
		};
	},

	onRender: function() {

		// call superclass method
		//
		InfoDialogView.prototype.onRender.call(this);

		// fetch model to get metadata
		//
		if (this.model) {
			this.model.fetch({

				// callbacks
				//
				success: () => {

					// show form
					//
					this.showForm();
				}
			});
		}
	},

	showForm: function() {
		this.showChildView('form', this.form({
			tab: this.options.tab,

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid),
			onchange: () => this.setDisabled(false),
			onsubmit: () => this.onSubmit()				
		}));
	},

	form: function() {
		return this.info();
	},

	onShow: function() {

		// call superclass method
		//
		InfoDialogView.prototype.onShow.call(this);

		// set initial state
		//
		this.update();
	},

	showFooterButtons: function(which) {

		// hide / show buttons
		//
		this.$el.find('.modal-footer button').hide();
		for (let i = 0; i < which.length; i++) {
			this.$el.find('.modal-footer button.' + which[i]).show();
		}
	},

	//
	// updating methods
	//

	updateShareButtons: function() {
		let isSignedIn = application.isSignedIn();
		let numSelected = this.numSelectedShareRequests();

		// enable / disable buttons
		//
		this.$el.find('.new-shares').prop('disabled', !isSignedIn || numSelected != 0);
		this.$el.find('.delete-shares').prop('disabled', !isSignedIn || numSelected == 0);
	},

	updateLinkButtons: function() {
		let isSignedIn = application.isSignedIn();
		let numSelected = this.numSelectedLinks();
		// let hasBeenShared = this.getItem().hasBeenShared();

		// enable / disable buttons
		//
		this.$el.find('.new-link').prop('disabled', !isSignedIn);
		this.$el.find('.edit-link').prop('disabled', !isSignedIn || numSelected != 1);
		this.$el.find('.view-link').prop('disabled', !isSignedIn || numSelected != 1);
		this.$el.find('.copy-link').prop('disabled', !isSignedIn || numSelected != 1);
		this.$el.find('.delete-links').prop('disabled', !isSignedIn || numSelected == 0);
	},

	update: function() {
		this.updateShareButtons();
		this.updateLinkButtons();
		this.setButtonVisibility();
	},

	//
	// dialog rendering methods
	//

	showSetItemPlaceDialogView: function() {
		import(
			'../../../../../views/apps/file-browser/dialogs/places/set-item-place-dialog-view.js'
		).then((SetItemPlaceDialogView) => {

			// show set place dialog
			//
			application.show(new SetItemPlaceDialogView.default({
				model: this.model,

				// callbacks
				//
				onsubmit: (place) => {
					this.setPlace(place);

					// trigger file browser to show maps
					//
					this.model.parent.trigger('change');
				}
			}));
		});
	},

	showEditItemPlaceDialog: function() {
		import(
			'../../../../../views/apps/file-browser/dialogs/places/edit-item-place-dialog-view.js'
		).then((EditItemPlaceDialogView) => {

			// show edit place dialog
			//
			application.show(new EditItemPlaceDialogView.default({
				model: this.model,

				// callbacks
				//
				onsave: () => {
					this.updatePlace();

					// trigger file browser to show maps
					//
					this.model.parent.trigger('change');
				}
			}));
		});
	},

	showDeleteItemPlaceDialog: function() {
		application.confirm({
			title: 'Delete Item Place',
			message: "Are you sure you'd like to delete " + this.model.getName() + "'s place?",

			// callbacks
			//
			accept: () => {
				this.model.deletePlace({

					// callbacks
					//
					success: () => {
						this.deletePlace();

						// update view
						//
						this.model.parent.trigger('change');
					}
				})
			}
		})
	},

	showShareItemsDialog: function(items, connections, options) {
		import(
			'../../../../../views/apps/file-browser/sharing/share-requests/dialogs/share-items-dialog-view.js'
		).then((ShareItemsDialogView) => {

			// show share items dialog
			//
			application.show(new ShareItemsDialogView.default(_.extend({
				items: items,
				connections: connections,
				message: config.apps.file_browser.share_invitation_message
			}, options)));
		});
	},

	showNewLinkDialog: function(options) {
		import(
			'../../../../../views/apps/file-browser/sharing/links/dialogs/new-link-dialog-view.js'
		).then((NewLinkDialogView) => {

			// show new link dialog
			//
			application.show(new NewLinkDialogView.default(_.extend({
				target: this.getItem(),

				// callbacks
				//
				success: () => this.getChildView('form').showLinks()
			}, options)));
		});
	},

	showCopyLinkDialog: function(link) {
		import(
			'../../../../../views/apps/file-browser/dialogs/links/copy-link-dialog-view.js'
		).then((CopyLinkDialogView) => {

			// close dialog
			//
			this.hide();

			// show copy link dialog
			//
			application.show(new CopyLinkDialogView.default({
				url: link.getUrl()
			}));
		});
	},

	showEditLinkDialog: function(link) {
		import(
			'../../../../../views/apps/file-browser/sharing/links/dialogs/edit-link-dialog-view.js'
		).then((EditLinkDialogView) => {

			// show edit link dialog
			//
			application.show(new EditLinkDialogView.default({
				model: link
			}));
		});
	},

	showDirectory: function() {
		application.launch('file_browser', {
			model: new Directory({
				path: FileUtils.getDirectoryPath(this.getItem().get('path'))
			}),

			// options
			//
			selected: this.getItem()
		});
	},

	showLink: function() {

		// show link in browser
		//
		application.showUrl(this.getSelectedLinks()[0].getUrl());
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.$el.find('.save').prop('disabled', false);
	},

	//
	// mouse event handling methods
	//

	onClickItemTab: function(event) {
		this.tab = this.getTab(event);
		this.setButtonVisibility();
	},

	onClickOpenFolder: function() {
		this.showDirectory();
	},

	onClickSave: function() {
		this.save();
	},

	onClickSetPlace: function() {
		this.showSetItemPlaceDialogView();
	},

	onClickEditPlace: function() {
		this.showEditItemPlaceDialog();
	},

	onClickDeletePlace: function() {
		this.showDeleteItemPlaceDialog();
	},

	onClickNewShares: function() {
		this.showShareItemsDialog([this.getItem()]);
		this.close();
	},

	onClickDeleteShares: function() {
		this.deleteShareRequests(this.getSelectedShareRequests());
	},

	onClickNewLink: function() {
		this.showNewLinkDialog();
		this.close();
	},

	onClickEditLink: function() {
		this.showEditLinkDialog(this.getSelectedLinks()[0]);
	},

	onClickCopyLink: function() {
		this.showCopyLinkDialog(this.getSelectedLinks()[0]);
	},

	onClickViewLink: function() {
		this.showLink();
	},

	onClickDeleteLinks: function() {
		this.deleteLinks(this.getSelectedLinks());
	}
});