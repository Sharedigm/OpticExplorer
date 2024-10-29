/******************************************************************************\
|                                                                              |
|                            audio-info-pane-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing audio file information.               |
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
		<% if (typeof id3 != 'undefined') { %>
		<% let keys = Object.keys(id3); %>
		<% for (let i = 0; i < keys.length; i++) { %>
		<% let key = keys[i]; %>
		<% let value = id3[key]; %>
		<% if (typeof value == "string") { %>
		<div class="form-group">
			<label class="control-label"><%= key.replace(/_/g, ' ').toTitleCase() %></label>
			<div class="controls">
				<p class="form-control-static" style="word-break:break-all">
					<%= id3[key] %>
				</p>
			</div>
		</div>
		<% } %>
		<% } %>
		<% } %>
	`)
});