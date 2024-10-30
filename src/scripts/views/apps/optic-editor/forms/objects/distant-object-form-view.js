/******************************************************************************\
|                                                                              |
|                         distant-object-form-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying distant object attributes.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../views/forms/form-view.js';
import Units from '../../../../../utilities/math/units.js';

export default FormView.extend({

	//
	// attributes
	//

	kinds: [
		'object', 'moon', 'planet', 'stars', 'galaxy'
	],

	template: template(`
		<div class="alert alert-warning" style="display:none">
			<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
			<label>Error: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
		</div>

		<div class="kind form-group">
			<label class="control-label">Kind</label>
			<div class="controls">
				<select>
				<% for (let i = 0; i < kinds.length; i++) { %>
					<option value="<%= kinds[i] %>"<% if (typeof kind != 'undefined' && kind == kinds[i]) { %> selected<% } %>><%= kinds[i] %></option>
				<% } %>
				</select>
			</div>
		</div>

		<div class="distance form-group">
			<label class="required control-label">Distance</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="required form-control" value="<%= distance.val() %>">
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
					<input type="number" class="required form-control" value="<%= angle.val() %>">
					<div class="input-group-addon">
						<select class="units">
						<% for (let i = 0; i < angle_units.length; i++) { %>
							<option 
							<% if (!angle_units[i].contains('"')) { %>
							value="<%= angle_units[i] %>"
							<% } else { %>
							value="&quot;"
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
		
		<div class="height form-group">
			<label class="required control-label">Height</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="required form-control" value="<%= height.val() %>">
					<div class="input-group-addon">
						<select class="units">
						<% for (let i = 0; i < angle_units.length; i++) { %>
							<option 
							<% if (!angle_units[i].contains('"')) { %>
							value="<%= angle_units[i] %>"
							<% } else { %>
							value="&quot;"
							<% } %>
							<% if (height && height.isIn(angle_units[i])) { %> selected<% } %>><%= angle_units[i] %></option>
						<% } %>
						</select>
					</div>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Height" data-content="This is the height of the object."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="color form-group">
			<label class="control-label">Color</label>
			<div class="controls">
				<input type="checkbox"<% if (color) { %> checked<% } %> />
				<input type="color"<% if (color) { %> value="<%= color %>"<% } else { %> value="#ff0000"<% } %><% if (!color) { %> style="display:none"<% } %> />
				<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Color" data-content="This is the color to use to visually depict the light rays."></i>
			</div>
		</div>
	`),

	events: {
		'click .alert .close': 'onClickAlertClose',
		'change .kind select': 'onChangeKind',
		'input .distance input': 'onChangeDistance',
		'change .distance .units': 'onChangeDistanceUnits',
		'input .angle input': 'onChangeAngle',
		'change .angle .units': 'onChangeAngleUnits',
		'input .height input': 'onChangeHeight',
		'change .height .units': 'onChangeHeightUnits',
		'click .color input[type="checkbox"]': 'onClickColorCheckbox',
		'change .color input': 'onChangeColor'
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.distance = this.model.get('distance');
		this.angle = this.model.get('angle');
		this.height = this.model.get('height');
		this.color = this.model.get('color');

		// set defaults
		//
		if (this.height == undefined) {
			this.height = this.getDefaultHeight(this.model.get('kind'));
		}
	},

	//
	// querying methods
	//

	useCustomColor: function() {
		return this.$el.find('.color input[type="checkbox"]').is(':checked');
	},

	//
	// getting methods
	//

	getDefaultHeight: function(kind) {
		switch (kind) {
			case 'moon':
				return new Units(0.5, 'deg');
			case 'planet':
				return new Units(30, '"');
			case 'stars':
				return new Units(30, '"');
			case 'galaxy':
				return new Units(1, 'deg');
		}
	},

	//
	// form getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'kind':
				return this.$el.find('.kind select').val();
			case 'distance': 
				return this.getUnits('.distance');
			case 'angle': 
				return this.getUnits('.angle');
			case 'height': 
				return this.getUnits('.height');
			case 'color': {
				if (this.useCustomColor()) {
					return this.$el.find('.color input[type="color"]').val();
				} else {
					return null;
				}
			}
		}
	},

	getValues: function() {
		return {
			kind: this.getValue('kind'),
			distance: this.getValue('distance'),
			angle: this.getValue('angle'),
			height: this.getValue('height'),
			color: this.getValue('color')
		}
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'height':
				this.$el.find('.height input').val(value.value);
				this.$el.find('.height .units').val(value.units);
				break;
			case 'color':
				if (value != undefined) {
					this.$el.find('.color input[type="checkbox"]').prop('checked', true);
					this.$el.find('.color input[type="color"]').val(value);
					this.$el.find('.color input[type="color"]').show();
				} else {
					this.$el.find('.color input[type="checkbox"]').prop('checked', false);
					this.$el.find('.color input[type="color"]').val('#808080');
					this.$el.find('.color input[type="color"]').hide();
				}
				break;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			kinds: this.kinds,
			distance: this.distance,
			angle: this.angle,
			height: this.height,
			length_units: Units.units['length'],
			angle_units: Units.units['angle'],
			color: this.color
		};
	},

	showWarning: function(message) {
		this.$el.find('.alert-warning .message').html(message);
		this.$el.find('.alert-warning').show();
	},

	hideWarning: function() {
		this.$el.find('.alert-warning').hide();
	},

	//
	// event handling methods
	//

	onChange: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	//
	// mouse event handling methods
	//

	onClickAlertClose: function() {
		this.hideWarning();
	},

	onChangeKind: function() {
		let kind = this.getValue('kind');
		this.setValue('height', this.getDefaultHeight(kind));
		// this.setValue('color', this.getDefaultColor(kind));
	},

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

	onChangeAngleUnits: function() {

		// convert form units on change
		//
		this.angle = this.angle.as($(event.target).val());
		this.$el.find('.angle input').val(this.angle.val());
		this.onChange();
	},

	onChangeHeight: function() {

		// set form value on change
		//
		this.height = this.getValue('height');
		this.onChange();
	},

	onChangeHeightUnits: function() {

		// convert form units on change
		//
		this.height = this.height.as($(event.target).val());
		this.$el.find('.height input').val(this.height.val());
		this.onChange();
	},

	onClickColorCheckbox: function() {
		if (this.useCustomColor()) {
			this.$el.find('.color input[type="color"]').show();
		} else {
			this.$el.find('.color input[type="color"]').hide();
		}
		this.color = this.getValue('color');
		this.onChange();
	},

	onChangeColor: function() {
		this.color = this.getValue('color');
		this.onChange();
	}
});