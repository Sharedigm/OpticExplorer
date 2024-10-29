/******************************************************************************\
|                                                                              |
|                            links-list-item-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a single links list item.                      |
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
		
		<td class="editable">
			<span><%= editable? 'yes' : 'no' %></span>
		</td>

		<td class="message">
			<span data-toggle="tooltip" title="<%= message %>" data-placement="right"><%= message? 'yes' : 'no' %></span>
		</td>
		
		<td class="hits">
			<% if (restricted) { %>
			<label class="error"><%= hits? hits : 0 %></label>
			<% } else { %>
			<%= hits? hits : 0 %>
			<% } %>
		</th>
		
		<td class="limit hidden-xs">
			<%= limit? limit : 'none' %>
		</td>
		
		<td class="expiration hidden-xs">
			<% if (expiration_date) { %>
			<% if (expired) { %>
			<label class="error"><%= expiration_date.format('mediumDate') %></label>
			<% } else { %>
			<%= expiration_date.format('mediumDate') %>
			<% } %>
			<% } else { %>
			none
			<% } %>
		</td>
		
		<td class="protection">
			<% if (protected) { %>
			<i class="fa fa-lock"></i>
			<% } %>
		</td>
		
		<% if (deletable) { %>
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
		'click .path a': 'onClickPath'
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

	getAppIcon: function(app) {
		let html;

		if (app) {
			if (app.startsWith('mailto')) {
				html = '<i class="fa fa-envelope" data-toggle="tooltip" title="' + app.substr(7) + '" data-placement="right"></i>';
			} else {
				switch (app.toLowerCase()) {
					case 'email':
						html = '<i class="fa fa-envelope" data-toggle="tooltip" title="Email" data-placement="right"></i>';
						break;
					case 'facebook':
						html = '<i class="fa fa-facebook-square" data-toggle="tooltip" title="Facebook" data-placement="right"></i>';
						break;
					case 'twitter':
						html = '<i class="fa fa-twitter-square" data-toggle="tooltip" title="Twitter" data-placement="right"></i>';
						break;
					case 'linkedin':
						html = '<i class="fa fa-linkedin-square" data-toggle="tooltip" title="LinkedIn" data-placement="right"></i>';
						break;
					default:
						html = '<i class="fa fa-cloud" data-toggle="tooltip" title="' + app + '" data-placement="right"></i>';
						break;
				}
			}
		}

		return html;
	},

	getUrl: function() {
		return '#home?selected=' + Url.encode(this.model.getPath());
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			path: HtmlUtils.encode(this.model.getPath()),
			url: this.getUrl(),

			// options
			//
			numbered: this.options.numbered,
			show_path: this.options.showPath,

			// capabilities
			//
			editable: this.model.get('editable'),
			deletable: this.options.editable
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
		import(
			'../../../../../../views/apps/file-browser/sharing/links/dialogs/edit-link-dialog-view.js'
		).then((EditLinkDialogView) => {

			// show edit link dialog
			//
			application.show(new EditLinkDialogView.default({
				model: this.model
			}));
		});
	},

	onClickPath: function() {
		application.openItem(this.model.get('target'));
	}
});