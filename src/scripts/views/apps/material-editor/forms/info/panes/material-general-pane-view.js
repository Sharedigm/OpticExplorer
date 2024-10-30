/******************************************************************************\
|                                                                              |
|                        material-general-pane-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for showing general material information.         |
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
import SpectralLines from '../../../../../../utilities/optics/spectral-lines.js';
import Units from '../../../../../../utilities/math/units.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="refraction form-group">
			<label class="control-label">Refraction (N<sub>d</sub>)</label>
			<div class="controls">
				<p class="form-control-static">
					<%= index_of_refraction %>
				</p>
			</div>
		</div>

		<div class="abbe-number form-group">
			<label class="control-label">Abbe # (V<sub>d</sub>)</label>
			<div class="controls">
				<p class="form-control-static">
					<%= abbe_number %>
				</p>
			</div>
		</div>

		<div class="glass-code form-group">
			<label class="control-label">Glass code</label>
			<div class="controls">
				<p class="form-control-static">
					<%= glass_code %>
				</p>
			</div>
		</div>

		<div class="absorption form-group">
			<label class="control-label">Absorption</label>
			<div class="controls">
				<p class="form-control-static">
					<%= absorption %>
				</p>
			</div>
		</div>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		if (this.model) {
			return {
				index_of_refraction: this.model.getIndexOfRefraction(SpectralLines.helium.d).toPrecision(6),
				abbe_number: this.model.getAbbeNumber().toPrecision(4),
				glass_code: this.model.getGlassCode(),
				absorption: this.model.getAbsorption(new Units(1, 'cm'), SpectralLines.helium.d, 'cm').toString()
			};
		} else {
			return {
				index_of_refraction: undefined,
				abbe_number: undefined,
				glass_code: undefined,
				absorption: undefined				
			}
		}
	}
});