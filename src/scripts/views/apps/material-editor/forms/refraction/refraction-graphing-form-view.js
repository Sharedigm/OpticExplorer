/******************************************************************************\
|                                                                              |
|                       refraction-graphing-form-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying refraction graphing.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2015-2018, Megahed Labs LLC, www.optipedia.org          |
\******************************************************************************/

import MaterialGraphingFormView from '../../../../../views/apps/material-editor/forms/materials/material-graphing-form-view.js';
import Units from '../../../../../utilities/math/units.js';

export default MaterialGraphingFormView.extend({

	//
	// attributes
	//

	template: _.template(`
		<div class="form-group" id="domain">
			<label class="control-label">Wavelength</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="min form-control" placeholder="Min"<% if (typeof domain != 'undefined' && domain.min) { %> value="<%= domain.min.val() %>"<% } %>>
					<span class="input-group-addon">-</span>
					<input type="number" class="max form-control" placeholder="Max"<% if (typeof domain != 'undefined' && domain.max) { %> value="<%= domain.max.val() %>"<% } %>>
					<div class="input-group-addon">
						<select class="units">
						<% for (let i = 0; i < length_units.length; i++) { %>
							<option value="<%= length_units[i] %>"<% if (domain.min && domain.min.isIn(length_units[i])) { %> selected<% } %>><%= length_units[i] %></option>
						<% } %>
						</select>
					</div>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Range" data-content="This is the domain over which the equation is valid."></i>
					</div>
				</div>
			</div>

			<label style="margin-left:10px; display:none">
				<input type="checkbox" style="height:1em" />
				Apply to all
			</label>
		</div>

		<div class="form-group" id="range">
			<label class="control-label">Refraction (n)</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="min form-control" placeholder="Min"<% if (typeof range != 'undefined' && range.min) { %> value="<%= range.min %>"<% } %>>
					<span class="input-group-addon">-</span>
					<input type="number" class="max form-control" placeholder="Max"<% if (typeof range != 'undefined' && range.max) { %> value="<%= range.max %>"<% } %>>
					<div class="input-group-addon">
						<div class="units"></div>
					</div>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Range" data-content="This is the range of index values to show."></i>
					</div>
				</div>
			</div>

			<label style="margin-left:10px; display:none">
				<input type="checkbox" style="height:1em" />
				Apply to all
			</label>
		</div>
	`),

	//
	// form attributes
	//

	domain: {
		min: new Units(300, 'nm'),
		max: new Units(800, 'nm')
	},
	range: {
		min: undefined,
		max: undefined
	},

	//
	// event handling methods
	//

	onChange: function() {
		if (this.options.onchange) {
			this.options.onchange('refraction');
		}
	}
});