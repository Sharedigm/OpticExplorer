/******************************************************************************\
|                                                                              |
|                          optic-analysis-pane-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for showing optic analysis information.           |
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
		<div class="min-abbe form-group">
			<label class="control-label"><i class="fa fa-arrow-right"></i>Min Abbe</label>
			<div class="controls">
				<p class="form-control-static">
					<%= min_abbe %>
				</p>
			</div>
		</div>

		<div class="max-abbe form-group">
			<label class="control-label"><i class="fa fa-arrow-left"></i>Max Abbe</label>
			<div class="controls">
				<p class="form-control-static">
					<%= max_abbe %>
				</p>
			</div>
		</div>

		<div class="min-index form-group">
			<label class="control-label"><i class="fa fa-arrow-up"></i>Min Index</label>
			<div class="controls">
				<p class="form-control-static">
					<%= min_index %>
				</p>
			</div>
		</div>

		<div class="max-index form-group">
			<label class="control-label"><i class="fa fa-arrow-down"></i>Max Index</label>
			<div class="controls">
				<p class="form-control-static">
					<%= max_index %>
				</p>
			</div>
		</div>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			min_abbe: this.model.getValue('min_abbe'),
			max_abbe: this.model.getValue('max_abbe'),
			min_index: this.model.getValue('min_index'),
			max_index: this.model.getValue('max_index')
		};
	}
});