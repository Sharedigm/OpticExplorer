/******************************************************************************\
|                                                                              |
|                        image-file-history-pane-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing file history information.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="form-group">
			<label class="control-label"><i class="fa fa-calendar-alt"></i>Captured</label>
			<div class="controls">
				<p class="form-control-static">
					<%= captured_at %>
				</p>
			</div>
		</div>
		
		<div class="form-group">
			<label class="control-label"><i class="fa fa-magic"></i>Created</label>
			<div class="controls">
				<p class="form-control-static">
					<%= created_at %>
				</p>
			</div>
		</div>
		
		<div class="form-group">
			<label class="control-label"><i class="fa fa-pencil-alt"></i>Modified</label>
			<div class="controls">
				<p class="form-control-static">
					<%= modified_at %>
				</p>
			</div>
		</div>
		
		<div class="form-group">
			<label class="control-label"><i class="fa fa-eye"></i>Accessed</label>
			<div class="controls">
				<p class="form-control-static">
					<%= accessed_at %>
				</p>
			</div>
		</div>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			captured_at: this.formatDate(this.model.getCaptureDate()),
			created_at: this.formatDate(this.model.getCreateDate()),
			modified_at: this.formatDate(this.model.getModifyDate()),
			accessed_at: this.formatDate(this.model.getAccessDate()),
		};
	}
});