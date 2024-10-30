/******************************************************************************\
|                                                                              |
|                          stop-element-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying stop element properties.           |
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
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Order" data-content="This is the integer order of the lens, starting at 1 for the front element up to the number of elements for the back element."></i>
				</div>
			</div>
		</div>

		<div class="category form-group">
			<label class="control-label">Category</label>
			<div class="controls">
				<div class="controls">
					<select>
						<option value="Diaphram"<% if (category == undefined) { %> selected <% } %>>Diaphram</option>
						<% for (let i = 0; i < categories.length; i++) { %>
						<option value="<%= categories[i] %>"<% if (category == categories[i]) { %> selected <% } %>><%= categories[i] %></option>
						<% } %>
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

		<div class="aperture form-group">
			<label class="required control-label">Aperture</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="required form-control" name="aperture" value="<%= aperture? aperture.val() : '' %>"<% if (type != 'Iris') { %> disabled<% } %>>
					<div class="input-group-addon">
						<select class="units">
						<% for (let i = 0; i < length_units.length; i++) { %>
							<option value="<%= length_units[i] %>"<% if (aperture && aperture.isIn(length_units[i])) { %> selected<% } %>><%= length_units[i] %></option>
						<% } %>
						</select>
					</div>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Aperture" data-content="This is the aperture of the stop."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="diameter form-group">
			<label class="required control-label">Diameter</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="required form-control" name="diameter" value="<%= diameter? diameter.val() : '' %>"<% if (type != 'Iris') { %> disabled<% } %>>
					<div class="input-group-addon">
						<select class="units">
						<% for (let i = 0; i < length_units.length; i++) { %>
							<option value="<%= length_units[i] %>"<% if (diameter && diameter.isIn(length_units[i])) { %> selected<% } %>><%= length_units[i] %></option>
						<% } %>
						</select>
					</div>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Diameter" data-content="This is the diameter of the stop."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="spacing form-group">
			<label class="control-label">Spacing</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="form-control" name="spacing" value="<%= spacing? spacing.val() : '' %>"<% if (type != 'Iris') { %> disabled<% } %>>
					<div class="input-group-addon">
						<select class="units">
						<% for (let i = 0; i < length_units.length; i++) { %>
							<option value="<%= length_units[i] %>"<% if (spacing && spacing.isIn(length_units[i])) { %> selected<% } %>><%= length_units[i] %></option>
						<% } %>
						</select>
					</div>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Spacing" data-content="This is the spacing between this stop element and the next element."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	events: {
		'change .order select': 'onChangeOrder',
		'change .category select': 'onChangeCategory',
		'change .type select': 'onChangeType',
		'input .aperture input': 'onChangeAperture',
		'change .aperture .units': 'onChangeApertureUnits',
		'input .diameter input': 'onChangeDiameter',
		'change .diameter .units': 'onChangeDiameterUnits',
		'input .spacing input': 'onChangeSpacing',
		'change .spacing .units': 'onChangeSpacingUnits'
	},

	rules: {
		'aperture': {
			positive: true,
			nonzero: true
		},
		'diameter': {
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
		this.aperture = this.model.get('aperture');
		this.diameter = this.model.get('diameter');
		this.spacing = this.model.get('spacing');
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
			case 'aperture': 
				return this.getUnits('.aperture');
			case 'diameter': 
				return this.getUnits('.diameter');
			case 'spacing': 
				return this.getUnits('.spacing');
		}
	},

	getValues: function() {
		return {
			order: this.getValue('order'),
			aperture: this.getValue('aperture'),
			diameter: this.getValue('diameter'),
			spacing: this.getValue('spacing')
		};
	},

	getStopCategory: function(stop, stops) {
		let categories = Object.keys(stops);
		for (let i = 0; i < categories.length; i++) {
			let category = categories[i];
			let types = Object.keys(stops[category]);
			for (let i = 0; i < types.length; i++) {
				let type = types[i];
				let stop2 = stops[category][type];

				// check for a match
				//
				if (stop.aperture == stop2.aperture &&
					stop.diameter == stop2.diameter && 
					stop.spacing == stop2.spacing) {
					return category;
				}
			}
		}
	},

	getStopType: function(stop, stops) {
		let categories = Object.keys(stops);
		for (let i = 0; i < categories.length; i++) {
			let category = categories[i];
			let types = Object.keys(stops[category]);
			for (let i = 0; i < types.length; i++) {
				let type = types[i];
				let stop2 = stops[category][type];

				// check for a match
				//
				if (stop.aperture == stop2.aperture &&
					stop.diameter == stop2.diameter && 
					stop.spacing == stop2.spacing) {
					return type;
				}
			}
		}
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
			case 'aperture':
				this.setUnits('.aperture', value);
				break;
			case 'diameter':
				this.setUnits('.diameter', value);
				break;
			case 'spacing':
				this.setUnits('.spacing', value);
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

	setStop: function(stop) {
		if (stop) {
			this.setValue('aperture', new Units(stop.aperture, 'mm'));
			this.setValue('diameter', new Units(stop.diameter, 'mm'));
			this.setValue('spacing', new Units(stop.spacing, 'mm'));
		}
	},

	setStopDisabled: function(disabled) {
		if (disabled) {
			this.$el.find('.aperture input').prop('disabled', 'disabled');
			this.$el.find('.aperture .units').prop('disabled', 'disabled');
			this.$el.find('.diameter input').prop('disabled', 'disabled');	
			this.$el.find('.diameter .units').prop('disabled', 'disabled');
			this.$el.find('.spacing input').prop('disabled', 'disabled');	
			this.$el.find('.spacing .units').prop('disabled', 'disabled');
		} else {
			this.$el.find('.aperture input').removeAttr('disabled');
			this.$el.find('.aperture .units').removeAttr('disabled');
			this.$el.find('.diameter input').removeAttr('disabled');	
			this.$el.find('.diameter .units').removeAttr('disabled');
			this.$el.find('.spacing input').removeAttr('disabled');	
			this.$el.find('.spacing .units').removeAttr('disabled');
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
		let category = this.getStopCategory(this.model, this.options.stops) || 'Diaphram';
		let categories = Object.keys(this.options.stops);
		let type = this.getStopType(this.model, this.options.stops) || 'Iris';
		let types = category != 'Diaphram'? Object.keys(this.options.stops[category]) : ['Iris'];

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
		let stops = this.options.stops[category];
		let types = stops? Object.keys(stops) : ['Iris'];
		let type = types[0];
		let stop = stops? stops[type] : undefined;

		// update form
		//
		this.setTypes(types);
		this.setStop(stop);
		this.setStopDisabled(stops != undefined);
	},

	onChangeType: function() {
		let category = this.getValue('category');
		let stops = this.options.stops[category];
		let type = this.getValue('type');

		// update form
		//
		this.setStop(stops[type]);
	},

	onChangeAperture: function() {

		// set form value on change
		//
		this.aperture = this.getValue('aperture');
		this.onChange();
	},

	onChangeApertureUnits: function(event) {

		// convert form units on change
		//
		this.aperture = this.aperture.as($(event.target).val());
		this.$el.find('.aperture input').val(this.aperture.val());
		this.onChange();
	},

	onChangeDiameter: function() {

		// set form value on change
		//
		this.diameter = this.getValue('diameter');
		this.onChange();
	},

	onChangeDiameterUnits: function(event) {

		// convert form units on change
		//
		this.diameter = this.diameter.as($(event.target).val());
		this.$el.find('.diameter input').val(this.diameter.val());
		this.onChange();
	},

	onChangeSpacing: function() {

		// set form value on change
		//
		this.spacing = this.getValue('spacing');
		this.onChange();
	},

	onChangeSpacingUnits: function(event) {

		// convert form units on change 
		//
		this.spacing = this.spacing.as($(event.target).val());
		this.$el.find('.spacing input').val(this.spacing.val());
		this.onChange();
	}
});