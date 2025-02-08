/******************************************************************************\
|                                                                              |
|                               image-bar-view.js                              |
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
import Timeable from '../../../../../views/behaviors/effects/timeable.js';
import NumberInputView from '../../../../../views/forms/inputs/number-input-view.js';
import FirstButtonView from '../../../../../views/apps/image-viewer/header-bar/image-bar/buttons/first-button-view.js';
import PrevButtonView from '../../../../../views/apps/image-viewer/header-bar/image-bar/buttons/prev-button-view.js';
import NextButtonView from '../../../../../views/apps/image-viewer/header-bar/image-bar/buttons/next-button-view.js';
import LastButtonView from '../../../../../views/apps/image-viewer/header-bar/image-bar/buttons/last-button-view.js';
import PlayButtonView from '../../../../../views/apps/image-viewer/header-bar/image-bar/buttons/play-button-view.js';

export default ToolbarView.extend(_.extend({}, Timeable, {

	//
	// attributes
	//

	template: template(`
		<div class="first" data-toggle="tooltip" title="First"></div>
		<div class="prev" data-toggle="tooltip" title="Prev"></div>
		<div class="current" data-toggle="tooltip" title="Current"></div>
		<div class="num-items info-bar">/ <span class="total"><%= total %></span></div>
		<div class="next" data-toggle="tooltip" title="Next"></div>
		<div class="last" data-toggle="tooltip" title="Last"></div>
		<div class="play" data-toggle="tooltip" title="Play"></div>
	`),

	regions: {
		full: '.full',
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
		this.imageNumber = this.options.imageNumber;
		this.numImages = this.options.numImages;
	},

	//
	// querying methods
	//

	isPlaying: function() {
		return this.getChildView('play').isSelected();
	},

	//
	// getting methods
	//

	getImageNumber: function() {
		return this.getChildView('current').getValue();
	},

	//
	// setting methods
	//

	setImageNumber: function(imageNumber) {
		this.imageNumber = imageNumber;
		this.getChildView('current').setValue(imageNumber);
		this.update();
	},

	setNumImages: function(numImages) {
		this.numImages = numImages;
		this.$el.find('.total').html(numImages);
		this.update();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			total: this.numImages
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
			value: this.imageNumber, 
			max: this.numImages,

			// callbacks
			//
			onchange: () => this.app.setImageNumber(this.getImageNumber())
		}));
		this.showChildView('next', new NextButtonView({
			model: this.model
		}));
		this.showChildView('last', new LastButtonView({
			model: this.model
		}));
		this.showChildView('play', new PlayButtonView({
			model: this.model
		}));

		this.setVisible(false);
	},

	update: function() {

		// update child views
		//
		this.getChildView('first').onRender();
		this.getChildView('prev').onRender();
		this.getChildView('next').onRender();
		this.getChildView('last').onRender();
		this.getChildView('play').onRender();
	},

	//
	// event handling methods
	//

	onLoad: function() {
		let imageNumber = this.parent.app.getImageIndex(this.parent.app.model);
		let numImages = this.parent.app.numImages();
		this.setNumImages(numImages);
		this.setImageNumber(imageNumber);

		// hide nav bar if one image or less
		//
		this.setVisible(numImages > 1);
	}
}));