/******************************************************************************\
|                                                                              |
|                           select-range-form-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form used to select a range of lines to select.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="username form-group">
			<label class="control-label"><i class="normal fa fa-user"></i>Line #</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="start form-control"<% if (start) { %> value="<%= start %>"<% } %>>
					<div class="input-group-addon">
						-
					</div>
					<input type="number" class="end form-control"<% if (end) { %> value="<%= end %>"<% } %>>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Line #" data-content="This is the range of lines to select."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			start: this.options.start,
			end: this.options.end
		};
	},

	//
	// form methods
	//

	submit: function() {
		
		// check form validation
		//
		if (!this.isValid()) {
			return false;
		}

		let start = parseInt(this.$el.find('.start').val());
		let end = parseInt(this.$el.find('.end').val());

		// perform callback
		//
		this.options.accept(start, end);
	}
});
