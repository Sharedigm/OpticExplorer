/******************************************************************************\
|                                                                              |
|                       material-graphing-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying material graphing.                 |
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

	events: {
		'change #domain .min': 'onChangeDomainMin',
		'change #domain .max': 'onChangeDomainMax',
		'change #domain .units': 'onChangeDomainUnits',
		'change #range .min': 'onChangeRangeMin',
		'change #range .max': 'onChangeRangeMax',
		'change #range .units': 'onChangeRangeUnits',
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