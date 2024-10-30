/******************************************************************************\
|                                                                              |
|                         light-ray-list-item-view.js                          |
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

		<td class="number-of-rays">
			1
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
			case 'off':
				return this.$el.find('.is-off input').is(':checked');
		}
	},

	getValues: function() {
		return {
			distance: this.getValue('distance'),
			offset: this.getValue('offset'),
			angle: this.getValue('angle'),
			off: this.getValue('off')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.constructor.icon,
			kind: 'Ray',
			distance: this.model.has('distance')? this.model.get('distance').toString({ precision: 4 }) : 0,
			offset: this.model.has('offset')? this.model.get('offset').toString({ precision: 4 }) : 0,
			angle: this.model.has('angle')? this.model.get('angle').toString({ precision: 4 }) : 0,
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

	onClickOff: function() {
		this.updateValue('off');
	}
}, {

	//
	// static attributes
	//

	icon: `
		<i class="icon">
			<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 24 24">
				<path d="M17 12c0 2.762-2.238 5-5 5s-5-2.238-5-5 2.238-5 5-5 5 2.238 5 5zm-9.184-5.599l-3.594-3.594-1.414 1.414 3.594 3.595c.402-.537.878-1.013 1.414-1.415zm4.184-1.401c.34 0 .672.033 1 .08v-5.08h-2v5.08c.328-.047.66-.08 1-.08zm5.598 2.815l3.594-3.595-1.414-1.414-3.594 3.595c.536.402 1.012.878 1.414 1.414zm-12.598 4.185c0-.34.033-.672.08-1h-5.08v2h5.08c-.047-.328-.08-.66-.08-1zm11.185 5.598l3.594 3.593 1.415-1.414-3.594-3.594c-.403.537-.879 1.013-1.415 1.415zm-9.784-1.414l-3.593 3.593 1.414 1.414 3.593-3.593c-.536-.402-1.011-.877-1.414-1.414zm12.519-5.184c.047.328.08.66.08 1s-.033.672-.08 1h5.08v-2h-5.08zm-6.92 8c-.34 0-.672-.033-1-.08v5.08h2v-5.08c-.328.047-.66.08-1 .08z" />
			</svg>
		</i>
	`
});