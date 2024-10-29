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
			<i class="fa fa-hashtag"></i><span class="num-topics">No topics</span> topics
		</div>
	`),

	//
	// rendering methods
	//

	update: function() {
		this.$el.find('.num-topics').html(this.parent.app.numTopics());
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.render();
	}
});