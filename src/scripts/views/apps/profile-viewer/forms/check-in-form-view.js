/******************************************************************************\
|                                                                              |
|                            check-in-form-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form used to specify check in information.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="location form-group">
			<label class="control-label"><i class="fa fa-map-marker-alt"></i>Location</label>
			<div class="controls">
				<p class="form-control-static"><%= latitude %> &deg N, <%= longitude %> &deg W</p>
			</div>
		</div>
		
		<div class="name form-group">
			<label class="required control-label"><i class="fa fa-font"></i>Name</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" name="name" value="<%= name %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Name" data-content="This is the name of your check-in location."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="description form-group">
			<label class="control-label"><i class="fa fa-quote-left"></i>Description</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" rows="4" maxlength="1000"><%= description %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Description" data-content="This is a description of your check-in location."></i>
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
			case 'name':
				return this.$el.find('.name input').val();		
			case 'description':
				return this.$el.find('.description input').val();
		}
	},

	getValues: function() {
		return {
			name: this.getValue('name'),
			description: this.getValue('description')
		};
	}
});
