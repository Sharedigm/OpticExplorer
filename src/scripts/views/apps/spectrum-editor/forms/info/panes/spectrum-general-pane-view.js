/******************************************************************************\
|                                                                              |
|                        spectrum-general-pane-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for showing general spectrum information.         |
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
		<div class="description form-group">
			<label class="control-label">Description</label>
			<div class="controls">
				<p class="form-control-static">
					<%= description %>
				</p>
			</div>
		</div>

		<div class="wavelengths form-group">
			<label class="control-label">Wavelengths</label>
			<div class="controls">
				<p class="form-control-static">
					<%= wavelengths %>
				</p>
			</div>
		</div>

		<% if (weights) { %>
		<div class="weights form-group">
			<label class="control-label">Weights</label>
			<div class="controls">
				<p class="form-control-static">
					<%= weights? weights : 'uniform' %>
				</p>
			</div>
		</div>
		<% } %>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			description: this.model.get('description'),
			wavelengths: this.model && this.model.has('wavelengths')? this.model.get('wavelengths').join(', ') : undefined,
			weights: this.model.has('weights')? this.model.get('weights').join(', ') : undefined
		};
	}
});