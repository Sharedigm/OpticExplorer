/******************************************************************************\
|                                                                              |
|                              item-card-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a file or directory icon and name.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CardView from '../../../../../../views/items/cards/card-view.js';
import ItemBadgesView from '../../../../../../views/apps/file-browser/mainbar/files/badges/item-badges-view.js';
import FileUtils from '../../../../../../utilities/files/file-utils.js';

export default CardView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="card">
		
			<div class="icon">
				<%= icon %>
				
				<% if (owner) { %>
				<div class="owner small tile" data-toggle="tooltip" data-html="true" title="shared by<br /><%= owner.getName() %>" data-placement="right">
					<% if (owner.hasProfilePhoto()) { %>
					<div class="thumbnail" style="background-image:url(<%= owner_thumbnail_url %>)">
						<img style="display:none" src="<%= owner_thumbnail_url %>" onerror="this.classList.add('lost')" />
						<i class="placeholder far fa-user"></i>
					</div>
					<% } else { %>
					<div class="thumbnail">
						<i class="fa fa-user"></i>
					</div>
					<% } %>
				</div>
				<% } %>
		
				<div class="spinner"></div>
			</div>
		
			<div class="info">
				<div class="row">
					<div class="name" spellcheck="false"><%= name %></div>
				</div>
		
				<div class="specifics row">
					<span class="details"><%= details %></span>
					<div class="badges"></div>
				</div>
			</div>
		</div>
	`),
	ownerThumbnailSize: 25,

	regions: {
		badges: {
			el: '.badges',
			replaceElement: true
		}
	},

	//
	// querying methods
	//

	isUniqueName: function(name) {
		let item = this.model.collection.directory.getItemNamed(name);
		return !item || item == this.model;
	},

	hasOwner: function() {
		return this.model? this.model.has('owner') : false;
	},

	//
	// getting methods
	//

	getName: function() {
		return this.model.getName();
	},

	getOwner: function() {
		return this.model? this.model.get('owner') : undefined;
	},

	getOwnerThumbnailUrl: function() {
		if (!this.hasOwner()) {
			return false;
		}
		let owner = this.getOwner()
		return owner.hasProfilePhoto()? owner.getProfilePhotoUrl({
			min_size: Math.floor(this.ownerThumbnailSize * (window.devicePixelRatio || 1))
		}) : undefined;
	},

	getGeoOrientation: function() {
		return this.model.getGeoOrientation? this.model.getGeoOrientation() : undefined;
	},

	//
	// setting methods
	//

	setName: function(name) {

		// check if name has changed
		//
		if (name != FileUtils.getItemName(this.get('path'))) {
			let path = FileUtils.getDirectoryPath(this.get('path'));

			// rename file
			//
			this.model.moveTo(path? path + name : name, {

				// callbacks
				//
				error: (model, response) => {

					// revert name to previous value
					//
					this.revertName();

					// show error message
					//
					application.error({
						message: "Could not rename this item.",
						response: response
					});
				}
			});
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.getIcon(),
			name: this.getName(),
			owner: this.getOwner(),
			owner_thumbnail_url: this.getOwnerThumbnailUrl(),
			details: this.getDetails()
		};
	},

	showBadges: function() {
		this.showChildView('badges', new ItemBadgesView({
			model: this.model
		}));
	},

	//
	// drag and drop event handling methods
	//

	onDropOut: function() {
		
		// perform callback
		//
		if (this.options.ondropout) {
			this.options.ondropout(this.parent.getSelectedModels());
		}
	}
});