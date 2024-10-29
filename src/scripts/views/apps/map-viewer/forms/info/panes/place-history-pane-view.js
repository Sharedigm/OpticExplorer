/******************************************************************************\
|                                                                              |
|                           file-history-form-view.js                          |
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

import FormView from '../../../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="form-group">
			<label class="control-label"><i class="fa fa-magic"></i>Created</label>
			<div class="controls">
				<p class="form-control-static">
					<%= typeof created_at !== 'undefined'? created_at.format() : 'unknown' %>
				</p>
			</div>
		</div>

		<div class="form-group">
			<label class="control-label"><i class="fa fa-pencil-alt"></i>Updated</label>
			<div class="controls">
				<p class="form-control-static">
					<%= typeof updated_at !== 'undefined'? updated_at.format() : 'unknown' %>
				</p>
			</div>
		</div>
	`)
});
