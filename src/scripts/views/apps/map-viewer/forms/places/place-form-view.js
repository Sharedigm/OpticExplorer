/******************************************************************************\
|                                                                              |
|                               place-form-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form used to specify a geographical place.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Directory from '../../../../../models/storage/directories/directory.js';
import FormView from '../../../../../views/forms/form-view.js';
import '../../../../../../vendor/bootstrap/js/plugins/bootstrap-select/bootstrap-select.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="name form-group">
			<label class="required control-label"><i class="fa fa-font"></i>Name</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" value="<%= name %>">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Name" data-content="This is the name of this place."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="icon-path form-group" style="margin:10px 0">
			<label class="control-label"><i class="fa fa-image"></i>Icon</label>
			<div class="controls">
		
				<div class="control-inline">
					<span class="path"><%= icon_path %></span>
				</div>
		
				<div class="buttons-inline">
					<button type="button" class="change success btn btn-sm" data-toggle="tooltip" title="Change" data-placement="top">
						<i class="fa fa-folder"></i>
					</button>
					<button type="button" class="clear warning btn btn-sm" data-toggle="tooltip" title="Clear" data-placement="top">
						<i class="fa fa-xmark"></i>
					</button>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Icon Path Folder" data-content="This is the image file to display to identify the topic." style="display:none"></i>
			</div>
		</div>

		<div class="description form-group">
			<label class="control-label"><i class="fa fa-quote-left"></i>Description</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" rows="3" maxlength="1000"><%= description %></textarea>
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
					<input type="number" class="required form-control" min="1" max="20" value="<%= zoom_level.toPrecision(3) %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Zoom Level" data-content="This is the map zoom level to use for this place."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="set-location form-group">
			<label class="control-label"><i class="fa fa-map-marker"></i>Location</label>
			<div class="inline controls">
				<div class="buttons">
					<button class="select-place btn">
						<i class="fa fa-crosshairs"></i>Select Place
					</button>
					<% if (show_set_to_current) { %>
					<button class="set-to-current btn">
						<i class="fa fa-search"></i>Set to Current
					</button>
					<% } %>
				</div>
			</div>
		</div>
	`),

	events: _.extend({}, FormView.prototype.events, {
		'click .icon-path button.change': 'onClickChangeIconPath',
		'click .icon-path button.clear': 'onClickClearIconPath',
		'click .select-place': 'onClickSelectPlace',
		'click .set-to-current': 'onClickSetToCurrent',
		'click .zoom-level .set-to-current': 'onClickZoomLevelSetToCurrent'
	}),

	//
	// constructor
	//

	initialize: function() {

		// check range of values
		//
		if (!this.model.has('zoom_level') || this.model.get('zoom_level') > 20) {
			this.model.set({
				'zoom_level': 20
			});
		}
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'name':
				return this.$el.find('.name input').val();
			case 'icon_path':
				return this.$el.find('.icon-path .path').text() != ''? this.$el.find('.icon-path .path').text() : null;
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
			icon_path: this.getValue('icon_path'),
			description: this.getValue('description'),
			latitude: this.getValue('latitude'),
			longitude: this.getValue('longitude'),
			zoom_level: this.getValue('zoom_level')
		};
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'name':
				this.$el.find('.name input').val(value);
				break;
			case 'icon_path':
				this.$el.find('.icon-path .path').text(value);
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

	selectIconPath: function() {

		// load directory
		//
		new Directory({
			path: config.apps.map_viewer.place_icon_selector_path
		}).load({

			// callbacks
			//
			success: (model) => {

				// select from directory's parent
				//
				this.showIconPathDialog(model, {
					selected: model.getItemNamed(this.model.get('icon_path'))
				});
			},

			error: () => {

				// select from home directory
				//
				this.showIconPathDialog(application.getDirectory());
			}
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			name: this.model.get('name'),
			icon_path: this.model.get('icon_path'),
			description: this.model.get('description'),
			latitude: this.model.get('latitude'),
			longitude: this.model.get('longitude'),
			zoom_level: this.model.get('zoom_level'),
			show_set_to_current: this.options.mapView != undefined
		};
	},

	//
	// dialog rendering methods
	//

	showIconPathDialog: function(directory, options) {
		import(
			'../../../../../views/apps/file-browser/dialogs/files/open-items-dialog-view.js'
		).then((OpenItemsDialogView) => {

			// show select uploads dialog
			//
			application.show(new OpenItemsDialogView.default({
				model: directory,

				// options
				//
				title: "Select Place Icon",
				selected: options? options.selected : null,
			
				// callbacks
				//
				onopen: (items) => {

					// update icon path
					//
					if (items.length > 0) {
						let iconPath = items[0].get('path');

						// update form
						//
						this.setValue('icon_path', iconPath);

						// update parent
						//
						this.onChange();
					}
				}
			}));
		});
	},

	showSelectPlaceDialog: function(options) {
		import(
			'../../../../../views/apps/map-viewer/dialogs/places/select-place-dialog-view.js'
		).then((SelectPlaceDialogView) => {

			// show select place dialog
			//
			application.show(new SelectPlaceDialogView.default(options));
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
			model: this.model,
			
			// callbacks
			//
			accept: (place) => {
				this.setPlace(place);
			}
		});

		// block event from parent
		//
		this.block(event);
	},

	onClickSetToCurrent: function() {
		this.setLatLon(this.options.mapView.getLatLon());
		this.setValue('zoom_level', Math.ceil(this.options.mapView.getZoomLevel()));
	}
});