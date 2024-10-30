/******************************************************************************\
|                                                                              |
|                           sensor-list-item-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a sensor list item.                |
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
			Sensor
		</td>
		
		<td class="width" contenteditable="true">
			<%= width %>
		</td>
		
		<td class="height" contenteditable="true">
			<%= height %>
		</td>

		<td class="spacing">
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
		'blur .width': 'onBlurWidth',
		'blur .height': 'onBlurHeight',
		'click .is-hidden input': 'onClickHidden'
	}),

	//
	// form getting methods
	//

	getValue: function(kind) {
		switch (kind) {
			case 'width': 
				return Units.parse(this.$el.find('.width').text().trim());
			case 'height': 
				return Units.parse(this.$el.find('.height').text().trim());
			case 'hidden':
				return this.$el.find('.is-hidden input').is(':checked');
		}
	},

	getValues: function() {
		return {
			width: this.getValue('width'),
			height: this.getValue('height'),
			hidden: this.getValue('hidden')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.constructor.icon,
			width: this.model.has('width')? this.model.get('width').toString() : '',
			height: this.model.has('height')? this.model.get('height').toString() : '',
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
		let width = this.getValue('width');
		let height = this.getValue('height');

		// unhighlight errors
		//
		this.hideErrors();

		// check width
		//
		if (typeof width == 'string') {
			return this.showError('width', width);
		} else if (width && (isNaN(width.value) || width.value < 0)) {
			return this.showError('width', "This must be a positive value.");
		}

		// check height
		//
		if (typeof height == 'string') {
			return this.showError('height', height);
		} else if (height && (isNaN(height.value) || height.value < 0)) {
			return this.showError('height', "This must be a positive value.");
		}

		return true;
	},

	//
	// mouse event handling methods
	//

	onBlurWidth: function() {
		this.updateValue('width');
	},

	onBlurHeight: function() {
		this.updateValue('height');
	},

	onClickHidden: function() {
		this.updateValue('hidden');
	}
}, {

	//
	// static attributes
	//

	icon : `
		<i class="icon">
			<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 24 24">
				<path d="M19 17c0 1.104-.896 2-2 2h-11c-1.104 0-2-.896-2-2v-11c0-1.104.896-2 2-2h11c1.104 0 2 .896 2 2v11zm-11 3v3h-1v-3h1zm4 0v3h-1v-3h1zm2 0v3h-1v-3h1zm-4 0v3h-1v-3h1zm6 0v3h-1v-3h1zm-8-20v3h-1v-3h1zm4 0v3h-1v-3h1zm2 0v3h-1v-3h1zm-4 0v3h-1v-3h1zm6 0v3h-1v-3h1zm4 15h3v1h-3v-1zm0-4h3v1h-3v-1zm0-2h3v1h-3v-1zm0 4h3v1h-3v-1zm0-6h3v1h-3v-1zm-20 8h3v1h-3v-1zm0-4h3v1h-3v-1zm0-2h3v1h-3v-1zm0 4h3v1h-3v-1zm0-6h3v1h-3v-1z"/>
			</svg>
		</i>
	`
});