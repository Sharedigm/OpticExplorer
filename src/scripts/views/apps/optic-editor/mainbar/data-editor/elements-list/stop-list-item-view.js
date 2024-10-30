/******************************************************************************\
|                                                                              |
|                            stop-list-item-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying an aperture stop list item.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ElementsListItemView from '../../../../../../views/apps/optic-editor/mainbar/data-editor/elements-list/elements-list-item-view.js';
import Units from '../../../../../../utilities/math/units.js';

export default ElementsListItemView.extend({

	//
	// attributes
	//

	template: _.template(`
		<td class="kind">
			<%= icon %>
			Stop
		</td>
		
		<td class="aperture" contenteditable="true">
			<%= aperture %>
		</td>

		<td class="diameter" contenteditable="true">
			<%= diameter %>
		</td>

		<td class="spacing" contenteditable="true">
			<%= spacing %>
		</td>

		<% if (false) { %>
		<td class="beveled td-sm hidden-xs">
		</td>
		<% } %>

		<td class="is-hidden td-sm hidden-xs">
			<input type="checkbox"<% if (hidden) { %> checked<% } %>>
		</td>

		<td class="material hidden-xs">
		</td>
	`),

	events: _.extend({}, ElementsListItemView.prototype.events, {
		'blur .aperture': 'onBlurAperture',
		'blur .diameter': 'onBlurDiameter',
		'blur .spacing': 'onBlurSpacing',
		'click .is-hidden input': 'onClickHidden'
	}),

	//
	// form getting methods
	//

	getValue: function(kind) {
		switch (kind) {
			case 'aperture': 
				return Units.parse(this.$el.find('.aperture').text().trim());
			case 'diameter': 
				return Units.parse(this.$el.find('.diameter').text().trim());
			case 'spacing': 
				return Units.parse(this.$el.find('.spacing').text().trim());
			case 'hidden':
				return this.$el.find('.is-hidden input').is(':checked');
		}
	},

	getValues: function() {
		return {
			aperture: this.getValue('aperture'),
			diameter: this.getValue('diameter'),
			spacing: this.getValue('spacing'),
			hidden: this.getValue('hidden')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.constructor.icon,
			aperture: this.model.has('aperture')? this.model.get('aperture').toString() : 0,
			diameter: this.model.has('diameter')? this.model.get('diameter').toString() : 0,
			spacing: this.model.has('spacing')? this.model.get('spacing').toString() : 0,
			hidden: this.model.get('hidden')
		};
	},

	onRender: function() {

		// don't number stops
		//
		this.$el.addClass('unnumbered');

		// make list item grabbable
		//
		this.$el.addClass('grabbable');
		
		// set selected
		//
		let elementView = this.getElementView();
		if (elementView && elementView.isSelected()) {
			this.$el.addClass('selected');
		}

		// perform initial validation
		//
		this.validate();
	},

	//
	// validation methods
	//

	validate: function() {
		let aperture = this.getValue('aperture');
		let diameter = this.getValue('diameter');
		let spacing = this.getValue('spacing');

		// unhighlight errors
		//
		this.hideErrors();

		// check aperture
		//
		if (typeof aperture == 'string') {
			return this.showError('aperture', aperture);
		} else if (aperture && (isNaN(aperture.value) || aperture.value < 0)) {
			return this.showError('aperture', "This must be a positive value.");
		}

		// check diameter
		//
		if (typeof diameter == 'string') {
			return this.showError('diameter', diameter);
		} else if (diameter && (isNaN(diameter.value) || diameter.value < 0)) {
			return this.showError('diameter', "This must be a positive value.");
		}

		// check spacing
		//
		if (typeof spacing == 'string') {
			return this.showError('spacing', spacing);
		} else if (spacing && (isNaN(spacing.value) || spacing.value < 0)) {
			return this.showError('spacing', "This must be a positive value.");
		}

		return true;
	},

	//
	// mouse event handling methods
	//

	onBlurAperture: function() {
		this.updateValue('aperture');
	},

	onBlurDiameter: function() {
		this.updateValue('diameter');
	},

	onBlurSpacing: function() {
		this.updateValue('spacing');
	},

	onClickHidden: function() {
		this.updateValue('hidden');
	}
}, {

	//
	// static attributes
	//

	icon: `
		<i class="icon">
			<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 1000 1000">
				<path d="M608 443.5l-225 -382q47 -8 81 -8 177 0 304 120zm-33 168l233 -395q103 125 103 283 0 53 -16 112l-320 0zm-96 -280l-427 0q37 -91 109 -158t167 -97zm-24 335l423 0q-37 90 -108.5 156.5t-164.5 98.5zm-99 -278l-234 396q-104 -126 -104 -285 0 -52 16 -111l322 0zm-33 165l227 384q-48 9 -86 9 -172 0 -302 -120z" />
			</svg>
		</i>
	`
});