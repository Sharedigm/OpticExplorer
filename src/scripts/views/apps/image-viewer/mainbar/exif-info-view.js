/******************************************************************************\
|                                                                              |
|                                exif-info-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing an image file's exif data.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'item-list',

	template: template(`
		<% if (exif && Object.keys(exif).length > 0) { %>
		<% let keys = Object.keys(exif).sort(); %>
		<% for (let i = 0; i < keys.length; i++) { %>
		<% let key = keys[i]; %>
		<% let value = exif[key]; %>
		<div class="item">
			<div class="info">
				<div class="icon">
					<i class="fa fa-info-circle"></i>
				</div>
				<label><%= key.toTitleCase().replace(/_/g,' ') %></label>
				<% if (typeof value == 'object') { %>
				<% value = JSON.stringify(value); %>
				<% } %>
				<span class="name"><%= value.toString() %></span>
			</div>
		</div>
		<% } %>
		<% } else { %>
		<div class="item">
			<div class="info">
				<span class="name">No EXIF data.</span>
			</div>
		</div>
		<% } %>
	`),

	//
	// constructor
	//

	initialize: function() {

		// listen to model for changes
		//
		this.listenTo(this.model, 'change', () => {
			this.render();
		});
	},

	//
	// setting methods
	//

	setModel: function(model) {

		// update attributes
		//
		this.model = model;

		// listen to model for changes
		//
		this.listenTo(this.model, 'change', () => {
			this.render();
		});

		// update view
		//
		this.render();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			exif: this.model? this.model.get('exif') : null
		};
	},

	onRender: function() {

		// load exif if not loaded
		//
		if (this.model && !this.model.has('exif')) {
			this.update();
		}
	},

	update: function() {

		// load exif info
		//
		this.model.fetchExif({

			// callbacks
			//
			success: (data) => {

				// update model
				//
				this.model.set('exif', data, {
					silent: true
				});

				// update view
				//
				this.render();
			}
		});
	},

	clear: function() {
		this.model = null;
		this.render();
	}
});