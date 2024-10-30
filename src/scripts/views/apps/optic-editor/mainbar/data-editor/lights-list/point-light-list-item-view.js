/******************************************************************************\
|                                                                              |
|                        point-light-list-item-view.js                         |
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

		<td class="angle">
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
			kind: 'Point',
			distance: this.model.has('distance')? this.model.get('distance').toString({ precision: 4 }) : 0,
			offset: this.model.has('offset')? this.model.get('offset').toString({ precision: 4 }) : 0,
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

	icon: `<i class="fa fa-lightbulb"></i>`
});