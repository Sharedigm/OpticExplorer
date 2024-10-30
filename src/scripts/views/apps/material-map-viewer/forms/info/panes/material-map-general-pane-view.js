/******************************************************************************\
|                                                                              |
|                          optic-general-pane-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for showing general optic information.            |
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
		<div class="materials form-group">
			<label class="control-label"><i class="fa fa-gem"></i>Materials</label>
			<div class="controls">
				<p class="form-control-static">
					<%= materials %> materials
				</p>
			</div>
		</div>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			materials: this.model.numMaterials()
		};
	}
});