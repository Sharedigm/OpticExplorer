/******************************************************************************\
|                                                                              |
|                           distant-light-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying distant light attributes.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import LightFormView from '../../../../../views/apps/optic-editor/forms/lights/light-form-view.js';
import Units from '../../../../../utilities/math/units.js';
import '../../../../../views/forms/validation/alphanumeric-rules.js';

export default LightFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="alert alert-warning" style="display:none">
			<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
			<label>Error: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
		</div>

		<div class="distance form-group">
			<label class="required control-label">Distance</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="required form-control" value="<%= distance? distance.toStr() : 0 %>">
					<div class="input-group-addon">
						<select class="units">
						<% for (let i = 0; i < length_units.length; i++) { %>
							<option value="<%= length_units[i] %>"<% if (distance && distance.isIn(length_units[i])) { %> selected<% } %>><%= length_units[i] %></option>
						<% } %>
						</select>
					</div>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Distance" data-content="This is the distance between the light and the optical system."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="angle form-group">
			<label class="required control-label">Angle</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="required form-control" value="<%= angle? angle.toStr() : 0 %>">
					<div class="input-group-addon">
						<select class="units">
						<% for (let i = 0; i < angle_units.length; i++) { %>
							<option 
							<% if (!angle_units[i].contains('"')) { %>
							value="<%= angle_units[i] %>"
							<% } else { %>
							value='<%= angle_units[i] %>'
							<% } %>
							<% if (angle && angle.isIn(angle_units[i])) { %> selected<% } %>><%= angle_units[i] %></option>
						<% } %>
						</select>
					</div>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Angle" data-content="This is the angle between the light and the optical axis."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="number-of-rays form-group">
			<label class="required control-label"># of Rays</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="required form-control" name="number-of-rays" value="<%= number_of_rays %>">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Number of rays" data-content="This is the number of rays to trace from the light."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="spectrum form-group">
			<label class="control-label">Spectrum</label>
			<div class="controls">
				<input type="text" class="form-control" value="<%= spectrum || 'none' %>" style="width:50%; float:left; margin-right:10px" readonly />
				<button class="clear warning btn btn-sm" data-toggle="tooltip" title="Clear Spectrum"<% if (!spectrum) { %> disabled<% } %>>
					<i class="active fa fa-xmark"></i>
				</button>
				<button class="select btn"><i class="fa fa-mouse-pointer"></i>Select</button>
			</div>
		</div>

		<div class="color form-group">
			<label class="control-label">Color</label>
			<div class="controls">
				<input type="checkbox"<% if (color) { %> checked<% } %><% if (spectrum) { %> disabled<% } %> />
				<input type="color"<% if (color) { %> value="<%= color %>"<% } else { %> value="#ff0000"<% } %><% if (!color) { %> style="display:none"<% } %> />
				<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Color" data-content="This is the color to use to visually depict the light rays."></i>
			</div>
		</div>
	`),

	events: {
		'click .alert .close': 'onClickAlertClose',
		'input .distance input': 'onChangeDistance',
		'change .distance .units': 'onChangeDistanceUnits',
		'input .angle input': 'onChangeAngle',
		'change .angle .units': 'onChangeAngleUnits',
		'input .number-of-rays input': 'onChangeNumberOfRays',
		'click .spectrum button.clear': 'onClickClearSpectrumButton',
		'click .spectrum button.select': 'onClickSelectSpectrumButton',
		'click .color input[type="checkbox"]': 'onClickColorCheckbox',
		'change .color input': 'onChangeColor',
	},
			
	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		LightFormView.prototype.initialize.call(this);

		// set attributes
		//
		this.distance = this.model.get('distance');
		this.angle = this.model.get('angle');
		this.number_of_rays = this.model.get('number_of_rays');
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'distance': 
				return this.getUnits('.distance');
			case 'angle': 
				return this.getUnits('.angle');
			case 'number_of_rays':
				return parseInt(this.$el.find('.number-of-rays input').val());	
			default:
				return LightFormView.prototype.getValue.call(this, key);	
		}
	},

	getValues: function() {
		return {
			distance: this.getValue('distance'),
			angle: this.getValue('angle'),
			number_of_rays: this.getValue('number_of_rays'),
			spectrum: this.getValue('spectrum'),
			color: this.getValue('color')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			distance: this.distance,
			length_units: Units.units['length'],
			angle: this.angle,
			angle_units: Units.units['angle'],
			number_of_rays: this.number_of_rays,
			spectrum: this.spectrum? this.spectrum.get('name') : undefined,
			color: this.color
		};
	},

	//
	// mouse event handling methods
	//

	onChangeDistance: function() {

		// set form value on change
		//
		this.distance = this.getValue('distance');
		this.onChange();
	},

	onChangeDistanceUnits: function() {

		// convert form units on change
		//
		this.distance = this.distance.as($(event.target).val());
		this.$el.find('.distance input').val(this.distance.val());
		this.onChange();
	},

	onChangeAngle: function() {

		// set form value on change
		//
		this.angle = this.getValue('angle');
		this.onChange();
	},

	onChangeAngleUnits: function(event) {

		// convert form units on change
		//
		this.angle = this.angle.as($(event.target).val());
		this.$el.find('.angle input').val(this.angle.val());
		this.onChange();
	},

	onChangeNumberOfRays: function() {
		this.number_of_rays = this.getValue('number_of_rays');
		this.onChange();
	}
});