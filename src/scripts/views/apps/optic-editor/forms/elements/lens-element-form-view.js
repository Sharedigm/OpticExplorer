/******************************************************************************\
|                                                                              |
|                          lens-element-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying lens element properties.           |
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
		
		<div class="thickness form-group">
			<label class="required control-label">Thickness</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="required form-control" name="thickness" value="<%= thickness? thickness.toStr() : '' %>">
					<div class="input-group-addon">
						<select class="units">
						<% for (let i = 0; i < length_units.length; i++) { %>
							<option value="<%= length_units[i] %>"<% if (thickness && thickness.isIn(length_units[i])) { %> selected<% } %>><%= length_units[i] %></option>
						<% } %>
						</select>
					</div>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Thickness" data-content="This is the center thickness of the lens element."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="spacing form-group">
			<label class="control-label">Spacing</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="form-control" name="spacing" value="<%= spacing? spacing.toStr() : '' %>">
					<div class="input-group-addon">
						<select class="units">
						<% for (let i = 0; i < length_units.length; i++) { %>
							<option value="<%= length_units[i] %>"<% if (spacing && spacing.isIn(length_units[i])) { %> selected<% } %>><%= length_units[i] %></option>
						<% } %>
						</select>
					</div>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Spacing" data-content="This is the spacing between this lens element and the next element."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="edges form-group">
			<label class="control-label">Edges</label>
			<div class="controls">
				<label class="checkbox-inline">
					<input type="checkbox"<% if (beveled) { %> checked<% } %>>
					Bevelled
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Edges" data-content="This is whether or not to bevel the edges of a lens with differing front and back surface diameters. This does not affect the optical properties of the lens."></i>
				</label>
			</div>
		</div>
	`),

	events: {
		'change .order select': 'onChangeOrder',
		'input .thickness input': 'onChangeThickness',
		'change .thickness .units': 'onChangeThicknessUnits',
		'input .spacing input': 'onChangeSpacing',
		'change .spacing .units': 'onChangeSpacingUnits',
		'change .edges input': 'onChangeEdges'
	},

	rules: {
		'thickness': {
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
		this.thickness = this.model.get('thickness');
		this.spacing = this.model.get('spacing');
		this.beveled = this.model.get('beveled');
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
	// form methods
	//

	getValue: function(kind) {
		switch (kind) {
			case 'order':
				return parseInt(this.$el.find('.order select').val());
			case 'thickness': 
				return this.getUnits('.thickness');
			case 'spacing': 
				return this.getUnits('.spacing');
			case 'beveled':
				return this.$el.find('.edges input').is(':checked');
		}
	},

	getValues: function() {
		return {
			order: this.getValue('order'),
			thickness: this.getValue('thickness'),
			spacing: this.getValue('spacing'),
			beveled: this.getValue('beveled')
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
		return {
			order: this.getElementIndex() + 1,
			maxOrder: this.getMaxElementIndex() + 1,
			beveled: this.model.get('beveled'),
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

	onChangeThickness: function() {

		// set form value on change
		//
		this.thickness = this.getValue('thickness');
		this.onChange();
	},

	onChangeThicknessUnits: function(event) {

		// convert form units on change
		//
		this.thickness = this.thickness.as($(event.target).val());
		this.$el.find('.thickness input').val(this.thickness.val());
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
	},

	onChangeEdges: function() {

		// set form value on change
		//
		this.beveled = this.getValue('beveled');
		this.onChange();
	}
});