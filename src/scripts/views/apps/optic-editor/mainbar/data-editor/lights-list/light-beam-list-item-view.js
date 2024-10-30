/******************************************************************************\
|                                                                              |
|                         light-beam-list-item-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a lights list item.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import LightsListItemView from '../../../../../../views/apps/optic-editor/mainbar/data-editor/lights-list/lights-list-item-view.js';
import Units from '../../../../../../utilities/math/units.js';

export default LightsListItemView.extend({

	//
	// attributes
	//

	template: _.template(`
		<td class="kind">
			<%= icon %>
			<%= kind %>
		</td>

		<td class="distance" contenteditable="true">
			<%= distance %>
		</td>
		
		<td class="offset" contenteditable="true">
			<%= offset %>
		</td>

		<td class="angle" contenteditable="true">
			<%= angle %>
		</td>

		<td class="number-of-rays" contenteditable="true">
			<%= number_of_rays %>
		</td>

		<td class="is-off td-sm hidden-xs">
			<input type="checkbox"<% if (typeof off != 'undefined' && off) { %> checked<% } %>>
		</td>

		<td class="color hidden-xs">
			<% if (color) { %>
			<div class="tile" style="background: <%= color %>"></div>
			<% } else if (spectrum) { %>
			<%= spectrum %>
			<% } else { %>
			none
			<% } %>
		</td>
	`),

	events: _.extend({}, LightsListItemView.prototype.events, {
		'blur .distance': 'onBlurDistance',
		'blur .offset': 'onBlurOffset',
		'blur .angle': 'onBlurAngle',
		'blur .number-of-rays': 'onBlurNumberOfRays',
		'click .is-off input': 'onClickOff'
	}),

	//
	// form getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'distance':
				return Units.parse(this.$el.find('.distance').text().trim());
			case 'offset':
				return Units.parse(this.$el.find('.offset').text().trim());
			case 'angle':
				return Units.parse(this.$el.find('.angle').text().trim());
			case 'number_of_rays':
				return parseInt(this.$el.find('.number-of-rays').text().trim());
			case 'off':
				return this.$el.find('.is-off input').is(':checked');
		}
	},

	getValues: function() {
		return {
			distance: this.getValue('distance'),
			offset: this.getValue('offset'),
			angle: this.getValue('angle'),
			number_of_rays: this.getValue('number_of_rays'),
			off: this.getValue('off')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.constructor.icon,
			kind: 'Beam',
			distance: this.model.has('distance')? this.model.get('distance').toString({ precision: 4 }) : 0,
			offset: this.model.has('offset')? this.model.get('offset').toString({ precision: 4 }) : 0,
			angle: this.model.has('angle')? this.model.get('angle').toString({ precision: 4 }) : 0,
			number_of_rays: this.model.get('number_of_rays'),
			off: this.model.get('off'),
			color: this.model.get('color'),
			spectrum: this.model.get('spectrum')
		};
	},

	//
	// validation methods
	//

	validate: function() {
		let distance = this.getValue('distance');
		let offset = this.getValue('offset');
		let angle = this.getValue('angle');

		// unhighlight errors
		//
		this.hideErrors();

		// check distance
		//
		if (typeof distance == 'string') {
			return this.showError('distance', distance);

		// check offset
		//
		} else if (typeof offset == 'string') {
			return this.showError('offset', offset);

		// check angle
		//
		} else if (typeof angle == 'string') {
			return this.showError('angle', angle);
		}

		return true;
	},

	//
	// mouse event handling methods
	//

	onBlurDistance: function() {
		this.updateValue('distance');
	},

	onBlurOffset: function() {
		this.updateValue('offset');
	},

	onBlurAngle: function() {
		this.updateValue('angle');
	},

	onBlurNumberOfRays: function() {
		this.updateValue('number_of_rays');
	},

	onClickOff: function() {
		this.updateValue('off');
	}
}, {

	//
	// static attributes
	//

	icon: `
		<i class="icon">
			<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 512 512">
				<path d="M307.5,153 c 0,0 -40.234,27.359 -64.626,42.439 c  -11.919,5.959 -25.062,9.061 -38.374,9.061H81.022
				C64.577,208.289,50,231.239,50,257.467 c 0,25.256,13.948,46.11,31.022,50.033H204.5 c 13.311,0,26.454,2.564,38.374,8.516
				C269.947,332.713,307.5,359,307.5,359V153z M170.167,273.166 c  -9.48,0 -17.167 -7.686 -17.167 -17.166
				 c 0 -9.479,7.687 -17.166,17.167 -17.166 c 9.48,0,17.167,7.687,17.167,17.166C187.333,265.48,179.647,273.166,170.167,273.166z M359,153
				v206h -34.334V153H359z M462,273.166h -68.666v -34.332H462V273.166z M462,161.584l -53.109,37.552l -18.608 -25.75l53.109 -37.552
				L462,161.584z M443.392,376.166l -53.109 -37.551l18.608 -25.75L462,350.416L443.392,376.166z"/>
			</svg>
		</i>
	`
});