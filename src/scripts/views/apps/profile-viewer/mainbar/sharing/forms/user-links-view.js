/******************************************************************************\
|                                                                              |
|                              user-links-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for viewing a user's links.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Links from '../../../../../../collections/storage/sharing/links.js';
import BaseView from '../../../../../../views/base-view.js';
import LinksListView from '../../../../../../views/apps/file-browser/sharing/links/list/links-list-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="links-list panel"></div>
		
		<div class="buttons">
			<button class="edit-link btn btn-primary btn-lg" disabled>
				<i class="fa fa-pencil-alt"></i>Edit Link
			</button>
			<button class="copy-link btn btn-lg" disabled>
				<i class="fa fa-copy"></i>Copy Link
			</button>
			<button class="delete-links btn btn-lg" disabled>
				<i class="fa fa-trash-alt"></i>Delete Links
			</button>
		</div>
	`),

	regions: {
		list: {
			el: '.links-list',
			replaceElement: true
		}
	},

	events: {
		'mousedown': 'onMouseDown',
		'click .edit-link': 'onClickEditLink',
		'click .share-link': 'onClickShareLink',
		'click .delete-links': 'onClickDeleteLinks'
	},

	//
	// querying methods
	//

	hasSelected: function() {
		if (this.hasChildView('list')) {
			return this.getChildView('list').hasSelected();
		}
	},

	//
	// counting methods
	//

	numSelected: function() {
		return this.getChildView('list').numSelected();
	},

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
				title: "Delete Links",
				message: "Are you sure you want to delete " + 
					(shareRequests.length == 1? "this link" : "these " + shareRequests.length + " links") + "?",

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
			new Links(shareRequests).destroy();

			// disable delete button
			//
			this.$el.find('.delete-links').prop('disabled', true);		
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		new Links().fetchByUser(this.model, {

			// callbacks
			//
			success: (collection) => {
				this.showLinksList(collection);
			}
		});
	},

	showLinksList: function(links) {
		this.showChildView('list', new LinksListView({
			collection: links,

			// options
			//
			showPath: true,

			// callbacks
			//
			onchange: () => this.onChange()
		}));
	},

	//
	// event handling methods
	//

	onChange: function() {
		let numSelected = this.numSelected();

		// enable / disable buttons
		//
		this.$el.find('.edit-link').prop('disabled', numSelected != 1);
		this.$el.find('.copy-link').prop('disabled', numSelected != 1);
		this.$el.find('.delete-links').prop('disabled', numSelected == 0);
	},

	//
	// mouse event handling methods
	//

	onMouseDown: function(event) {

		// deselect previously selected items
		//
		if (!$(event.target).attr('class').contains('btn')) {
			if (this.hasChildView('links_list')) {
				this.getChildView('links_list').deselectAll();
			}
		}
	},

	onClickEditLink: function() {
		import(
			'../../../../../../views/apps/file-browser/sharing/links/dialogs/edit-link-dialog-view.js'
		).then((EditLinkDialogView) => {

			// show edit link dialog
			//
			application.show(new EditLinkDialogView.default({
				model: this.getSelected()[0]
			}));
		});
	},

	onClickShareLink: function() {
		import(
			'../../../../../../views/apps/file-browser/dialogs/links/copy-link-dialog-view.js'
		).then((CopyLinkDialogView) => {

			// show copy link dialog
			//
			application.show(new CopyLinkDialogView.default({
				model: this.getSelected()[0].getUrl()
			}));
		});
	},

	onClickDeleteLinks: function() {
		this.deleteShareRequests(this.getSelected());
	}
});