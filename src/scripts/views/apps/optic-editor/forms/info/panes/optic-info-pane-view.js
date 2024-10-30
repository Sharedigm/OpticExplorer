/******************************************************************************\
|                                                                              |
|                           optic-info-pane-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for showing detailed optic information.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="focal-length form-group">
			<label class="control-label"><i class="fa fa-pencil"></i>Notes</label>
			<div class="controls">
				<p class="form-control-static">
					<%= notes || 'none'%>
				</p>
			</div>
		</div>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			notes: this.model.has('notes')? this.model.get('notes').join("\n") : undefined
		};
	}
});