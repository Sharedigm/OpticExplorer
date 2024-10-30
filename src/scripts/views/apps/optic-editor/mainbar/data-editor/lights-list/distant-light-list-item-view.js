/******************************************************************************\
|                                                                              |
|                       distant-light-list-item-view.js                        |
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
			<% if (typeof distance != 'undefined' && distance != undefined) { %><%= distance %><% } %>
		</td>

		<td class="offset">
		</td>

		<td class="angle" contenteditable="true">
			<% if (typeof angle != 'angle' && angle != undefined) { %><%= angle %><% } %>
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
			kind: 'Distant',
			distance: this.model.has('distance')? this.model.get('distance').toString({ precision: 4 }) : 0,
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
		let angle = this.getValue('angle');

		// unhighlight errors
		//
		this.hideErrors();

		// check distance
		//
		if (typeof distance == 'string') {
			return this.showError('distance', distance);

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
				<polygon points="256,60.082 293.022,225.727 462,209.75 315.903,296.147 383.314,451.918 256,339.67 128.686,451.918 196.097,296.147 50,209.75 218.978,225.727" transform="matrix(1.1,0,0,1.1,-53.76,-53.76)" />
			</svg>
		</i>
	`
});