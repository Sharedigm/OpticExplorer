/******************************************************************************\
|                                                                              |
|                      material-wavelengths-form-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying material wavelengths.              |
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
import LightUtils from '../../../../../utilities/optics/light-utils.js';

export default FormView.extend({

	//
	// attributes
	//

	template: _.template(`
		<% let keys = Object.keys(wavelengths); %>
		<% for (let i = 0; i < keys.length; i++) { %>
		<% let key = keys[i]; %>
		<% let isChecked = !selected || selected.includes(key); %>
		<div class="wavelength form-group" id="wavelength<%= i %>">
			<div class="checkbox-inline">
				<label><input type="checkbox"<% if (isChecked) { %> checked<% } %>>
					<%= key %> (<%= wavelengths[key].toString({ precision: 3 }) %>)
				</label>
				<div class="tile" style="background-color:<%= colors[i] %>"></div>
			</div>
		</div>
		<% } %>

		<div class="form-group" id="all">
			<div class="checkbox-inline">
				<label><input type="checkbox" checked>
				All
				</label>
			</div>
		</div>

		<div class="form-group" id="none" style="display:none">
			<div class="checkbox-inline">
				<label><input type="checkbox">
				None
				</label>
			</div>
		</div>

		<div class="form-group" id="invert" style="display:none">
			<div class="checkbox-inline">
				<label><input type="checkbox">
				Invert
				</label>
			</div>
		</div>
	`),

	events: {
		'change .wavelength input': 'onChangeWavelength',
		'change #all input': 'onChangeAll',
		'change #none input': 'onChangeNone',
		'change #invert input': 'onChangeInvert'
	},

	//
	// getting methods
	//

	getValues: function() {
		let values = [];
		let items = this.$el.find('.wavelength input');
		let keys = Object.keys(this.options.wavelengths);
		for (let i = 0; i < items.length; i++) {
			values.push({
				wavelength: keys[i],
				checked: $(items[i]).is(':checked')
			});
		}
		return values;
	},

	getColors: function(wavelengths) {
		let colors = [];
		let keys = Object.keys(wavelengths);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let wavelength = wavelengths[key];
			colors.push(LightUtils.wavelengthToColor(wavelength));
		}
		return colors;
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'selected':
				this.options.selected = value;
				if (value) {
					this.setSelected(value);
				}
				break;
		}
	},

	setSelected: function(selected) {
		let checkboxes = this.$el.find('.wavelength input');
		for (let i = 0; i < selected.length; i++) {
			$(checkboxes[i]).prop('checked', selected[i].checked);
		}
	},

	//
	// selection methods
	//

	selectAll: function() {
		this.$el.find('.wavelength input').prop('checked', true);
	},

	deselectAll: function() {
		this.$el.find('.wavelength input').prop('checked', false);
	},

	selectInvert: function() {
		let checkboxes = this.$el.find('.wavelength input');
		for (let i = 0; i < checkboxes.length; i++) {
			let checkbox = checkboxes[i];
			let isChecked = $(checkbox).is(':checked');
			$(checkbox).prop('checked', !isChecked);
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			wavelengths: this.options.wavelengths,
			selected: this.options.selected,
			colors: this.getColors(this.options.wavelengths)
		};
	},

	//
	// event handling methods
	//

	onChangeWavelength: function() {
		this.$el.find('#none input').prop('checked', false);
		this.$el.find('#all input').prop('checked', false);
		this.$el.find('#invert input').prop('checked', false);

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange('wavelengths');
		}
	},

	onChangeAll: function(event) {
		let isChecked = event.target.checked;
		this.$el.find('.wavelength input').prop('checked', isChecked);
		this.$el.find('#none input').prop('checked', false);
		this.$el.find('#invert input').prop('checked', false);

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange('wavelengths');
		}
	},

	onChangeNone: function(event) {
		let isChecked = event.target.checked;
		if (isChecked) {
			this.$el.find('.wavelength input').prop('checked', false);
			this.$el.find('#all input').prop('checked', false);
			this.$el.find('#invert input').prop('checked', false);
		}

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange('wavelengths');
		}
	},

	onChangeInvert: function() {
		this.selectInvert();
		this.$el.find('#all input').prop('checked', false);
		this.$el.find('#none input').prop('checked', false);

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange('wavelengths');
		}
	}
});