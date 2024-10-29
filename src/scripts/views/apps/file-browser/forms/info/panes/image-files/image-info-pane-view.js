/******************************************************************************\
|                                                                              |
|                            image-info-pane-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing photo image file information.         |
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
		<% if (resolution) { %>
		<div class="resolution form-group">
			<label class="control-label"><i class="fa fa-arrows-alt"></i>Resolution</label>
			<div class="controls">
				<p class="form-control-static">
					<% if (resolution.length > 1) { %>
					<%= resolution[0] %> x <%= resolution[1] %> px
					<% } else { %>
					<%= resolution %>
					<% } %>
				</p>
			</div>
		</div>
		<% } %>
		
		<% if (dimensions && dimensions.length > 1) { %>
		<div class="dimensions form-group">
			<label class="control-label"><i class="fa fa-arrows-alt"></i>Dimensions</label>
			<div class="controls">
				<p class="form-control-static">
					<% if (typeof dimensions[0] && dimensions[1]) { %>
					<%= dimensions[0] %> x <%= dimensions[1] %>
					<% } else { %>
					<%= dimensions %>
					<% } %>
				</p>
			</div>
		</div>
		<% } %>
		
		<% if (exposure) { %>
		<div class="form-group">
			<label class="control-label"><i class="fa fa-clock"></i>Exposure</label>
			<div class="controls">
				<p class="form-control-static">
					<%= exposure %>
				</p>
			</div>
		</div>
		<% } %>
		
		<% if (aperture) { %>
		<div class="form-group">
			<label class="control-label"><i class="fa fa-dot-circle"></i>Aperture</label>
			<div class="controls">
				<p class="form-control-static">
					<%= aperture %>
				</p>
			</div>
		</div>
		<% } %>
		
		<% if (iso) { %>
		<div class="form-group">
			<label class="control-label"><i class="fa fa-film"></i>ISO</label>
			<div class="controls">
				<p class="form-control-static">
					<%= iso %>
				</p>
			</div>
		</div>
		<% } %>
		
		<% if (focal_length) { %>
		<div class="form-group">
			<label class="control-label"><i class="fa fa-arrows-alt-h"></i>Focal Length</label>
			<div class="controls">
				<p class="form-control-static">
					<%= focal_length %>
				</p>
			</div>
		</div>
		<% } %>
		
		<% if (make_model) { %>
		<div class="form-group">
			<label class="control-label"><i class="fa fa-camera"></i>Make / Model</label>
			<div class="controls">
				<p class="form-control-static">
					<%= make_model %>
				</p>
			</div>
		</div>
		<% } %>

		<% if (upper_left) { %>
		<div class="form-group">
			<label class="control-label"><i class="fa fa-globe-americas"></i>Upper Left</label>
			<div class="controls">
				<p class="form-control-static">
					<%= upper_left %>
				</p>
			</div>
		</div>
		<% } %>

		<% if (upper_right) { %>
		<div class="form-group">
			<label class="control-label"><i class="fa fa-globe-americas"></i>Upper Right</label>
			<div class="controls">
				<p class="form-control-static">
					<%= upper_right %>
				</p>
			</div>
		</div>
		<% } %>

		<% if (lower_left) { %>
		<div class="form-group">
			<label class="control-label"><i class="fa fa-globe-americas"></i>Lower Left</label>
			<div class="controls">
				<p class="form-control-static">
					<%= lower_left %>
				</p>
			</div>
		</div>
		<% } %>

		<% if (lower_right) { %>
		<div class="form-group">
			<label class="control-label"><i class="fa fa-globe-americas"></i>Lower Right</label>
			<div class="controls">
				<p class="form-control-static">
					<%= lower_right %>
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
			resolution: this.model.get('resolution'),
			dimensions: this.model.get('dimensions'),
			exposure: this.model.getAttribute('exposure'),
			aperture: this.model.getAttribute('aperture'),
			iso: this.model.getAttribute('iso'),
			focal_length: this.model.getAttribute('focal_length'),
			make_model: this.model.getAttribute('make_model'),
			upper_left: this.model.getAttribute('upper_left'),
			upper_right: this.model.getAttribute('upper_right'),
			lower_left: this.model.getAttribute('lower_left'),
			lower_right: this.model.getAttribute('lower_right')
		};
	}
});