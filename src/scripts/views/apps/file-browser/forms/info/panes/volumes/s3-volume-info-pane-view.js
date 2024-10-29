/******************************************************************************\
|                                                                              |
|                          s3-volume-info-pane-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing information about a volume.           |
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
		<div class="type form-group">
			<label class="control-label"><i class="fa fa-key"></i>Key</label>
			<div class="controls">
				<p class="form-control-static">
					<% if (typeof key != 'undefined') { %><%= key %><% } %>
				</p>
			</div>
		</div>

		<div class="secret form-group">
			<label class="control-label"><i class="fa fa-user-secret"></i>Secret</label>
			<div class="controls">
				<p class="form-control-static">
					<% if (typeof secret != 'undefined') { %><%= secret %><% } %>
				</p>
			</div>
		</div>

		<div class="region form-group">
			<label class="control-label"><i class="fa fa-globe-americas"></i>Region</label>
			<div class="controls">
				<p class="form-control-static">
					<% if (typeof region != 'undefined') { %><%= region %><% } %>
				</p>
			</div>
		</div>

		<div class="bucket form-group">
			<label class="control-label"><i class="fa fa-folder"></i>Bucket</label>
			<div class="controls">
				<p class="form-control-static">
					<% if (typeof bucket != 'undefined') { %><%= bucket %><% } %>
				</p>
			</div>
		</div>
	`)
});