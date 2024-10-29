/******************************************************************************\
|                                                                              |
|                               status-bar-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of an application's status information.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'status-bar',

	template: template(`
		<div class="info-bar">
			<i class="fa fa-exclamation-triangle"></i>
			<span class="num-notifications">Loading...</span>
		</div>
	`),

	//
	// constructor
	//

	initialize: function() {

		// listen to collection for changes
		//
		this.listenTo(this.collection, 'add, remove', this.onChange, this);
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.update();
	},

	update: function() {
		let collection = this.parent.app.collection;
		let connection_requests = this.parent.app.connection_requests;
		let numNotifications = collection.length + connection_requests.length;
		this.$el.find('.num-notifications').html(numNotifications + ' notifications');
	},

	//
	// event handling methods
	//

	onLoad: function() {
		this.update();
	},

	onChange: function() {
		this.update();
	}
});