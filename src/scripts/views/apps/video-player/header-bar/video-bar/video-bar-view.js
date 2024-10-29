/******************************************************************************\
|                                                                              |
|                               video-bar-view.js                              |
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
import FirstButtonView from '../../../../../views/apps/video-player/header-bar/video-bar/buttons/first-button-view.js';
import PrevButtonView from '../../../../../views/apps/video-player/header-bar/video-bar/buttons/prev-button-view.js';
import NextButtonView from '../../../../../views/apps/video-player/header-bar/video-bar/buttons/next-button-view.js';
import LastButtonView from '../../../../../views/apps/video-player/header-bar/video-bar/buttons/last-button-view.js';

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
		last: '.last',
		play: '.play'
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.clipNumber = this.options.clipNumber;
		this.numClips = this.options.numClips;
	},

	//
	// querying methods
	//

	isPlaying: function() {
		return this.interval != undefined;
	},

	//
	// getting methods
	//

	getClipNumber: function() {
		return this.getChildView('current').getValue();
	},

	//
	// setting methods
	//

	setClipNumber: function(clipNumber) {
		this.clipNumber = clipNumber;
		this.getChildView('current').setValue(clipNumber);
		this.update();
	},

	setNumClips: function(numClips) {
		this.numClips = numClips;
		this.$el.find('.total').html(numClips);
		this.update();
	},

	//
	// playing methods
	//

	stop: function() {
		if (this.hasChildView('play')) {
			this.getChildView('play').deselect();
		}	
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			total: this.numClips
		};
	},

	onRender: function() {
		
		// call superclass method
		//
		ToolbarView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('first', new FirstButtonView({
			model: this.model
		}));
		this.showChildView('prev', new PrevButtonView({
			model: this.model
		}));
		this.showChildView('current', new NumberInputView({

			// options
			//
			value: this.clipNumber, 

			// callbacks
			//
			onchange: () => this.parent.app.setClipNumber(this.getClipNumber())
		}));
		this.showChildView('next', new NextButtonView({
			model: this.model
		}));
		this.showChildView('last', new LastButtonView({
			model: this.model
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

	//
	// event handling methods
	//

	onLoad: function() {
		let clipNumber = this.parent.app.getClipNumber();
		let numClips = this.parent.app.numClips();
		this.setNumClips(numClips);
		this.setClipNumber(clipNumber);

		// hide nav bar if only one item
		//
		this.setVisible(numClips > 1);
	}
});
