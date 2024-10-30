/******************************************************************************\
|                                                                              |
|                      distant-object-list-item-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a distant object list item.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ObjectsListItemView from '../../../../../../views/apps/optic-editor/mainbar/data-editor/objects-list/objects-list-item-view.js';
import Units from '../../../../../../utilities/math/units.js';

export default ObjectsListItemView.extend({

	//
	// attributes
	//

	template: _.template(`
		<td class="kind">
			<%= icon %>
			<%= kind? kind.toTitleCase() : '' %>
		</td>
		
		<td class="distance" contenteditable="true">
			<% if (typeof distance != 'undefined' && distance != undefined) { %><%= distance %><% } %>
		</td>

		<td class="angle">
		</td>

		<td class="angle" contenteditable="true">
			<% if (typeof angle != 'angle' && angle != undefined) { %><%= angle %><% } %>
		</td>

		<td class="height" contenteditable="true">
			<%= height %>
		</td>

		<td class="is-hidden td-sm hidden-xs">
			<input type="checkbox"<% if (typeof hidden != 'undefined' && hidden) { %> checked<% } %>>
		</td>

		<td class="color hidden-xs">
			<div class="tile" style="background: <%= color %>"></div>
		</td>
	`),

	events: _.extend({}, ObjectsListItemView.prototype.events, {
		'blur .distance': 'onBlurDistance',
		'blur .angle': 'onBlurAngle',
		'blur .height': 'onBlurHeight',
		'click .is-hidden input': 'onClickHidden'
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
			case 'height':
				return Units.parse(this.$el.find('.height').text().trim());
			case 'number_of_rays':
				return parseInt(this.$el.find('.number-of-rays').text().trim());
			case 'hidden':
				return this.$el.find('.is-hidden input').is(':checked');
		}
	},

	getValues: function() {
		return {
			distance: this.getValue('distance'),
			angle: this.getValue('angle'),
			height: this.getValue('height'),
			number_of_rays: this.getValue('number_of_rays'),
			hidden: this.getValue('hidden')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.constructor.icon,
			kind: this.model.get('kind'),
			distance: this.model.has('distance')? this.model.get('distance').toString({ precision: 4 }) : '',
			angle: this.model.has('angle')? this.model.get('angle').toString({ precision: 4 }) : '',
			height: this.model.has('height')? this.model.get('height').toString({ precision: 4 }) : '',
			number_of_rays: this.model.get('number_of_rays'),
			hidden: this.model.get('hidden'),
			color: this.model.get('color')
		};
	},

	//
	// validation methods
	//

	validate: function() {
		let distance = this.getValue('distance');
		let angle = this.getValue('angle');
		let height = this.getValue('height');

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

		// check height
		//
		} if (typeof height == 'string') {
			return this.showError('height', height);
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

	onBlurHeight: function() {
		this.updateValue('height');
	},

	onBlurNumberOfRays: function() {
		this.updateValue('number_of_rays');
	},

	onClickHidden: function() {
		this.updateValue('hidden');
	}
}, {

	//
	// static attributes
	//

	icon: `<i class="fa fa-moon"></i>`
});