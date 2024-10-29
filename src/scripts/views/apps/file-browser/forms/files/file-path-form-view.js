/******************************************************************************\
|                                                                              |
|                             file-path-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a form for showing the path of a file or directory.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../views/forms/form-view.js';
import HtmlUtils from '../../../../../utilities/web/html-utils.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="form-group">
			<label class="control-label"><i class="fa fa-sitemap"></i>Path</label>
			<div class="controls">
				<p class="form-control-static">
					<%= path? path.replace(/\\//g, ' / ') : '' %>
				</p>
			</div>
		</div>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			path: HtmlUtils.encode(this.model.get('path'))
		};
	}
});
