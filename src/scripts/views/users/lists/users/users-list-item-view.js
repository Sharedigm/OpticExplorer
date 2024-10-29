/******************************************************************************\
|                                                                              |
|                           users-list-item-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a single user.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Connections from '../../../../collections/users/connections/connections.js';
import BaseView from '../../../../views/base-view.js';
import Collapsable from '../../../../views/behaviors/expanders/collapsable.js';
import '../../../../utilities/scripting/string-utils.js';
import '../../../../utilities/time/date-utils.js';

export default BaseView.extend(_.extend({}, Collapsable, {

	//
	// attributes
	//

	tagName: 'li',

	template: template(`
		<div class="content">
		
			<div class="tile">
				<a href="<%= href %>" target="_blank">
					<% if (url) { %>
					<div class="thumbnail" style="background-image:url(<%= url %>)" >
						<img style="display:none" src="<%= url %>" onerror="this.classList.add('lost')" />
						<i class="placeholder far fa-user"></i>
					</div>
					<% } else { %>
					<div class="thumbnail">
						<i class="fa fa-user"></i>
					</div>
					<% } %>
				</a>
			</div>
		
			<div class="info">
				<div class="heading">
					<div class="buttons">
						<button type="button" class="btn btn-sm send" data-toggle="tooltip" title="Send Connection Request">
							<i class="fa fa-user-plus"></i>
						</button>
					</div>
		
					<div class="title">
						<a href="<%= href %>" target="_blank"><%= name %></a>
					</div>
				</div>
		
				<div class="fineprint">
					<label class="form-label"><i class="fa fa-home"></i>Home</label>
					<% if (location && (location.has('city') || location.has('state') || location.has('country'))) { %>
					<%= location.get('city') %>, <%= location.get('state') %>
					<%= location.get('country') != 'United States'? location.get('country') : '' %>
					<% if (flag) { %>
					&nbsp;
					<img src='vendor/flags/blank.gif' class='flag flag-<%= flag %>' />
					<% } %>
					<% } %>
				</div>
			</div>
		</div>
	`),

	events: {
		'click .expander': 'onClickExpander',
		'click .send': 'onClickSend'
	},

	//
	// dialog methods
	//

	showConnectionRequestDialog: function() {
		import(
			'../../../../views/users/connection-requests/dialogs/connection-request-dialog-view.js'
		).then((ConnectionRequestDialogView) => {

			// show connection request dialog
			//
			application.show(new ConnectionRequestDialogView.default({
				model: application.session.user,
				collection: new Connections([this.model])
			}));
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			href: application.getUrl() + '#users/' + this.model.get('id'),
			url: this.model.getProfilePhotoUrl({
				min_size: 50
			}),
			name: this.model.getName(),
			flag: this.options.country? this.options.country.getFlag() : undefined,

			// capabilities
			//
			editable: this.options.editable
		};
	},

	onRender: function() {

		// collapse / expand
		//
		if (this.options.collapsed) {
			this.collapse();
		}
	},

	//
	// mouse event handling methods
	//

	onClickExpander: function() {
		this.toggleCollapse();
	},

	onClickSend: function() {
		this.showConnectionRequestDialog();
	}
}));
