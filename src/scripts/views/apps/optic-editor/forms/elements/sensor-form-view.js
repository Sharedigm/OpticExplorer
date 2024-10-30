/******************************************************************************\
|                                                                              |
|                             sensor-form-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying sensor element properties.         |
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
import '../../../../../views/forms/validation/alphanumeric-rules.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="order form-group">
			<label class="control-label">Order</label>
			<div class="controls">
				<div class="controls">
					<select>
						<% for (let i = 1; i <= maxOrder; i++) { %>
						<option value="<%= i %>"<% if (i == order) { %> selected <% } %>><%= i %></option>
						<% } %>
					</select>
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Order" data-content="This is the integer order of the sensor, starting at 1 for the front element up to the number of elements for the back element."></i>
				</div>
			</div>
		</div>

		<div class="category form-group">
			<label class="control-label">Category</label>
			<div class="controls">
				<div class="controls">
					<select>
						<% for (let i = 0; i < categories.length; i++) { %>
						<option value="<%= categories[i] %>"<% if (category == categories[i]) { %> selected <% } %>><%= categories[i] %></option>
						<% } %>
						<option value="custom"<% if (category == undefined) { %> selected <% } %>>Custom</option>
					</select>
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Category" data-content="This is the general category of the sensor."></i>
				</div>
			</div>
		</div>

		<div class="type form-group">
			<label class="control-label">Type</label>
			<div class="controls">
				<div class="controls">
					<select>
						<% for (let i = 0; i < types.length; i++) { %>
						<option value="<%= types[i] %>"<% if (type == types[i]) { %> selected <% } %>><%= types[i] %></option>
						<% } %>
					</select>
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Type" data-content="This is the specific type of the sensor."></i>
				</div>
			</div>
		</div>

		<div class="width form-group">
			<label class="required control-label">Width</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="required form-control" name="width" value="<%= width? width.val() : '' %>"<% if (type) { %> disabled<% } %>>
					<div class="input-group-addon">
						<select disabled class="units">
						<% for (let i = 0; i < length_units.length; i++) { %>
							<option value="<%= length_units[i] %>"<% if (width && width.isIn(length_units[i])) { %> selected<% } %>><%= length_units[i] %></option>
						<% } %>
						</select>
					</div>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Width" data-content="This is the width of the sensor."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="height form-group">
			<label class="required control-label">Height</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="required form-control" name="height" value="<%= height? height.val() : '' %>"<% if (type) { %> disabled<% } %>>
					<div class="input-group-addon">
						<select disabled class="units">
						<% for (let i = 0; i < length_units.length; i++) { %>
							<option value="<%= length_units[i] %>"<% if (height && height.isIn(length_units[i])) { %> selected<% } %>><%= length_units[i] %></option>
						<% } %>
						</select>
					</div>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Height" data-content="This is the height of the sensor."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="horizontal form-group" style="display:none">
			<label class="control-label">Horizontal</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="form-control" name="horizontal" value="<%= horizontal %>">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Horizontal" data-content="This is the horizontal resolution of the sensor."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="vertical form-group" style="display:none">
			<label class="control-label">Vertical</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="form-control" name="vertical" value="<%= vertical %>">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Vertical" data-content="This is the vertical resolution of the sensor."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	events: {
		'change .order select': 'onChangeOrder',
		'change .category select': 'onChangeCategory',
		'change .type select': 'onChangeType',
		'input .width input': 'onChangeWidth',
		'change .width .units': 'onChangeWidthUnits',
		'input .height input': 'onChangeHeight',
		'change .height .units': 'onChangeHeightUnits'
	},

	rules: {
		'width': {
			positive: true,
			nonzero: true
		},
		'height': {
			positive: true,
			nonzero: true
		}
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.width = this.model.get('width');
		this.height = this.model.get('height');
		this.horizontal = this.model.get('horizontal');
		this.vertical = this.model.get('vertical');
	},

	//
	// getting methods
	//

	getElementIndex: function() {
		return this.model.hasIndex()? this.model.getIndex() : this.collection.length;
	},

	getMaxElementIndex: function() {
		if (!this.model.hasIndex()) {

			// lens has not been added yet
			//
			return this.collection.length;
		} else {

			// this is an existing lens
			//
			return this.model.collection.length - 1;
		}
	},

	getSensorCategory: function(sensor, sensors) {
		let categories = Object.keys(sensors);
		for (let i = 0; i < categories.length; i++) {
			let category = categories[i];
			let types = Object.keys(sensors[category]);
			for (let i = 0; i < types.length; i++) {
				let type = types[i];
				let sensor2 = sensors[category][type];

				// check for a match
				//
				if (sensor.width == sensor2.width &&
					sensor.height == sensor2.height) {
					return category;
				}
			}
		}
	},

	getSensorType: function(sensor, sensors) {
		let categories = Object.keys(sensors);
		for (let i = 0; i < categories.length; i++) {
			let category = categories[i];
			let types = Object.keys(sensors[category]);
			for (let i = 0; i < types.length; i++) {
				let type = types[i];
				let sensor2 = sensors[category][type];

				// check for a match
				//
				if (sensor.width == sensor2.width &&
					sensor.height == sensor2.height) {
					return type;
				}
			}
		}
	},

	//
	// form getting methods
	//

	getValue: function(kind) {
		switch (kind) {
			case 'order':
				return parseInt(this.$el.find('.order select').val());
			case 'category':
				return this.$el.find('.category select').val();
			case 'type':
				return this.$el.find('.type select').val();
			case 'width': 
				return this.getUnits('.width');
			case 'height': 
				return this.getUnits('.height');
			case 'horizontal': 
				return this.$el.find('.horizontal input').val();
			case 'vertical': 
				return this.$el.find('.vertical input').val();
		}
	},

	getValues: function() {
		return {
			order: this.getValue('order'),
			category: this.getValue('category'),
			type: this.getValue('type'),
			width: this.getValue('width'),
			height: this.getValue('height'),
			horizontal: this.getValue('horizontal'),
			vertical: this.getValue('vertical')
		};
	},

	//
	// setting methods
	//

	setOrder: function(order) {

		// reorder collection
		//
		if (this.model.hasIndex()) {
			if (order != this.model.getIndex() + 1) {
				
				// reorder elements
				//
				this.model.setIndex(order - 1);
			}
		} else {

			// set order on new element
			//
			this.model.order = order;
		}
	},

	//
	// form setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'order':
				this.$el.find('.order select').val(value);
				break;
			case 'category':
				this.$el.find('.category select').val(value);
				break;
			case 'type':
				this.$el.find('.type select').val(value);
				break;
			case 'width':
				this.setUnits('.width', value);
				break;
			case 'height':
				this.setUnits('.height', value);
				break;
			case 'horizontal':
				this.$el.find('.horizontal input').val(value);
				break;
			case 'vertical':
				this.$el.find('.vertical input').val(value);
				break;
		}
	},

	setTypes: function(types) {
		this.$el.find('.type option').remove();
		for (let i = 0; i < types.length; i++) {
			let option = $('<option />').attr('value', types[i]).text(types[i]);
			this.$el.find('.type select').append(option);
		}
	},

	setResolution: function(resolution) {
		if (resolution) {
			this.setValue('width', new Units(resolution.width, 'mm'));
			this.setValue('height', new Units(resolution.height, 'mm'));
		}
	},

	setResolutionDisabled: function(disabled) {
		if (disabled) {
			this.$el.find('.width input').prop('disabled', 'disabled');
			this.$el.find('.width .units').prop('disabled', 'disabled');
			this.$el.find('.height input').prop('disabled', 'disabled');	
			this.$el.find('.height .units').prop('disabled', 'disabled');
		} else {
			this.$el.find('.width input').removeAttr('disabled');
			this.$el.find('.width .units').removeAttr('disabled');
			this.$el.find('.height input').removeAttr('disabled');	
			this.$el.find('.height .units').removeAttr('disabled');
		}
	},

	//
	// form methods
	//

	apply: function() {
		let valid = FormView.prototype.apply.call(this);

		if (valid) {
			this.setOrder(this.getValue('order'));
		}

		return valid;
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let category = this.getSensorCategory(this.model, this.options.sensors);
		let categories = Object.keys(this.options.sensors);
		let type = this.getSensorType(this.model, this.options.sensors);
		let types = category? Object.keys(this.options.sensors[category]) : [];

		return {
			order: this.getElementIndex() + 1,
			maxOrder: this.getMaxElementIndex() + 1,
			category: category,
			categories: categories,
			type: type,
			types: types,
			length_units: Units.units['length']
		};
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

	onChangeOrder: function() {
		this.onChange();
	},

	onChangeCategory: function() {
		let category = this.getValue('category');
		let sensors = this.options.sensors[category];
		let types = sensors? Object.keys(sensors) : [];
		let type = types[0];
		let sensor = type? sensors[type] : undefined;

		// update form
		//
		this.setTypes(types);
		this.setResolution(sensor);
		this.setResolutionDisabled(category != 'custom');
	},

	onChangeType: function() {
		let category = this.getValue('category');
		let sensors = this.options.sensors[category];
		let type = this.getValue('type');

		// update form
		//
		this.setResolution(sensors[type]);
	},

	onChangeWidth: function() {

		// set form value on change
		//
		this.width = this.getValue('width');
		this.onChange();
	},

	onChangeWidthUnits: function(event) {

		// convert form units on change
		//
		this.width = this.width.as($(event.target).val());
		this.$el.find('.width input').val(this.width.val());
		this.onChange();
	},

	onChangeHeight: function() {

		// set form value on change
		//
		this.height = this.getValue('height');
		this.onChange();
	},

	onChangeHeightUnits: function(event) {

		// convert form units on change
		//
		this.height = this.height.as($(event.target).val());
		this.$el.find('.height input').val(this.height.val());
		this.onChange();
	}
});