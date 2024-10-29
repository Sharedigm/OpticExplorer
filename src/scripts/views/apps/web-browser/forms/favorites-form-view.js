/******************************************************************************\
|                                                                              |
|                            favorites-form-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form used to specify user favorites.                   |
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
		<div class="name form-group">
			<label class="required control-label"><i class="fa fa-font"></i>Name</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" value="<%= name %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Name" data-content="This is your name for the web site or page."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="url form-group">
			<label class="required control-label"><i class="fa fa-cloud"></i>Url</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" value="<%= url %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Url" data-content="This is the web URL of the web site or page."></i>
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
			case 'url':
				return this.$el.find('.url input').val();  
		}
	},

	getValues: function() {
		return {
			name: this.getValue('name'),
			url: this.getValue('url')
		};
	}
});
