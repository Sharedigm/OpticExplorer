/******************************************************************************\
|                                                                              |
|                              sent-shares-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a user's sent share requests.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Shares from '../../../../../../collections/storage/sharing/shares.js';
import BaseView from '../../../../../../views/base-view.js';
import SentSharesListView from '../../../../../../views/apps/file-browser/sharing/shares/sent-list/sent-shares-list-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="shares-list panel"></div>
		
		<div class="buttons">
			<button class="delete-shares btn btn-lg" disabled>
				<i class="fa fa-trash-alt"></i>Delete Shares
			</button>
		</div>
	`),

	regions: {
		list: {
			el: '.shares-list',
			replaceElement: true
		}
	},

	events: {
		'mousedown': 'onMouseDown',
		'click .delete-shares': 'onClickDeleteShares'
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
			new Shares(shareRequests).destroy();

			// disable delete button
			//
			this.$el.find('.delete-shares').prop('disabled', true);			
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		new Shares().fetchSentBy(this.model, {

			// callbacks
			//
			success: (collection) => {
				this.showSharesList(collection);
			}
		});
	},

	showSharesList: function(links) {
		this.showChildView('list', new SentSharesListView({
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

		// enable / disable delete shares button
		//
		this.$el.find('.delete-shares').prop('disabled', !this.hasSelected());
	},

	//
	// mouse event handling methods
	//

	onMouseDown: function(event) {

		// deselect previously selected items
		//
		if (!$(event.target).attr('class').contains('btn')) {
			if (this.hasChildView('list')) {
				this.getChildView('list').deselectAll();
			}
		}
	},

	onClickDeleteShares: function() {
		this.deleteShareRequests(this.getSelected());
	}
});