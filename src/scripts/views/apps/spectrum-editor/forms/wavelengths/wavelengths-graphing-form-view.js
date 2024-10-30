/******************************************************************************\
|                                                                              |
|                      transmission-graphing-form-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying transmission graphing.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2015-2018, Megahed Labs LLC, www.optipedia.org          |
\******************************************************************************/

import FormView from '../../../../../views/forms/form-view.js';
import Units from '../../../../../utilities/math/units.js';

export default FormView.extend({

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
		</div>

		<div class="form-group" id="range">
			<label class="control-label">Weight</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="min form-control" placeholder="Min"<% if (typeof range != 'undefined') { %> value="<%= range.min %>"<% } %>>
					<span class="input-group-addon">-</span>
					<input type="number" class="max form-control" placeholder="Max"<% if (typeof range != 'undefined') { %> value="<%= range.max %>"<% } %>>
					<div class="input-group-addon">
						<div class="units">%</div>
					</div>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Range" data-content="This is the range of index values to show."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	events: {
		'change #domain .min': 'onChangeDomainMin',
		'change #domain .max': 'onChangeDomainMax',
		'change #domain .units': 'onChangeDomainUnits',
		'change #range .min': 'onChangeRangeMin',
		'change #range .max': 'onChangeRangeMax',
		'change #range .units': 'onChangeRangeUnits',
	},

	//
	// form attributes
	//

	domain: {
		min: new Units(300, 'nm'),
		max: new Units(800, 'nm')
	},
	range: {
		min: 0,
		max: 100
	},

	//
	// form querying methods
	//

	getDomainMin: function() {
		let value = this.$el.find('#domain .min').val();
		let units = this.$el.find('#domain .units').val();
		if (value) {
			if (units) {
				return new Units(value, units);
			} else {
				return parseFloat(value);
			}
		}
	},

	getDomainMax: function() {
		let value = this.$el.find('#domain .max').val();
		let units = this.$el.find('#domain .units').val();
		if (value) {
			if (units) {
				return new Units(value, units);
			} else {
				return parseFloat(value);
			}
		}
	},

	getRangeMin: function() {
		let value = this.$el.find('#range .min').val();
		let units = this.$el.find('#range .units').val();
		if (value) {
			if (units) {
				return new Units(value, units);
			} else {
				return parseFloat(value);
			}
		}
	},

	getRangeMax: function() {
		let value = this.$el.find('#range .max').val();
		let units = this.$el.find('#range .units').val();
		if (value) {
			if (units) {
				return new Units(value, units);
			} else {
				return parseFloat(value);
			}
		}
	},

	getValue: function(key) {
		switch (key) {
			case 'domain':
				return {
					min: this.getDomainMin(), 
					max: this.getDomainMax()
				};
			case 'range': 
				return {
					min: this.getRangeMin(), 
					max: this.getRangeMax()
				};
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			domain: this.domain,
			range: this.range,
			length_units: ['nm', 'um', 'mm', 'm'],
			angle_units: ['deg', 'rad']
		};
	},

	onRender: function() {

		// add popover triggers
		//
		this.addPopovers();
	},

	//
	// event handling methods
	//

	onChange: function() {
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	onChangeDomainMin: function() {
		this.domain.min = this.getDomainMin();
		this.onChange();
	},

	onChangeDomainMax: function() {
		this.domain.max = this.getDomainMax();
		this.onChange();
	},

	onChangeDomainUnits: function(event) {
		let units = $(event.target).val();

		// convert form units on change
		//
		this.domain.min = this.domain.min.as(units);
		this.domain.max = this.domain.max.as(units);
		this.$el.find('#domain .min').val(this.domain.min.val());
		this.$el.find('#domain .max').val(this.domain.max.val());
		this.onChange();	
	},

	onChangeRangeMin: function() {
		this.range.min = this.getRangeMin();
		this.onChange();
	},

	onChangeRangeMax: function() {
		this.range.max = this.getRangeMax();
		this.onChange();
	},

	onChangeRangeUnits: function(event) {
		let units = $(event.target).val();

		// convert form units on change
		//
		this.range.min = this.range.min.as(units);
		this.range.max = this.range.max.as(units);
		this.$el.find('#range .min').val(this.range.min.val());
		this.$el.find('#range .max').val(this.range.max.val());
		this.onChange();	
	}
});