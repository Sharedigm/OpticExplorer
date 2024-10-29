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

	template: template(`
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
		
		<ul class="nav nav-tabs" role="tablist">
		
			<li role="presentation" class="general tab<% if (tab == 'general') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".general.tab-pane">
					<i class="fa fa-info-circle"></i>
					<label>General</label>
				</a>
			</li>

			<li role="presentation" class="location tab<% if (tab == 'location') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".location.tab-pane">
					<i class="fa fa-globe"></i>
					<label>Location</label>
				</a>
			</li>

			<li role="presentation" class="history tab<% if (tab == 'history') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".history.tab-pane">
					<i class="fa fa-calendar-alt"></i>
					<label>History</label>
				</a>
			</li>
		</ul>
		
		<div class="tab-content">
		
			<div role="tabpanel" class="general tab-pane<% if (tab == 'general') { %> active<% } %>">
			</div>

			<div role="tabpanel" class="location tab-pane<% if (tab == 'location') { %> active<% } %>">
			</div>

			<div role="tabpanel" class="history tab-pane<% if (tab == 'history') { %> active<% } %>">
			</div>
		</div>
	`),

	regions: {
		general: '.general.tab-pane',
		location: '.location.tab-pane',
		history: '.history.tab-pane'
	},

	events: {
		'mousedown': 'onMouseDown'
	},

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
			url: this.getIconUrl(),
			index: this.options.index,
			tab: this.options.tab || 'general'
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