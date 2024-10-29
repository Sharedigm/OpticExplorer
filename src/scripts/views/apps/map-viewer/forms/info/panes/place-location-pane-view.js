/******************************************************************************\
|                                                                              |
|                         place-location-form-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing information about a file.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`

		<div class="coordinates form-group">
			<label class="control-label"><i class="fa fa-globe-americas"></i>Coordinates</label>
			<div class="controls">
				<p class="form-control-static">
					<%= latitude %> &deg N, <%= longitude %> &deg W
				</p>
			</div>
		</div>

		<div class="zoom-level form-group">
			<label class="control-label"><i class="fa fa-search"></i>Zoom Level</label>
			<div class="controls">
				<p class="form-control-static">
					<%= zoom_level %>
				</p>
			</div>
		</div>
	`)
});