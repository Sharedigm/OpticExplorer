/******************************************************************************\
|                                                                              |
|                            item-place-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form used to specify an item's place.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import File from '../../../../../models/storage/files/file.js';
import Directory from '../../../../../models/storage/directories/directory.js';
import Volume from '../../../../../models/storage/directories/volume.js';
import FormView from '../../../../../views/forms/form-view.js';
import FileIconView from '../../../../../views/apps/file-browser/mainbar/files/icons/file-icon-view.js';
import DirectoryIconView from '../../../../../views/apps/file-browser/mainbar/files/icons/directory-icon-view.js';
import VolumeIconView from '../../../../../views/apps/file-browser/mainbar/files/icons/volume-icon-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="items">
			<div class="icon-grid"></div>
		</div>

		<div class="name form-group">
			<label class="control-label"><i class="fa fa-font"></i>Location</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= name %>">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Location" data-content="This is the name of this place."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="description form-group">
			<label class="control-label"><i class="fa fa-quote-left"></i>Description</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" rows="2" maxlength="1000"><%= description %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Description" data-content="This is a short description of this place."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="coordinates form-group">
			<label class="required control-label"><i class="fa fa-globe-americas"></i>Coordinates</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="latitude form-control" value="<%= latitude? latitude.toPrecision(7) : '' %>">
					<span class="input-group-addon">&degN</span>
					<input type="text" class="longitude form-control" value="<%= longitude? longitude.toPrecision(7) : '' %>">
					<span class="input-group-addon">&degW</span>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Coordinates" data-content="This is the latitude/longitude coordinates of this place."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="zoom-level form-group">
			<label class="required control-label"><i class="fa fa-search"></i>Zoom Level</label>
			<div class="inline controls">
				<div class="input-group" style="width:100px">
					<input type="number" class="required form-control" min="1" max="20" value="<%= zoom_level? zoom_level.toPrecision(3) : '' %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Zoom Level" data-content="This is the map zoom level to use for this place."></i>
					</div>
				</div>
				<% if (show_map_dialog) { %>
				<div class="buttons-inline">
					<button class="select-place btn">
						<i class="fa fa-crosshairs"></i>Set Coordinates
					</button>
				</div>
				<% } %>
			</div>
		</div>
	`),

	regions: {
		item: '.icon-grid'
	},

	events: _.extend({}, FormView.prototype.events, {
		'click .select-place': 'onClickSelectPlace',
	}),

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'name':
				return this.$el.find('.name input').val();
			case 'description':
				return this.$el.find('.description textarea').val();
			case 'latitude':
				return parseFloat(this.$el.find('.latitude').val());
			case 'longitude':
				return parseFloat(this.$el.find('.longitude').val());
			case 'zoom_level':
				return parseFloat(this.$el.find('.zoom-level input').val());
		}
	},

	getValues: function() {
		return {
			name: this.getValue('name'),
			description: this.getValue('description'),
			latitude: this.getValue('latitude'),
			longitude: this.getValue('longitude'),
			zoom_level: this.getValue('zoom_level')
		};
	},

	getIconView: function(item) {
		if (item instanceof Volume) {
			return VolumeIconView;
		} else if (item instanceof File) {
			return FileIconView;
		} else if (item instanceof Directory) {
			return DirectoryIconView;
		}
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'name':
				this.$el.find('.name input').val(value);
				break;
			case 'description':
				this.$el.find('.description textarea').val(value);
				break;
			case 'latitude':
				this.$el.find('.latitude').val(value.toPrecision(7));
				break;
			case 'longitude':
				this.$el.find('.longitude').val(value.toPrecision(7));
				break;
			case 'zoom_level':
				this.$el.find('.zoom-level input').val(value.toPrecision(3));
				break;
		}
	},

	setLatLon: function(latLon) {

		// update form
		//
		this.setValue('latitude', latLon.latitude);
		this.setValue('longitude', latLon.longitude);

		// notify of change
		//
		this.onChange();
	},

	setPlace: function(place) {

		// update form
		//
		this.setValue('latitude', place.get('latitude'));
		this.setValue('longitude', place.get('longitude'));
		this.setValue('zoom_level', place.get('zoom_level'));

		// notify of change
		//
		this.onChange();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let place = this.model.get('place');

		return {
			name: place? place.get('name') : undefined,
			description: place? place.get('description') : undefined,
			latitude: place? place.get('latitude') : undefined,
			longitude: place? place.get('longitude') : undefined,
			zoom_level: place? place.get('zoom_level') : undefined,
			show_map_dialog: application.hasApp('map_viewer')
		};
	},

	onRender: function() {

		// call superclass method
		//
		FormView.prototype.onRender.call(this);

		// show child views
		//
		this.showItem();
	},

	showItem: function() {
		this.showChildView('item', new (this.getIconView(this.model))({
			model: this.model,

			// capabilities
			//
			selectable: false
		}));
	},

	//
	// dialog rendering methods
	//

	showSelectPlaceDialog: function(options) {
		application.loadAppView('map_viewer', {

			// callbacks
			//
			success: (MapViewerView) => {
				MapViewerView.showSelectPlaceDialog(options);
			}
		});
	},

	//
	// mouse event handling methods
	//

	onClickChangeIconPath: function() {
		this.selectIconPath();
	},

	onClickClearIconPath: function() {
		this.setValue('icon_path', null);
		this.setIcon(null);
	},

	onClickSelectPlace: function(event) {
		this.showSelectPlaceDialog({
			model: this.model.get('place'),

			// callbacks
			//
			accept: (place) => {
				this.setPlace(place);
			}
		});

		// block event from parent
		//
		this.block(event);
	}
});