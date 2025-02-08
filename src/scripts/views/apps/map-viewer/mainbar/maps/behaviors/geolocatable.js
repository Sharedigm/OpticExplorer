/******************************************************************************\
|                                                                              |
|                               geolocatable.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for being able to specify an item's.          |
|        geographical location.                                                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Place from '../../../../../../models/places/place.js';
import CheckIn from '../../../../../../models/places/check-in.js';

export default {

	//
	// attributes
	//

	events: {
		'click .check-in': 'onClickCheckIn',
		'click .check-out': 'onClickCheckOut',
		'click .where': 'onClickWhere',
	},

	//
	// check-in methods
	//

	checkIn: function(options) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				this.checkInAt(new Place({
					name: 'My Location',
					latitude: position.coords.latitude,
					longitude: -position.coords.longitude,
					zoom_level: 9.5
				}));
			}, () => {

				// no location found
				//
				this.checkInAt(null, options);
			});
		} else {

			// no ability to get current location
			//
			this.checkInAt(null, options);
		}
	},

	checkInAt: function(place, options) {
		this.showCheckInDialog(_.extend({
			model: place,

			// callbacks
			//
			accept: (place) => {

				// create new check in
				//
				this.model.set('check_in', new CheckIn(place.attributes));

				// show check in place
				//
				this.showCheckIn(place);

				// enable save
				//
				this.onChange();
			}
		}, options));
	},

	checkOut: function() {
		this.model.set('check_in', null);
		this.clearCheckIn();

		// enable save
		//
		this.onChange();
	},

	//
	// rendering methods
	//

	showCheckIn: function(checkIn) {
		this.$el.find('.where .name').text(checkIn.get('name'));
		this.$el.find('.where').show();
		this.$el.find('.check-in.btn').hide();
		this.$el.find('.check-out.btn').show();
		this.removeTooltips();
	},

	clearCheckIn: function() {
		this.$el.find('.where .name').text('');
		this.$el.find('.where').hide();
		this.$el.find('.check-in.btn').show();
		this.$el.find('.check-out.btn').hide();	
		this.removeTooltips();
	},

	//
	// dialog rendering methods
	//

	showCheckInDialog: function(options) {
		import(
			'../../../../../../views/apps/map-viewer/dialogs/places/check-in-dialog-view.js'
		).then((CheckInDialogView) => {

			// show check in dialog
			//
			application.show(new CheckInDialogView.default(options));
		});
	},

	showCheckInMapViewer: function() {
		application.launch('map_viewer', {
			place: this.model.get('check_in')
		});
	},

	//
	// mouse event handling methods
	//

	onClickCheckIn: function() {
		this.checkIn({
			name: 'My Location'
		});
	},

	onClickCheckOut: function() {
		this.checkOut();
	},

	onClickWhere: function(event) {
		this.showCheckInMapViewer();

		// block event from parent
		//
		this.block(event);
	}
};