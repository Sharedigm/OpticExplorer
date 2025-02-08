/******************************************************************************\
|                                                                              |
|                        select-location-dialog-view.js                        |
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

import DialogView from '../../../../../views/dialogs/dialog-view.js';

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
						<i class="fa fa-crosshairs"></i>
					</div>
					<div class="title">
						Select Location
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="map-viewer"></div>
		
				<div class="modal-footer">
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
		}
	},

	events: _.extend({}, DialogView.prototype.events, {
		'click .ok': 'onClickOk'
	}),

	//
	// dialog attributes
	//

	icon: '<i class="fa fa-save"></i>',

	//
	// getting methods
	//

	getLatLon: function() {
		return this.getChildView('map_viewer').getLatLon();
	},

	//
	// dialog methods
	//

	accept: function() {
		
		// get location on map
		//
		let latLon = this.getLatLon();

		// close dialog 
		//
		this.hide();
		
		// perform callback
		//
		if (this.options.accept) {
			return this.options.accept(latLon);
		}
	},

	//
	// rendering methods
	//

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

			// options
			//
			place: this.options.place,
			show_address: true
		});
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