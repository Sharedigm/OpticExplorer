/******************************************************************************\
|                                                                              |
|                         link-attributes-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for defining link attributes.                     |
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

	className: 'form-horizontal',

	template: template(`
		<div class="role form-group">
			<label class="control-label"><i class="fa fa-check"></i>Role</label>
			<div class="controls">
				<div class="radio-inline">
					<label><input type="radio" name="role" value="viewer"<% if (!editable) { %> checked<% } %>>Viewer</label>
				</div>
				<div class="radio-inline">
					<label><input type="radio" name="role" value="editor"<% if (editable) { %> checked<% } %>>Editor</label>
				</div>
			</div>
		</div>

		<div class="message form-group">
			<label class="control-label"><i class="fa fa-quote-left"></i>Message</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" rows="3" maxlength="1000"><%= message %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Message" data-content="This is an optional message to the recipient of the link."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	//
	// form querying methods
	//

	getValue: function(kind) {
		switch (kind) {
			case 'role':
				return this.$el.find('.role input:checked').val();
			case 'message':
				return this.$el.find('.message textarea').val();
		}
	}
});