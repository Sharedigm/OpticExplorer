/******************************************************************************\
|                                                                              |
|                      chat-invitations-list-item-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a single chat invitations list item.           |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TableListItemView from '../../../../../../views/collections/tables/table-list-item-view.js';

export default TableListItemView.extend({

	//
	// attributes
	//

	template: template(`
		<td class="date">
			<%= created_at? created_at.format('mediumDate') : 'none' %>
		</td>
		
		<td class="sender">
			<% if (sender) { %>
			<a>
				<div class="profile thumbnail" style="background-image:url(<%= sender.getProfilePhotoUrl({min_size: 50}) %>)">
				</div>
				<%= sender.getName() %>
			</a>
			<% } %>
		</td>
		
		<td class="recipient">
			<% if (recipient) { %>
			<a>
				<div class="profile thumbnail" style="background-image:url(<%= recipient.getProfilePhotoUrl({min_size: 50}) %>)">
				</div>
				<%= recipient.getName() %>
			</a>
			<% } %>
		</td>
		
		<td class="message">
			<span data-toggle="tooltip" title="<%= message %>" data-placement="right"><%= message? 'yes' : 'no' %></span>
		</td>
		
		<td class="status">
			<% if (status == 'accepted') { %>
			<span class="success"><%= status %></span>
			<% } else if (status == 'pending') { %>
			<span class="caution"><%= status %></span>
			<% } else if (status == 'declined' || status == 'deleted') { %>
			<span class="error"><%= status %></span>
			<% } else { %>
			<%= status %>
			<% } %>
		</th>
		
		<% if (editable) { %>
		<td class="delete">
			<button type="button" class="btn btn-sm" data-toggle="tooltip" title="Delete" tabindex="-1">
				<i class="fa fa-xmark"></i>
			</button>
		</td>
		<% } %>
	`),

	events: {
		'mousedown': 'onMouseDown',
		'dblclick': 'onDoubleClick',
		'click .sender a': 'onClickSender',
		'click .recipient a': 'onClickRecipient'
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.parent = this.options.parent;

		// listen to model for changes
		//
		this.listenTo(this.model, 'change', this.onChange);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {

			// options
			//
			numbered: this.options.numbered,

			// capabilities
			//
			editable: this.options.editable
		};
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.render();
	},

	//
	// mouse event handling methods
	//

	onMouseDown: function(event) {
		if (this.parent.options.multipleSelectable && event.shiftKey) {

			// shift clicking
			//
			if (this.parent.clickedIndex != undefined) {
				let selected = !this.isSelected();

				// select / deselect range
				//
				this.parent.setSelectedRange(this.parent.clickedIndex, this.options.index, selected);
			} else {
				this.toggleSelect();
			}

			// reset index for shift clicking
			//
			this.parent.clickedIndex = undefined;
		} else {

			// if not shift clicking then deselect all
			//
			this.parent.deselectAll();
			this.select();

			// save index for shift clicking
			//
			this.parent.clickedIndex = this.options.index;
		}

		if (this.parent.onChange) {
			this.parent.onChange();
		}

		// block event from parent
		//
		this.block(event);
	},

	onDoubleClick: function() {
		/*
		import(
			'../../../../../../views/apps/file-browser/sharing/share-requests/dialogs/edit-share-request-dialog-view.js'
		).then((EditShareRequestDialogView) => {

			// show edit share request dialog
			//
			application.show(new EditShareRequestDialogView.default({
				model: this.model
			}));
		});
		*/
	},

	onClickSender: function() {

		// show sender's profile info
		//
		application.showUser(this.model.get('sender'));
	},

	onClickRecipient: function() {

		// show recipient's profile info
		//
		application.showUser(this.model.get('recipient'));
	}
});