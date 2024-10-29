/******************************************************************************\
|                                                                              |
|                          item-location-pane-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing item location information.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<% if (place) { %>

		<% if (name) { %>
		<div class="name form-group">
			<label class="control-label"><i class="fa fa-font"></i>Location</label>
			<div class="controls">
				<p class="form-control-static">
					<%= name %>
				</p>
			</div>
		</div>
		<% } %>

		<% if (description) { %>
		<div class="description form-group">
			<label class="control-label"><i class="fa fa-quote-left"></i>Description</label>
			<div class="controls">
				<p class="form-control-static">
					<%= description %>
				</p>
			</div>
		</div>
		<% } %>

		<div class="coordinates form-group">
			<label class="control-label"><i class="fa fa-globe-americas"></i>Coordinates</label>
			<div class="controls">
				<p class="form-control-static">
					<%= latitude %> &deg N, <%= longitude %> &deg W
				</p>
			</div>
		</div>

		<% } else { %>
		No place.
		<% } %>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		let place = this.model.get('place');

		return {
			place: place,
			name: place? place.get('name') : undefined,
			description: place? place.get('description') : undefined,
			latitude: place? place.get('latitude') : undefined,
			longitude: place? place.get('longitude') : undefined
		};
	}
});