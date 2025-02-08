/******************************************************************************\
|                                                                              |
|                        job-description-form-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a editable form view of a user's job.                         |
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
		<div class="description form-group">
			<label class="control-label"><i class="fa fa-quote-left"></i>What</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" rows="10" maxlength="1000"><%= description %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="What" data-content="This is a description of your job."></i>
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
			case 'description':
				return this.$el.find('.description textarea').val();
		}
	},

	getValues: function() {
		return {
			description: this.getValue('description')
		};
	}
});