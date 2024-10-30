/******************************************************************************\
|                                                                              |
|                              surface-list-item-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a single surface list item.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Planar from '../../../../../../models/optics/elements/surfaces/planar.js';
import Spherical from '../../../../../../models/optics/elements/surfaces/spherical.js';
import EditableTableListItemView from '../../../../../../views/collections/tables/editable-table-list-item-view.js';
import PlanarView from '../../../../../../views/apps/optic-editor/mainbar/viewports/elements/surfaces/planar-view.js';
import SphericalView from '../../../../../../views/apps/optic-editor/mainbar/viewports/elements/surfaces/spherical-view.js';
import Units from '../../../../../../utilities/math/units.js';

export default EditableTableListItemView.extend({

	//
	// attributes
	//

	template: _.template(`
		<td class="profile">
			<select>
				<option value="spherical"<% if (profile == 'spherical') { %> selected <% } %>>Spherical</option>
				<option value="planar"<% if (profile == 'planar') { %> selected <% } %>>Planar</option>
			</select>
		</td>

		<td class="side">
			<%= side %>
		</td>
		
		<td class="radius-of-curvature"<% if (profile != 'planar') { %> contenteditable="true"<% } %>>
			<% if (profile == 'spherical') { %>
			<%= radius_of_curvature %>
			<% } else { %>
			Infinity
			<% } %>
		</td>

		<td class="curvature"<% if (profile != 'planar') { %> contenteditable="true"<% } %>>
			<% if (profile == 'spherical') { %>
			<%= curvature %>
			<% } else { %>
			0
			<% } %>
		</td>

		<td class="radius" contenteditable="true">
			<%= radius %>
		</td>

		<td class="diameter" contenteditable="true">
			<%= diameter %>
		</td>

		<td class="coating hidden-md hidden-sm hidden-xs">
			<%= coating %>
		</td>

		<td class="spacing hidden-xs" contenteditable="true">
			<%= spacing %>
		</td>
	`),

	events: _.extend({}, EditableTableListItemView.prototype.events, {
		'change .profile select': 'onChangeProfile',
		'blur .radius-of-curvature': 'onBlurRadiusOfCurvature',
		'blur .curvature': 'onBlurCurvature',
		'blur .radius': 'onBlurRadius',
		'blur .diameter': 'onBlurDiameter',
		'blur .spacing': 'onBlurSpacing'
	}),

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		EditableTableListItemView.prototype.initialize.call(this);

		// set attributes
		//
		this.profile = this.getSurfaceProfile(this.model);
		this.radius_of_curvature = this.model.get('radius_of_curvature');
		this.curvature = this.model.get('curvature');
		this.diameter = this.model.get('diameter');
		this.radius = this.model.get('radius');
		this.spacing = this.model.get('spacing');

		// listen to model
		//
		this.listenTo(this.model, 'select', () => this.select());
		this.listenTo(this.model, 'deselect', () => this.deselect());
		this.listenTo(this.model, 'change', () => this.update());
	},

	//
	// creating methods
	//

	createSurface: function(profile) {
		switch (profile) {
			case 'planar':
				return new Planar({
					diameter: this.diameter
				});
			case 'spherical':
				return new Spherical({
					diameter: this.diameter,
					radius_of_curvature: this.radius_of_curvature || new Units(100, 'mm')
				});
		}
	},

	createSurfaceView: function(surface) {
		switch (this.getSurfaceProfile(surface)) {
			case 'planar':
				return new PlanarView({
					model: surface
				});
			case 'spherical':
				return new SphericalView({
					model: surface
				});
		}
	},

	//
	// getting methods
	//

	getSurfaceProfile: function(surface) {
		switch (surface.__proto__) {
			case Planar.prototype:
				return 'planar';
			case Spherical.prototype:
				return 'spherical'
		}
	},

	//
	// form getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'profile':
				return this.$el.find('.profile select').val();
			case 'radius_of_curvature':
				return Units.parse(this.$el.find('.radius-of-curvature').text().trim());
			case 'curvature':
				return Units.parse(this.$el.find('.curvature').text().trim());
			case 'radius': 
				return Units.parse(this.$el.find('.radius').text().trim());
			case 'diameter': 
				return Units.parse(this.$el.find('.diameter').text().trim());
			case 'spacing': 
				return Units.parse(this.$el.find('.spacing').text().trim());
		}
	},

	getValues: function() {
		return {
			profile: this.getValue('profile'),
			radius_of_curvature: this.getValue('radius_of_curvature'),
			curvature: this.getValue('curvature'),
			radius: this.getValue('radius'),
			diameter: this.getValue('diameter'),
			spacing: this.getValue('spacing')
		}
	},

	//
	// viewport getting methods
	//

	getViewportView: function() {
		let splitView = this.getParentView('split-view');
		return splitView.getChildView('mainbar');
	},

	getElementView: function() {
		let viewportView = this.getViewportView();
		if (viewportView) {
			return viewportView.getElementView(this.model.parent);
		}
	},

	getSurfaceView: function() {
		let elementView = this.getElementView();
		if (elementView) {
			return elementView.getSurfaceView(this.model.getSide());
		}
	},

	//
	// form setting methods
	//

	setProfile: function(profile) {
		this.$el.find('.profile select').val(profile);
	},

	//
	// editing methods
	//

	edit: function() {
		this.getSurfaceView().edit();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			profile: this.getSurfaceProfile(this.model),
			side: this.model.getSide(),
			radius_of_curvature: this.model.has('radius_of_curvature')? this.model.get('radius_of_curvature').toString() : 0,
			curvature: this.model.has('curvature')? this.model.get('curvature').toString() : 0,
			diameter: this.model.has('diameter')? this.model.get('diameter').toString() : 0,
			radius: this.model.has('radius')? this.model.get('diameter').times(0.5).toString() : 0,
			spacing: this.model.getSpacing() || 0,
			coating: this.model.get('coating') || 'none'
		};
	},

	onRender: function() {

		// perform initial validation
		//
		this.validate();

		// set selected
		//
		let surfaceView = this.getSurfaceView();
		if (surfaceView && surfaceView.isSelected()) {
			this.$el.addClass('selected');
		}
	},
	
	//
	// validation methods
	//

	validate: function() {
		let radius_of_curvature = this.getValue('radius_of_curvature');
		let curvature = this.getValue('curvature');
		let diameter = this.getValue('diameter');
		let radius = this.getValue('radius');
		let spacing = this.getValue('spacing');

		// unhighlight errors
		//
		this.hideErrors();
		
		// check radius of curvature
		//
		if (radius_of_curvature != Infinity) {
			if (typeof radius_of_curvature == 'string') {
				return this.showError('radius_of_curvature', radius_of_curvature);
			} else if (radius_of_curvature == undefined || radius_of_curvature.value == undefined) {
				return this.showError('radius_of_curvature', "This field is required.");
			} else if (isNaN(radius_of_curvature.value)) {
				return this.showError('radius_of_curvature', "This must be a valid number.");
			} else if (radius_of_curvature.value == 0) {
				return this.showError('radius_of_curvature', "This must be a non-zero value.");
			} else if (Math.abs(radius_of_curvature.as(radius.units).val()) < radius.value * 0.99) {
				return this.showError('radius_of_curvature', "The radius of curvature must be greater than or equal to the radius.");
			}
		}

		// check curvature
		//
		if (curvature) {
			if (typeof curvature == 'string') {
				return this.showError('curvature', curvature);
			} else if (curvature && isNaN(curvature.value)) {
				return this.showError('curvature', "This must be a valid number.");
			}
		}

		// check diameter
		//
		if (typeof diameter == 'string') {
			return this.showError('diameter', diameter);
		} else if (diameter == undefined || diameter.value == undefined) {
			return this.showError('diameter', "This field is required.");
		} else if (diameter.value <= 0 || isNaN(diameter.value)) {
			return this.showError('diameter', "This must be a positive value.");
		}

		// check radius
		//
		if (typeof radius == 'string') {
			return this.showError('radius', radius);
		} else if (radius == undefined || radius.value == undefined) {
			return this.showError('radius', "This field is required.");
		} else if (radius.value <= 0 || isNaN(radius.value)) {
			return this.showError('radius', "This must be a positive value.");
		}

		// check spacing
		//
		if (spacing && spacing.value < 0) {
			return this.showError('spacing', "This must be a positive value.");
		} else if (this.model.getSide() == 'front' && spacing && isNaN(spacing.value)) {
			return this.showError('spacing', "This must be a valid number.");
		} else if (this.model.getSide() == 'front' && spacing && spacing.value == 0) {
			return this.showError('spacing', "This must be a non-zero value.");
		}

		return true;
	},

	isValid: function() {

		// revalidate the form
		//
		return this.validate() == true;
	},

	//
	// form methods
	//

	submit: function() {

		// update model
		//
		if (this.edited) {

			// check if surface profile changes
			//
			if (this.profile != this.getSurfaceProfile(this.model)) {
				let surface = this.getSurface(this.profile);

				// update parent
				//
				if (this.model.parent) {
					let side = this.model.getSide();
					switch (side) {
						case 'front':
							this.model.parent.set({
								front: surface
							});
							break;
						case 'back':
							this.model.parent.set({
								back: surface
							});
							break;
					}
				}
			} else {

				// set model attributes
				//
				switch (this.profile) {
					case 'planar':
						this.model.set({
							distance: this.distance,
							diameter: this.diameter
						});
						break;
					case 'spherical':
						this.model.set({
							radius_of_curvature: this.radius_of_curvature,
							distance: this.distance,
							diameter: this.diameter
						});
						break;
				}
			}

			this.edited = false;
		}
	},

	onChange: function() {
		this.edited = true;
		this.options.parent.onChange();
	},

	onChangeProfile: function() {

		// create new model
		//
		let surface = this.createSurface(this.getValue('profile'));

		// update parent
		//
		if (this.model.parent) {
			this.model.parent.setSurface(surface, this.model.getSide())
			this.model = surface;
			this.initialize();
		}

		// restore state
		//
		this.model.trigger('select');
	},

	onBlurRadiusOfCurvature: function() {
		this.updateValue('radius_of_curvature');
	},

	onBlurCurvature: function() {
		this.updateValue('curvature');
	},

	onBlurRadius: function() {
		this.updateValue('radius');
	},

	onBlurDiameter: function() {
		this.updateValue('diameter');
	},

	onBlurSpacing: function() {
		this.updateValue('spacing');
	}
});