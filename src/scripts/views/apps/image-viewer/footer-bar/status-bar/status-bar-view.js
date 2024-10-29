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
		<div class="file-size info-bar" style="display:none">
			<i class="fa fa-file"></i><span>No image</span>
		</div>
		
		<div class="image-size info-bar hidden-xs" style="display:none">
			<i class="fa fa-arrows-alt"></i><span class="info"></span>
		</div>
	`),

	//
	// rendering methods
	//


	update: function() {
		this.showImageSize();
		this.showFileSize();
	},

	showImageSize: function() {
		let model = this.parent.app.model;

		if (model) {
			if (model.has('resolution')) {
				this.$el.find('.image-size .info').html(model.getResolution());
				this.$el.find('.image-size').show();
			} else if (model.has('dimensions')) {
				this.$el.find('.image-size .info').html(model.getDimensions());
				this.$el.find('.image-size').show();
			} else {
				this.$el.find('.image-size .info').html('auto');
				this.$el.find('.image-size').show();
			}
		} else {
			this.$el.find('.image-size').hide();
		}
	},

	showFileSize: function() {
		let model = this.parent.app.model;
		let size = model? model.getSize() : undefined;

		if (size) {
			this.$el.find('.file-size span').html(size);
			this.$el.find('.file-size').show();
		} else {
			this.$el.find('.file-size').hide();
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