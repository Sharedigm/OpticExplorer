/******************************************************************************\
|                                                                              |
|                          directory-info-pane-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing information about a directory.        |
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
		<div class="kind form-group">
			<label class="control-label"><i class="fa fa-question"></i>Kind</label>
			<div class="controls">
				<p class="form-control-static">
					Folder
				</p>
			</div>
		</div>
		
		<% if (typeof path != 'undefined') { %>
		<div class="path form-group">
			<label class="control-label"><i class="fa fa-sitemap"></i>Path</label>
			<div class="controls">
				<p class="form-control-static">
					<%= path %>
				</p>
			</div>
		</div>
		<% } %>
		
		<div class="contents form-group">
			<label class="control-label"><i class="fa fa-folder"></i>Contents</label>
			<div class="controls">
				<p class="form-control-static">
					<%= contents %>
				</p>
			</div>
		</div>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			path: this.model.has('path')? this.model.get('path').replace(/\//g, ' / ') : '',
			contents: this.model.getSize()
		};
	}
});