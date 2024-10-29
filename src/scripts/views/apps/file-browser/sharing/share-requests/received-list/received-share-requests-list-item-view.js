/******************************************************************************\
|                                                                              |
|                  received-share-requests-list-item-view.js                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a received share requests list item.           |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TableListItemView from '../../../../../../views/collections/tables/table-list-item-view.js';
import HtmlUtils from '../../../../../../utilities/web/html-utils.js';

export default TableListItemView.extend({

	//
	// attributes
	//

	template: template(`
		<% if (!hidden['date']) { %>
		<td class="date">
			<%= created_at && created_at.format? created_at.format('mediumDate') : created_at %>
		</td>
		<% } %>
		
		<% if (!hidden['path']) { %>
		<td class="path">
			<%= path %>
		</td>
		<% } %>
		
		<% if (!hidden['sender']) { %>
		<td class="sender">
			<% if (user) { %>
			<div class="profile thumbnail" style="background-image:url(<%= user.getProfilePhotoUrl({min_size: 50}) %>)">
			</div>
			<div class="hidden-xs"><%= user.getName() %></div>
			<% } %>
		</td>
		<% } %>
		
		<% if (!hidden['message']) { %>
		<td class="message">
			<span data-toggle="tooltip" title="<%= message %>" data-placement="right"><%= message? 'yes' : 'no' %></span>
		</td>
		<% } %>
		
		<% if (!hidden['share_as']) { %>
		<td class="share-as hidden-xs">
			<%= copy? 'copy' : 'reference' %>
		</th>
		<% } %>
		
		<% if (!hidden['status']) { %>
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
		<% } %>
		
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
		'dblclick': 'onDoubleClick'
	},

	//
	// constructor
	//

	initialize: function() {

		// listen to model for changes
		//
		this.listenTo(this.model, 'change', this.onChange);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			path: HtmlUtils.encode(this.model.get('path')),

			// options
			//
			numbered: this.options.numbered,
			hidden: this.options.hidden,

			// capabilties
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
	}
});