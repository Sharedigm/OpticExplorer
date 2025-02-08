/******************************************************************************\
|                                                                              |
|                           book-details-form-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is an editable form view of a user's book.                       |
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
		<div class="isbn_number form-group">
			<label class="control-label"><i class="fa fa-hashtag"></i>ISBN Number</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= isbn_number %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="ISBN Number" data-content="This is the International Standard Book Number of this book."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="url form-group">
			<label class="control-label"><i class="fa fa-cloud"></i>URL</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= url %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="When" data-content="This is the year that this book was published."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'isbn_number':
				return this.$el.find('.isbn_number input').val();
			case 'url':
				return this.$el.find('.url input').val();
		}
	},

	getValues: function() {
		return {
			isbn_number: this.getValue('isbn_number'),
			url: this.getValue('url'),
		};
	}
});