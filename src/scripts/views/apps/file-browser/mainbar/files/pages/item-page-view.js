/******************************************************************************\
|                                                                              |
|                               item-page-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a file or directory page and name.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import PageView from '../../../../../../views/items/pages/page-view.js';
import ItemBadgesView from '../../../../../../views/apps/file-browser/mainbar/files/badges/item-badges-view.js';
import FileUtils from '../../../../../../utilities/files/file-utils.js';

export default PageView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="row">
		
			<div class="icon">
				<%= icon %>
		
				<% if (owner) { %>
				<div class="owner tile" data-toggle="tooltip" data-html="true" title="shared by<br /><%= owner.getName() %>" data-placement="right">
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
		
				<div class="badges"></div>
			</div>
		
			<div class="spinner"></div>
		</div>
		
		<div class="row">
			<div class="name" spellcheck="false"><%= name %></div>
			
			<div class="specifics">
				<span class="details"><%= details %></span>
			</div>
		</div>
	`),
	ownerThumbnailSize: 100,

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

	getDetailLevel: function() {
		let detailKind = this.options.preferences? this.options.preferences.get('detail_kind') : undefined;
		if (detailKind) {
			switch (detailKind) {
				case 'size':
					return 2;

				case 'create_date':
				case 'modify_date':
				case 'access_date': {
					let dateFormat = this.options.preferences? this.options.preferences.get('date_format') : undefined;
					switch (dateFormat) {
						case 'date_only':
						case 'day_date':
						case 'time_only':
							return 2;
						case 'date_time':
						case 'day_date_time':
							return 3;
					}
					break;
				}

				case 'album':
				case 'artist':
				case 'band':
				case 'composer':
					return 3;
			}

			return 1;
		}
	},

	//
	// setting methods
	//

	setName: function(name) {

		// check if name has changed
		//
		if (name != FileUtils.getItemName(this.model.get('path'))) {
			let path = FileUtils.getDirectoryPath(this.model.get('path'));

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

	setDetailLevel: function(detailLevel) {
		switch (detailLevel) {
			case 1:
				this.$el.addClass('detailed');
				break;
			case 2:
				this.$el.addClass('detailed2');
				break;
			case 3:
				this.$el.addClass('detailed3');
				break;
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