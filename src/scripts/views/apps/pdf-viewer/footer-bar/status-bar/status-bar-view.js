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
		<div class="document-size info-bar" style="display:none>
			<i class="fa fa-arrows-alt"></i><span class="size"></span>
		</div>
		
		<div class="file-size info-bar">
			<i class="fa fa-file"></i><span>No document</span>
		</div>
	`),

	//
	// rendering methods
	//

	showDocumentSize: function(documentSize) {
		this.$el.find('.document-size span').html(documentSize);
		this.$el.find('.document-size').show();
	},

	showFileSize: function(fileSize) {
		this.$el.find('.file-size span').html(fileSize);
		this.$el.find('.file-size').show();
	},

	update: function() {
		if (this.parent.app.model) {
			this.showDocumentSize(this.parent.app.getDocumentSize());
			this.showFileSize(this.parent.app.getFileSize());
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