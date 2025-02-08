/******************************************************************************\
|                                                                              |
|                             actions-panel-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a type of sidebar panel.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Connections from '../../../../../collections/connections/connections.js';
import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'actions panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-play-circle"></i>Actions</label>
		</div>
		
		<ul class="nav menu">
			<li class="connect"><a><i class="fa fa-user-plus"></i>Connect</a></li>
			<li class="disconnect"><a><i class="fa fa-xmark"></i>Disconnect</a></li>
			<li class="check-in"><a><i class="fa fa-map-marker-alt"></i>Check In</a></li>
			<li class="check-out"><a><i class="fa fa-xmark"></i>Check Out</a></li>
		</ul>
	`),

	events: {
		'click .connect': 'onClickConnect',
		'click .disconnect': 'onClickDisconnect',
		'click .check-in': 'onClickCheckIn',
		'click .check-out': 'onClickCheckOut'
	},

	//
	// sending methods
	//

	sendConnectionRequest: function() {
		application.loadAppView('connection_manager', {

			// callbacks
			//
			success: (ConnectionManagerView) => {
				ConnectionManagerView.showConnectionRequestDialog({
					model: application.session.user,
					collection: new Connections([this.model])
				});
			}
		});
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		SideBarPanelView.prototype.onRender.call(this);

		// hide / show actions 
		//
		if (this.model.isCurrent()) {
			this.$el.find('.connect').hide();
			this.$el.find('.disconnect').hide();
		} else {
			this.$el.find('.check-in').hide();
			this.$el.find('.check-out').hide();
		}
		if (this.model.isConnection()) {
			this.$el.find('.connect').hide();
		} else {
			this.$el.find('.disconnect').hide();
		}
	},

	//
	// mouse event handling methods
	//

	onClickConnect: function() {
		this.sendConnectionRequest();
	},

	onClickDisconnect: function() {
		this.app.deleteConnection();
	},

	onClickCheckIn: function() {
		this.app.checkIn({
			name: 'My Location'
		});
	},

	onClickCheckOut: function() {
		this.app.checkOut();
	}
});