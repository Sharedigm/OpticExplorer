/******************************************************************************\
|                                                                              |
|                             file-name-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a form for inputing the name of a file or directory.          |
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
import FileUtils from '../../../../../utilities/files/file-utils.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="filename form-group">
			<label class="required form-label"><i class="fa fa-quote-left"></i>Name</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required base-name form-control" value="<%= basename %>" />

					<% if (show_extension) { %>
					<span class="input-group-addon">.</span>
					<% if (extensions && extensions.length > 0) { %>
					<div class="input-group-addon">
					<select class="extension">
					<% for (i = 0; i < extensions.length; i++) { %>
					<option value="<%= extensions[i] %>"><%= extensions[i] %></option>
					<% } %>
					</select>
					</div>
					<% } else { %>
					<input type="text" class="required extension form-control" size="4" value="<%= extension %>" />
					<% } %>
					<% } %>
		
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Name" data-content="The name of the item that you would like to save."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	//
	// form querying methods
	//

	getValue: function(key) {
		switch (key) {
			case 'basename':
				return this.$el.find('.base-name').val();
			case 'extension':
				return this.$el.find('.extension').val();
			case 'filename': {
				let baseName = this.getValue('basename');
				let extension = this.getValue('extension');
				return extension? baseName + '.' + extension : baseName;
			}
		}
	},

	getValues: function() {
		return {
			filename: this.getValue('filename')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			basename: FileUtils.getItemBaseName(this.options.filename),
			extension: FileUtils.getFileExtension(this.options.filename),
			extensions: this.options.extensions,
			show_extension: this.options.show_extension || FileUtils.hasFileExtension(this.options.filename)
		};
	},

	onRender: function() {
		this.highlight();
	},

	highlight: function() {
		this.$el.find('input').select();
	}
});