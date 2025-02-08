/******************************************************************************\
|                                                                              |
|                              item-badges-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a file or directory badges.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../../views/base-view.js';
import FileIndex from '../../../../../../utilities/files/file-index.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'badges',

	template: template(`
		<% if (has_geolocation) { %>
		<div class="geolocation active badge" data-toggle="tooltip" title="view on map" data-placement="bottom">
			<i class="fa fa-globe-americas"></i>
		</div>
		<% } %>

		<% if (has_geoposition) { %>
		<div class="geoposition active badge" data-toggle="tooltip" title="view map overlay" data-placement="bottom">
			<i class="fa fa-map"></i>
		</div>
		<% } %>

		<% if (num_shares) { %>
		<div class="shares active badge" data-toggle="tooltip" title="shared with <%= num_shares %> connection<% if (num_shares > 1) { %>s<% } %>" data-placement="bottom">
			<i class="fa fa-user"></i>
			<span class="num-shares"><%= num_shares %></span>
		</div>
		<% } %>

		<% if (num_links) { %>
		<div class="links active badge" data-toggle="tooltip" title="has <%= num_links %> link<% if (num_links > 1) { %>s<% } %>" data-placement="bottom">
			<i class="fa fa-link"></i>
			<span class="num-links"><%= num_links %></span>
		</div>
		<% } %>

		<% if (has_index && config.defaults.search && config.defaults.search.index) { %>
		<div class="index active badge" data-toggle="tooltip" title="added to search index" data-placement="bottom">
			<i class="fa fa-list"></i>
		</div>
		<% } %>

		<% if (num_indices && config.defaults.search && config.defaults.search.index) { %>
		<div class="indices active badge" data-toggle="tooltip" title="<%= num_indices + " " + (num_indices == 1? "file" : "files") + " in search index"%>" data-placement="bottom">
			<i class="fa fa-list"></i>
			<span class="num-indices"><%= num_indices %></span>
		</div>
		<% } %>
	`),

	events: {
		'mousedown .geolocation': 'onMouseDownGeolocation',
		'mousedown .geoposition': 'onMouseDownGeoposition',
		'mousedown .shares': 'onMouseDownShares',
		'mousedown .links': 'onMouseDownLinks',
		'mousedown .index': 'onMouseDownIndex',
		'mousedown .indices': 'onMouseDownIndices'
	},

	//
	// indexing methods
	//

	removeIndex: function() {

		// show confirm dialog
		//
		application.confirm({
			title: "Remove from Search Index?",
			icon: '<i class="fa fa-trash-alt"></i>',
			message: "Would you like to remove this item from the search index?",

			// callbacks
			//
			accept: () => {
				FileIndex.remove(this.model, {

					// callbacks
					//
					success: () => {
						this.model.set('index_id', undefined);

						// play remove sound
						//
						application.play('remove');
					}
				});
			}
		});
	},

	removeIndices: function() {
		let numIndices = this.model.get('num_indices');

		// show confirm dialog
		//
		application.confirm({
			title: "Remove from Search Index?",
			icon: '<i class="fa fa-trash-alt"></i>',
			message: "Would you like to remove " + (numIndices == 1? 'this file' : 'these ' + numIndices + ' files') + " from the search index?",

			// callbacks
			//
			accept: () => {
				FileIndex.removeAll(this.model, {

					// callbacks
					//
					success: () => {
						this.model.set('num_indices', 0);

						// play remove sound
						//
						application.play('remove');
					}
				});
			}
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			has_geolocation: this.model.hasGeolocation && this.model.hasGeolocation(),
			has_geoposition: this.model.hasGeoposition && this.model.hasGeoposition(),
			has_index: this.model.hasIndex(),
			num_indices: this.model.get('num_indices'),
			num_shares: this.model.get('num_shares'),
			num_links: this.model.get('num_links'),
			icons: this.constructor.icons
		};
	},

	showMap: function() {
		application.launch('map_viewer', {
			model: this.model
		}, {
			new_window: true
		});
	},

	//
	// mouse event handling methods
	//

	onMouseDownGeolocation: function(event) {

		// block event from parent
		//
		this.block(event);

		// view item on map
		//
		this.showMap();
	},

	onMouseDownGeoposition: function(event) {

		// block event from parent
		//
		this.block(event);

		// view item on map
		//
		this.showMap();
	},

	onMouseDownShares: function(event) {

		// block event from parent
		//
		this.block(event);

		// show file info dialog
		//
		this.model.showShareRequests();
	},

	onMouseDownLinks: function(event) {

		// block event from parent
		//
		this.block(event);

		// show file info dialog
		//
		this.model.showLinks();
	},

	onMouseDownIndex: function(event) {

		// block event from parent
		//
		this.block(event);

		// remove search index
		//
		this.removeIndex();
	},

	onMouseDownIndices: function(event) {

		// block event from parent
		//
		this.block(event);

		// remove search indices
		//
		this.removeIndices();
	}
});