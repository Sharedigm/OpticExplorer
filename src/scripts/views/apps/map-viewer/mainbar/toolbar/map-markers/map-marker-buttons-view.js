/******************************************************************************\
|                                                                              |
|                         map-markers-buttons-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a group of related toolbar buttons.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ButtonGroupView from '../../../../../../views/apps/common/toolbars/button-groups/button-group-view.js';
import MapMarkerButtonView from '../../../../../../views/apps/map-viewer/mainbar/toolbar/map-markers/buttons/map-marker-button-view.js';

export default ButtonGroupView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="current" data-toggle="tooltip" title="Place"></div>
		<div class="tools">
			<%= tools %>
		</div>
	`),

	tools: template(`
		<% for (key in markers) { %>
		<div id="<%= key.toLowerCase() + '-marker' %>" data-toggle="tooltip" title="<%= key %>"></div>
		<% } %>
	`),

	tooltips: {
		placement: 'top'
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			tools: this.tools({
				markers: this.options.markers
			})
		};
	},

	onRender: function() {

		// show child views
		//
		this.showMarkerButtons();

		// call superclass method
		//
		ButtonGroupView.prototype.onRender.call(this);
	},

	showMarkerButtons: function() {
		for (let key in this.options.markers) {
			let id = key.toLowerCase() + '-marker';
			this.addRegion(id, '#' + id);
			this.showChildView(id, new MapMarkerButtonView({
				name: key,
				icon_path: this.options.markers[key],
				parent: this
			}));
		}
	}
});