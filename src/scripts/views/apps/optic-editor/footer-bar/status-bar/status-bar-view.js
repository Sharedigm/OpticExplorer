/******************************************************************************\
|                                                                              |
|                              status-bar-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of an application's status information.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';
import Timeable from '../../../../../views/behaviors/effects/timeable.js';
import Vector2 from '../../../../../utilities/math/vector2.js';
import Browser from '../../../../../utilities/web/browser.js';

export default BaseView.extend(_.extend({}, Timeable, {

	//
	// attributes
	//

	className: 'status-bar',

	template: template(`
		<div class="optics-info location info-bar hidden-xs">
			<i class="fa fa-arrows hidden-xs"></i>
			<span class="x"></span>, <span class="y"></span>
		</div>

		<div class="info-bar">
			<i class="fa fa-database rotated flipped"></i>
			<% if (num_selected > 0 && num_elements > 0) { %>
			<% if (is_mobile) { %>
			<%= num_selected %> selected
			<% } else { %>
			<%= num_selected %> of <%= num_elements %> elements selected
			<% } %>
			<% } else if (num_elements != undefined) { %>
			<%= num_elements %> elements
			<% } %>
		</div>
	`),

	updateInterval: 30,

	//
	// rendering methods
	//

	templateContext: function() {
		let app = this.parent.app;
		return {
			num_elements: app.numElements('.lens'),
			num_selected: app.numSelectedElements(),
			is_mobile: Browser.is_mobile
		}
	},

	onRender: function() {
		this.showLocation(new Vector2(0, 0));
	},

	toDigits: function(value, digits) {
		if (Math.abs(value) < 1) {
			return value.toFixed(digits);
		} else {
			return value.toPrecision(digits + 1);
		}		
	},

	showLocation: function(location) {
		if (!location) {
			return;
		}
		let x = this.toDigits(location? location.x : 0, 2);
		let y = this.toDigits(location? (-location.y) : 0, 2);
		let units = 'mm';

		// update status
		//
		this.$el.find('.location').show();
		this.$el.find('.location .x').text(x + units);
		this.$el.find('.location .y').text(y + units);
	},

	update: function() {
		this.render();
		this.showLocation(this.location);
	},

	updateLocation: function() {
		if (this.updateInterval) {

			// check if we are ready to update
			//
			if (!this.timeout) {
				
				// wait to update
				//
				this.setTimeout(() => {

					// update display
					//
					this.location = this.parent.app.getLocation();
					this.showLocation(this.location);
				}, this.updateInterval);
			}
		} else {

			// update display
			//
			this.showLocation(this.parent.app.getLocation());		
		}
	},

	//
	// event handling methods
	//

	onLoad: function() {
		this.update();
	},

	onChange: function() {
		this.update();
	},

	onMouseMove: function() {
		this.updateLocation();
	},

	//
	// selection event handling methods
	//

	onSelect: function() {
		this.update();
	},

	onDeselect: function() {
		this.update();
	},

	onChangeSelection: function() {
		this.update();
	}
}));