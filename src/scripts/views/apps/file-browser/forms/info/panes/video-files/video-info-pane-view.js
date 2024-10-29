/******************************************************************************\
|                                                                              |
|                            video-info-pane-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing video file information.               |
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
		<% if (typeof resolution != 'undefined' && resolution) { %>
		<div class="form-group">
			<label class="control-label"><i class="fa fa-arrows-alt"></i>Resolution</label>
			<div class="controls">
				<p class="form-control-static">
					<% if (resolution.length > 1) { %>
					<%= resolution[0] %> x <%= resolution[1] %> px
					<% } else { %>
					unknown
					<% } %>
				</p>
			</div>
		</div>
		<% } %>
		
		<div class="form-group">
			<label class="control-label"><i class="fa fa-clock"></i>Duration</label>
			<div class="controls">
				<p class="form-control-static">
					<% if (typeof duration != 'undefined') { %>
					<%= duration %> sec
					<% } else { %>
					unknown
					<% } %>
				</p>
			</div>
		</div>
		
		<div class="form-group">
			<label class="control-label"><i class="fa fa-truck"></i>Bit Rate</label>
			<div class="controls">
				<p class="form-control-static">
					<% if (typeof bit_rate != 'undefined') { %>
					<%= bit_rate %> bps
					<% } else { %>
					unknown
					<% } %>
				</p>
			</div>
		</div>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		let resolution = this.model.get('resolution');
		let tags = this.model.get('tags');

		return {
			resolution: resolution,
			duration: tags? tags.duration : undefined,
			bit_rate: tags? tags.bit_rate : undefined
		};
	}
});