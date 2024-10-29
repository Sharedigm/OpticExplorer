/******************************************************************************\
|                                                                              |
|                          place-general-form-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing information about a file.             |
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
		<div class="name form-group">
			<label class="control-label"><i class="fa fa-font"></i>Name</label>
			<div class="controls">
				<p class="form-control-static">
					<%= name %>
				</p>
			</div>
		</div>

		<% if (description) { %>
		<div class="description form-group">
			<label class="control-label"><i class="fa fa-quote-left"></i>Description</label>
			<div class="controls">
				<p class="form-control-static">
					<%= description %>
				</p>
			</div>
		</div>
		<% } %>
	`)
});