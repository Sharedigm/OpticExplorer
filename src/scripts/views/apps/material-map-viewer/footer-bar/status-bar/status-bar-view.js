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
import Browser from '../../../../../utilities/web/browser.js';

export default BaseView.extend(_.extend({}, Timeable, {

	//
	// attributes
	//

	className: 'status-bar',

	template: template(`	
		<div class="materials-info location info-bar hidden-xs" style="display:none">
			<i class="fa fa-crosshairs hidden-xs"></i>
			n=<span class="index-of-refraction"><%= n %></span>, 
			v=<span class="abbe-number"><%= v %></span>
		</div>

		<div class="info-bar">
			<i class="fa fa-gem"></i>
			<% if (num_selected > 0 && num_materials > 0) { %>
			<% if (is_mobile) { %>
			<%= num_selected %> selected
			<% } else { %>
			<%= num_selected %> of <%= num_materials %> materials selected
			<% } %>
			<% } else if (num_materials != undefined) { %>
			<%= num_materials %> materials
			<% } %>
		</div>
	`),

	updateInterval: 30,

	//
	// constructor
	//

	initialize: function() {
		this.location = {
			n: 0,
			v: 0
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let app = this.parent.app;
		return {
			n: this.location? this.location.n : undefined,
			v: this.location? this.location.v : undefined,
			num_materials: app.numMaterials(),
			num_selected: app.numSelectedMaterials(),
			is_mobile: Browser.is_mobile
		}
	},

	onRender: function() {
		this.showLocation(this.location);
	},

	showLocation: function(location) {
		this.location = location;
		this.$el.find('.location').show();
		this.$el.find('.abbe-number').text(location.v.toPrecision(3));
		this.$el.find('.index-of-refraction').text(location.n.toPrecision(3));
	},

	update: function() {
		this.render();
	},

	updateLocation: function() {
		if (this.updateInterval) {

			// check if we are ready to update
			//
			if (!this.timeout) {
				
				// wait to update
				//
				this.setTimeout(() => {

					// update lat / long display
					//
					this.showLocation(this.parent.app.getLocation());
				}, this.updateInterval);
			}
		} else {

			// update location display
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
	},

	//
	// mouse event handling methods
	//

	onMouseMove: function() {
		this.updateLocation();
	},
}));