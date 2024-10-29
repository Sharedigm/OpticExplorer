/******************************************************************************\
|                                                                              |
|                          dropbox-volume-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a form for inputing file volume information.                  |
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

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="access-token form-group">
			<label class="required control-label"><i class="fa fa-key"></i>Access Token</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" value="<%= access_token %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Access Token" data-content="This is the token that Dropbox gives you that identifies your volume."></i>
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
			case 'access_token':
				return this.$el.find('.access-token input').val();
		}
	},

	getValues: function() {
		return {
			access_token: this.getValue('access_token')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			access_token: undefined
		};
	}
});