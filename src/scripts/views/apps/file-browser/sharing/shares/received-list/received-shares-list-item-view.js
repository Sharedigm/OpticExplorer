/******************************************************************************\
|                                                                              |
|                       received-shares-list-item-view.js                      |
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
import Url from '../../../../../../utilities/web/url.js';

export default TableListItemView.extend({

	//
	// attributes
	//

	template: template(`
		<td class="date">
			<%= created_at && created_at.format? created_at.format('mediumDate') : created_at %>
		</td>
		
		<% if (show_path) { %>
		<td class="path">
			<% if (path) { %>
			<a><%= path %></a>
			<% } %>
		</td>
		<% } %>
		
		<td class="sender">
			<% if (owner) { %>
			<a>
				<div class="profile thumbnail" style="background-image:url(<%= owner.getProfilePhotoUrl({min_size: 50}) %>)">
				</div>
				<div class="hidden-xs"><%= owner.getName() %></div>
			</a>
			<% } %>
		</td>
		
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
		'click .path a': 'onClickPath',
		'click .sender a': 'onClickSender'
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
	// getting methods
	//

	getPathUrl: function() {
		return '#home?selected=' + Url.encode(this.model.get('path'));
	},

	getOwnerUrl: function() {
		return '#users/' + Url.encode(this.model.get('owner').get('id'));
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			path: HtmlUtils.encode(this.model.get('path')),
			index: this.options.index,

			// options
			//
			numbered: this.options.numbered,
			show_path: this.options.showPath,

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
			'../../../../../../views/apps/file-browser/sharing/shares/dialogs/edit-share-dialog-view.js'
		).then((EditShareDialogView) => {

			// show edit share dialog
			//
			application.show(new EditShareDialogView.default({
				model: this.model
			}));
		});
		*/
	},

	onClickPath: function() {

		// show shared item
		//
		application.openItem(this.model.getItem());
	},

	onClickSender: function() {

		// show sender's profile info
		//
		application.showUser(this.model.get('owner'));
	}
});