/******************************************************************************\
|                                                                              |
|                              user-badges-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a user's badges.                               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'badges',

	template: template(`
		<% if (is_online) { %>
		<div class="online<% if (is_active) { %> success<% } else { %> caution<% } %> badge" data-toggle="tooltip" title="is online<% if (is_active) { %>, active<% } else { %>, inactive<% } %>" data-placement="bottom">
			<i class="fa fa-wifi"></i>
		</div>
		<% } %>
		
		<% if (has_geolocation) { %>
		<div class="geolocation active badge" data-toggle="tooltip" title="view on map" data-placement="bottom">
			<i class="fa fa-globe-americas"></i>
		</div>
		<% } %>
	`),

	events: {

		// badge events
		//
		'mousedown .geolocation': 'onMouseDownGeolocation',
		'mousedown .online.badge': 'onMouseDownOnlineBadge'
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			is_online: this.model.isOnline(),
			is_active: this.model.isActive(),
			has_geolocation: this.model.hasGeolocation && this.model.hasGeolocation()
		};
	},

	//
	// dialog rendering methods
	//

	showInfoDialog: function() {
		import(
			'../../../../../../views/apps/connection-manager/dialogs/info/connection-info-dialog-view.js'
		).then((ConnectionInfoDialogView) => {

			// show connection info dialog
			//
			application.show(new ConnectionInfoDialogView.default({
				model: this.model
			}));				
		});
	},

	//
	// mouse event handling methods
	//

	onMouseDownGeolocation: function(event) {

		// block event from parent
		//
		this.block(event);

		// launch map viewer
		//
		application.launch('map_viewer', {
			people: [this.model]
		});
	},

	onMouseDownOnlineBadge: function(event) {

		// block event from parent
		//
		this.block(event);

		// show connection's info dialog
		//
		this.showInfoDialog();
	}
});