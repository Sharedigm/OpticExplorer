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
		<div class="focal-length form-group">
			<label class="control-label"><i class="fa fa-arrows-left-right"></i>Focal Length</label>
			<div class="controls">
				<p class="form-control-static">
					<%= focal_length %> mm
				</p>
			</div>
		</div>

		<div class="focal-ratio form-group">
			<label class="control-label"><i class="fa fa-arrows-up-down"></i>Focal Ratio</label>
			<div class="controls">
				<p class="form-control-static">
					F/<%= focal_ratio %>
				</p>
			</div>
		</div>

		<div class="elements form-group">
			<label class="control-label"><i class="fa fa-database rotated flipped"></i>Elements</label>
			<div class="controls">
				<p class="form-control-static">
					<%= num_elements %> elements in <%= num_groups %> groups
				</p>
			</div>
		</div>

		<div class="groups form-group">
			<label class="control-label"><i class="fa fa-gem"></i>Materials</label>
			<div class="controls">
				<p class="form-control-static">
					<%= num_materials %> materials
				</p>
			</div>
		</div>
	`),

	//
	// getting methods
	//

	getModelValue: function(key) {
		let value = this.model.getValue(key);
		if (value) {
			return value.toPrecision(4) / 1;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			focal_length: this.getModelValue('focal_length') || 0,
			focal_ratio: this.getModelValue('focal_ratio') || 0,
			num_elements: this.model.getValue('num_lenses'),
			num_groups: this.model.getValue('num_groups'),
			num_materials: this.model.getValue('num_materials')
		};
	}
});