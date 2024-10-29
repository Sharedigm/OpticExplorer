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
		<div class="clip-info info-bar" style="display:none">
			<i class="fa fa-info-circle"></i><span class="info"></span>
		</div>
		
		<div class="file-size info-bar">
			<i class="fa fa-file"></i><span>No video</span>
		</div>
	`),

	//
	// rendering methods
	//

	showClipInfo: function(model) {
		if (model && model.has('tags')) {
			let bitRate = Math.floor(model.get('tags').bit_rate / 1000);
			this.$el.find('.clip-info .info').html(bitRate + ' Kbps');
			this.$el.find('.clip-info').show();
		}
	},

	showFileSize: function(model) {
		if (model) {
			this.$el.find('.file-size span').html(model.getSize());
			this.$el.find('.file-size').show();
		}
	},

	update: function() {
		let model = this.parent.app.model;
		if (model) {
			this.showClipInfo(model);
			this.showFileSize(model);
		}
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