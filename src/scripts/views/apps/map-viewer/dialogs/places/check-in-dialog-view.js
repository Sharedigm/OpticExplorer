/******************************************************************************\
|                                                                              |
|                            check-in-dialog-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box to select a geographical place.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Place from '../../../../../models/places/place.js';
import DialogView from '../../../../../views/dialogs/dialog-view.js';
import PlaceNameFormView from '../../../../../views/apps/map-viewer/forms/info/place-name-form-view.js';

export default DialogView.extend({

	//
	// attributes
	//
	
	className: 'focused modal dialog',

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-map-marker-alt"></i>
					</div>
					<div class="title">
						Check In
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="map-viewer"></div>
				<div class="panel">
					<div class="place-name-form"></div>
				</div>
		
				<div class="modal-footer">
					<div class="notes">
						<span class="required"></span>Fields are required
					</div>
					
					<div class="buttons">
						<button class="ok btn btn-primary">
							<i class="fa fa-check"></i>OK
						</button>
						<button class="cancel btn" data-dismiss="modal">
							<i class="fa fa-xmark"></i>Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	regions: {
		map_viewer: {
			el: '.map-viewer',
			replaceElement: true
		},
		form: {
			el: '.place-name-form',
			replaceElement: true
		}
	},

	events: _.extend({}, DialogView.prototype.events, {
		'click .ok': 'onClickOk'
	}),

	//
	// dialog attributes
	//

	icon: '<i class="fa fa-save"></i>',
	title: "Select Place",

	//
	// getting methods
	//

	getPlace: function() {

		// get location on map
		//
		let mapView = this.getChildView('map_viewer').getActivePaneView();
		let latLon = mapView.getLatLon();

		// create new place
		//
		return new Place({
			name: this.getChildView('form').getValue('name'),
			latitude: latLon.latitude,
			longitude: latLon.longitude,
			zoom_level: mapView.getZoomLevel()
		});
	},

	//
	// setting methods
	//

	setName: function(name) {
		this.getChildView('form').setValue('name', name);
	},

	//
	// dialog methods
	//

	accept: function() {

		// check form validation
		//
		if (this.getChildView('form').isValid()) {
			let place = this.getPlace();

			// close dialog 
			//
			this.hide();
			
			// perform callback
			//
			if (this.options.accept) {
				return this.options.accept(place);
			}
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		
		// call superclass method
		//
		DialogView.prototype.onRender.call(this);

		// show child views
		//
		this.showPlaceNameForm();
	},

	onShow: function() {

		// call superclass method
		//
		DialogView.prototype.onShow.call(this);

		// show child views
		//
		this.showMapViewer();
	},

	showMapViewer: function() {
		this.showChildApp('map_viewer', {

			// app options
			//
			currentPlace: this.model,

			// callbacks
			//
			onselect: (item) => this.setName(item.model.get('name'))
		});
	},

	showPlaceNameForm: function() {
		this.showChildView('form', new PlaceNameFormView({
			name: this.model? this.model.get('name') : this.options.name
		}));
	},

	//
	// mouse event handling methods
	//

	onClickOk: function() {
		this.accept();
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		this.getChildView('map_viewer').onKeyDown(event);
	},

	//
	// window event handling methods
	//

	onResize: function(event) {

		// call superclass method
		//
		DialogView.prototype.onResize.call(this, event);

		// resize map view
		//
		this.getChildView('map_viewer').onResize(event);
	}
});