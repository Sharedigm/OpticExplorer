/******************************************************************************\
|                                                                              |
|                         reflection-params-form-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying reflection parameters.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2015-2018, Megahed Labs LLC, www.optipedia.org          |
\******************************************************************************/

import CommonMaterials from '../../../../../collections/optics/materials/catalogs/common-materials.js';
import FormView from '../../../../../views/forms/form-view.js';
import '../../../../../../vendor/bootstrap/js/dropdown.js';

export default FormView.extend({

	//
	// attributes
	//

	template: _.template(`	
		<div class="form-group" id="polarization">
			<label class="control-label">Polarization</label>
			<div class="controls">
				<label class="radio-inline">
					<input type="radio" id="unpolarized" name="polarization" value="unpolarized"<% if (polarization == 'unpolarized') {%> checked<% } %>>
					Unpolarized
				</label>
				<label class="radio-inline">
					<input type="radio" id="s-polarized" name="polarization" value="s-polarized"<% if (polarization == 's-polarized') {%> checked<% } %>>
					S
				</label>
				<label class="radio-inline">
					<input type="radio" id="p-polarized" name="polarization" value="p-polarized"<% if (polarization == 'p-polarized') {%> checked<% } %>>
					P
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Polarization" data-content="This determines the plane of polarization of the light."></i>
				</label>
			</div>
		</div>

		<div class="form-group" id="interface">
			<label class="control-label">Interface</label>
			<div class="controls">
				<label class="radio-inline">
					<input type="radio" id="external" name="interface" value="external"<% if (interface == 'external') {%> checked<% } %>>
					External
				</label>
				<label class="radio-inline">
					<input type="radio" id="internal" name="interface" value="internal"<% if (interface == 'internal') {%> checked<% } %>>
					Internal
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Interface" data-content="This determines whether the light is on the external or the internal side of the material interface.  This determines whether we are computing the reflection from an external or an internal reflection (whether we are entering or leaving the material)."></i>
				</label>
			</div>
		</div>
		
		<div class="form-group" id="medium">
			<label class="control-label external medium"<% if (interface != 'external') { %> style="display:none"<% } %>>From medium</label>
			<label class="control-label internal medium"<% if (interface != 'internal') { %> style="display:none"<% } %>>To medium</label>
			<div class="controls">
				<div class="input-group">
					<select>
						<% for (let i = 0; i < media.length; i++) { %>
						<option value="<%= media[i].get('name') %>"<% if (medium == media[i]) {%> selected<% }%>><%= media[i].get('name') %> (n=<%= media[i].getIndexOfRefraction() %>)</option>
						<% } %>
					</select>
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Medium" data-content="This is the medium that the light is transitioning from or to when it is being reflected from the surface (interface) of the material."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	events: {
		'change #polarization input': 'onChangePolarization',
		'change #interface input': 'onChangeInterface',
		'change #medium select': 'onChangeMedium'
	},

	//
	// form attributes
	//

	polarization: 'unpolarized',
	interface: 'external',
	medium: CommonMaterials.named('air'),
	media: [
		CommonMaterials.named('vacuum'),
		CommonMaterials.named('air'),
		CommonMaterials.named('water')
	],

	//
	// getting methods
	//

	getValue: function(kind) {
		switch (kind) {
			case 'polarization':
				return this.$el.find('#polarization input:checked').val();
			case 'interface':
				return this.$el.find('#interface input:checked').val();
			case 'medium':
				return this.media[this.$el.find('#medium select option:selected')[0].index];	
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			polarization: this.polarization,
			interface: this.interface,
			medium: this.medium,
			media: this.media
		};
	},

	//
	// event handling methods
	//

	onChange: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange('reflection');
		}
	},

	onChangePolarization: function() {
		this.polarization = this.getValue('polarization');
		this.onChange();
	},

	onChangeInterface: function() {
		this.interface = this.getValue('interface')
		this.onChange();
	},

	onChangeMedium: function() {
		this.medium = this.getValue('medium');
		this.onChange();
	}
});