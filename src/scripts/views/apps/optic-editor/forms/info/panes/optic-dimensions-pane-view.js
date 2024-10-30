/******************************************************************************\
|                                                                              |
|                         optic-dimensions-pane-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for showing optic dimensions information.         |
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
		<div class="aperture form-group">
			<label class="control-label"><i class="fa fa-arrows-up-down"></i>Aperture</label>
			<div class="controls">
				<p class="form-control-static">
					<%= aperture %> mm
				</p>
			</div>
		</div>

		<div class="length form-group">
			<label class="control-label"><i class="fa fa-arrows-left-right"></i>Length</label>
			<div class="controls">
				<p class="form-control-static">
					<%= length %> mm
				</p>
			</div>
		</div>

		<div class="elements form-group">
			<label class="control-label"><i class="fa fa-arrows-left-right"></i>Back FL</label>
			<div class="controls">
				<p class="form-control-static">
					<%= back_focal_length %> mm
				</p>
			</div>
		</div>

		<div class="total-track form-group">
			<label class="control-label"><i class="fa fa-arrows-left-right-to-line"></i>Total Track</label>
			<div class="controls">
				<p class="form-control-static">
					<%= total_track_length %> mm
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
			aperture: this.getModelValue('aperture') || 0,
			length: this.getModelValue('optical_length') || 0,
			back_focal_length: this.getModelValue('back_focal_length') || 0,
			total_track_length: this.getModelValue('total_track_length') || 0
		};
	}
});