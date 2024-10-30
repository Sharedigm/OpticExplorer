/******************************************************************************\
|                                                                              |
|                             camera-form-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying camera element properties.         |
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
import '../../../../../views/forms/validation/alphanumeric-rules.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="category form-group">
			<label class="control-label">Category</label>
			<div class="controls">
				<div class="controls">
					<select>
						<% for (let i = 0; i < categories.length; i++) { %>
						<option value="<%= categories[i] %>"<% if (category == categories[i]) { %> selected <% } %>><%= categories[i] %></option>
						<% } %>
					</select>
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Category" data-content="This is the general category of the camera."></i>
				</div>
			</div>
		</div>

		<div class="brand form-group">
			<label class="control-label">Brand</label>
			<div class="controls">
				<div class="controls">
					<select>
						<% for (let i = 0; i < brands.length; i++) { %>
						<option value="<%= brands[i] %>"<% if (brand == brands[i]) { %> selected <% } %>><%= brands[i] %></option>
						<% } %>
					</select>
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Type" data-content="This is the brand of the camera."></i>
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
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Type" data-content="This is the specific type of the camera."></i>
				</div>
			</div>
		</div>

		<div class="mount form-group">
			<label class="control-label">Mount</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= mount %>" disabled>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Mount" data-content="This is the mount of the camera."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="sensor form-group">
			<label class="control-label">Sensor</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= sensor %>" disabled>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Sensor" data-content="This is the sensor of the camera."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	events: {
		'change .category select': 'onChangeCategory',
		'change .brand select': 'onChangeBrand',
		'change .type select': 'onChangeType'
	},

	//
	// form getting methods
	//

	getValue: function(kind) {
		switch (kind) {
			case 'category':
				return this.$el.find('.category select').val();
			case 'brand':
				return this.$el.find('.brand select').val();
			case 'type':
				return this.$el.find('.type select').val();
			case 'mount': 
				return this.$el.find('.mount input').val();
			case 'sensor': 
				return this.$el.find('.sensor input').val();
		}
	},

	getValues: function() {
		return {
			category: this.getValue('category'),
			brand: this.getValue('brand'),
			type: this.getValue('type'),
			mount: this.getValue('mount'),
			sensor: this.getValue('sensor')
		};
	},

	//
	// form setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'category':
				this.$el.find('.category select').val(value);
				break;
			case 'brand':
				this.$el.find('.brand select').val(value);
				break;
			case 'type':
				this.$el.find('.type select').val(value);
				break;
		}
	},

	setBrands: function(brands) {
		this.$el.find('.brand option').remove();
		for (let i = 0; i < brands.length; i++) {
			let option = $('<option />').attr('value', brands[i]).text(brands[i]);
			this.$el.find('.brand select').append(option);
		}
	},

	setTypes: function(types) {
		this.$el.find('.type option').remove();
		for (let i = 0; i < types.length; i++) {
			let option = $('<option />').attr('value', types[i]).text(types[i]);
			this.$el.find('.type select').append(option);
		}
	},

	setCamera: function(camera) {
		if (camera) {
			this.$el.find('.mount input').val(camera.mount);
			this.$el.find('.sensor input').val(camera.sensor);
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let categories = Object.keys(this.options.cameras);
		let category = categories[0];
		let brands = Object.keys(this.options.cameras[category]);
		let brand = brands[0];
		let types = Object.keys(this.options.cameras[category][brand]);
		let type = types[0];
		let camera = this.options.cameras[category][brand][type];
		let mount = camera.mount;
		let sensor = camera.sensor;

		return {
			category: category,
			categories: categories,
			brand: brand,
			brands: brands,
			type: type,
			types: types,
			mount: mount,
			sensor: sensor
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

	onChangeCategory: function() {
		let category = this.getValue('category');
		let brands = Object.keys(this.options.cameras[category]);
		let brand = brands[0];
		let types = Object.keys(this.options.cameras[category][brand]);
		let type = types[0];
		let camera = this.options.cameras[category][brand][type];

		// update form
		//
		this.setBrands(brands);
		this.setTypes(types);
		this.setCamera(camera);
	},

	onChangeBrand: function() {
		let category = this.getValue('category');
		let brand = this.getValue('brand');
		let types = Object.keys(this.options.cameras[category][brand]);
		let type = types[0];
		let camera = this.options.cameras[category][brand][type];

		// update form
		//
		this.setTypes(types);
		this.setCamera(camera);
	},

	onChangeType: function() {
		let category = this.getValue('category');
		let brand = this.getValue('brand');
		let type = this.getValue('type');
		let camera = this.options.cameras[category][brand][type];

		// update form
		//
		this.setCamera(camera);
	}
});