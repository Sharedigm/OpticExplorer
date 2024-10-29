/******************************************************************************\
|                                                                              |
|                              status-bar-view.js                              |
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
		<div class="cursor-info info-bar">
			<i class="fa fa-list-ol"></i>Line <span class="line-number">1</span>, Column <span class="column-number">1</span>
		</div>
		
		<div class="file-info info-bar" style="display:none">
			<i class="fa fa-file"></i><span class="file-size"></span>
		</div>
	`),

	//
	// rendering methods
	//

	showCursorInfo: function() {
		let cursor = this.parent.app.getCursor();
		if (cursor) {
			this.$el.find('.line-number').html(cursor.row + 1);
			this.$el.find('.column-number').html(cursor.column + 1);
		}
	},

	showFileInfo: function() {
		if (this.parent.app.model.has('size')) {
			this.$el.find('.file-info').show();
			this.$el.find('.file-info .file-size').html(this.parent.app.model.getSize());
		} else {
			this.$el.find('.file-info').hide();
		}
	},

	update: function() {
		this.showCursorInfo();
		this.showFileInfo();
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