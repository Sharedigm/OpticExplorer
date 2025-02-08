/******************************************************************************\
|                                                                              |
|                           place-info-form-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing information about a place.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import InfoFormView from '../../../../../views/apps/common/forms/info-form-view.js';
import PlaceGeneralPaneView from '../../../../../views/apps/map-viewer/forms/info/panes/place-general-pane-view.js';
import PlaceLocationPaneView from '../../../../../views/apps/map-viewer/forms/info/panes/place-location-pane-view.js';
import PlaceHistoryPaneView from '../../../../../views/apps/map-viewer/forms/info/panes/place-history-pane-view.js';

export default InfoFormView.extend({

	//
	// attributes
	//

	tabs: [
		{
			"name": "General",
			"icon": "fa fa-info-circle"
		},
		{
			"name": "Location",
			"icon": "fa fa-globe"
		},
		{
			"name": "History",
			"icon": "fa fa-calendar-alt"
		}
	],

	item: `
		<div class="items">
			<div class="icon-grid">
				<div class="directory item">
					<div class="row">
						<div class="icon">
							<% if (url) { %>
							<img src="<%= url %>" />
							<% } else if (typeof id != 'undefined') { %>
							<i class="fa fa-map-pin"></i>
							<% } else if (description) { %>
							<i class="fa fa-map-marker"></i>
							<% } else { %>
							<i class="fa fa-map-marker-alt"></i>
							<% } %>
							<% if (description) { %>
							<i class="fa fa-info-circle"></i>
							<% } %>
						</div>
					</div>
					<div class="row">
						<div class="name"><%= name %></div>
					</div>
				</div>
			</div>
		</div>
	`,

	//
	// getting methods
	//

	getIconUrl: function() {
		return this.model.has('icon_path')? config.servers.api + '/file/thumb?max-size=100&path=' + encodeURIComponent(this.model.get('icon_path')) : null;
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			item: template(this.item)({
				url: this.getIconUrl(),
				name: this.model.get('name'),
				description: this.model.get('description')
			}),
			tabs: this.tabs,
			active: this.options.tab
		};
	},

	onRender: function() {

		// show child views
		//
		this.showPlaceGeneral();
		this.showPlaceLocation();
		this.showPlaceHistory();
	},
	
	showPlaceGeneral: function() {
		this.showChildView('general', new PlaceGeneralPaneView({
			model: this.model
		}));
	},

	showPlaceLocation: function() {
		this.showChildView('location', new PlaceLocationPaneView({
			model: this.model
		}));
	},

	showPlaceHistory: function() {
		this.showChildView('history', new PlaceHistoryPaneView({
			model: this.model
		}));
	}
});