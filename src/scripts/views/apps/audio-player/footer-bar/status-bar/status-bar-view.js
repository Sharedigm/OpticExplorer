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
		<div class="player-info info-bar">
			<i class="fa fa-info-circle"></i><span class="status">Not Playing</span>
		</div>
		<div class="file-info info-bar" style="display:none"></div>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		let app = this.parent.app;
		return {
			file_size: app.model? app.model.getSize() : '0 tracks',
			status: app.status
		};
	},

	showPlayerStatus: function(status) {
		this.$el.find('.player-info .status').html(status);
		this.$el.find('.player-info').show();
	},

	//
	// event handling methods
	//

	onLoad: function() {
		this.showPlayerStatus('Not playing');
	},

	onChange: function() {
		this.update();
	}
});