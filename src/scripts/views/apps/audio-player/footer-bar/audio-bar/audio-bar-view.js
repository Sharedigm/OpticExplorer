/******************************************************************************\
|                                                                              |
|                               audio-bar-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a navigation toolbar.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ToolbarView from '../../../../../views/apps/common/toolbars/toolbar-view.js';
import NumberInputView from '../../../../../views/forms/inputs/number-input-view.js';
import FirstButtonView from '../../../../../views/apps/audio-player/footer-bar/audio-bar/buttons/first-button-view.js';
import PrevButtonView from '../../../../../views/apps/audio-player/footer-bar/audio-bar/buttons/prev-button-view.js';
import NextButtonView from '../../../../../views/apps/audio-player/footer-bar/audio-bar/buttons/next-button-view.js';
import LastButtonView from '../../../../../views/apps/audio-player/footer-bar/audio-bar/buttons/last-button-view.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="first" data-toggle="tooltip" title="First" data-placement="top"></div>
		<div class="prev" data-toggle="tooltip" title="Prev" data-placement="top"></div>
		<div class="current" data-toggle="tooltip" title="Current" data-placement="top"></div>
		<div class="num-items info-bar">/ <span class="total"><%= total %></span></div>
		<div class="next" data-toggle="tooltip" title="Next" data-placement="top"></div>
		<div class="last" data-toggle="tooltip" title="Last" data-placement="top"></div>
	`),

	regions: {
		first: '.first',
		prev: '.prev',
		current: '.current',
		next: '.next',
		last: '.last'
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.trackNumber = this.options.trackNumber;
		this.numTracks = this.options.numTracks;
	},

	//
	// getting methods
	//

	getTrackNumber: function() {
		return this.getChildView('current').getValue();
	},

	//
	// setting methods
	//

	setTrackNumber: function(trackNumber) {
		this.trackNumber = trackNumber;
		this.getChildView('current').setValue(trackNumber);
		this.update();
	},

	setNumTracks: function(numTracks) {
		this.numTracks = numTracks;
		this.$el.find('.total').html(numTracks);
		this.update();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			total: this.numTracks
		};
	},

	onRender: function() {

		// call superclass method
		//
		ToolbarView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('first', new FirstButtonView({
			model: this.parent.app.model
		}));
		this.showChildView('prev', new PrevButtonView({
			model: this.parent.app.model
		}));
		this.showChildView('current', new NumberInputView({
			value: this.trackNumber, 

			// callbacks
			//
			onchange: () => this.parent.app.setTrackNumber(this.getTrackNumber())
		}));
		this.showChildView('next', new NextButtonView({
			model: this.parent.app.model
		}));
		this.showChildView('last', new LastButtonView({
			model: this.parent.app.model
		}));
	},

	update: function() {

		// update child views
		//
		this.getChildView('first').onRender();
		this.getChildView('prev').onRender();
		this.getChildView('next').onRender();
		this.getChildView('last').onRender();
	},

	onLoad: function() {
		let model = this.parent.app.model;
		let collection = this.parent.app.collection;
		let trackNumber = collection? collection.indexOf(model) + 1 : undefined;
		let numTracks = collection? collection.length : undefined;
		this.setNumTracks(numTracks);
		this.setTrackNumber(trackNumber);

		// hide nav bar if only one item
		//
		if (!trackNumber || numTracks <= 1) {
			this.setVisible(false);
		} else {
			this.setVisible(true);
		}
	}
});
