/******************************************************************************\
|                                                                              |
|                                nav-bar-view.js                               |
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

import ToolbarView from '../../../../views/apps/common/toolbars/toolbar-view.js';
import Timeable from '../../../../views/behaviors/effects/timeable.js';
import NumberInputView from '../../../../views/forms/inputs/number-input-view.js';
import FirstButtonView from '../../../../views/items/pages/nav-bar/buttons/first-button-view.js';
import PrevButtonView from '../../../../views/items/pages/nav-bar/buttons/prev-button-view.js';
import NextButtonView from '../../../../views/items/pages/nav-bar/buttons/next-button-view.js';
import LastButtonView from '../../../../views/items/pages/nav-bar/buttons/last-button-view.js';
import PlayButtonView from '../../../../views/items/pages/nav-bar/buttons/play-button-view.js';

export default ToolbarView.extend(_.extend({}, Timeable, {

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
		<% if (show_play) { %>
		<div class="play hidden-xxs" data-toggle="tooltip" title="Play" data-placement="top"></div>
		<% } %>
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
		if (!this.options.itemNumber) {
			this.options.itemNumber = 1;
		}

		// set attributes
		//
		this.itemNumber = this.options.itemNumber;
		this.numItems = this.options.numItems;
	},

	//
	// querying methods
	//

	isPlaying: function() {
		return this.playing == true;
	},

	//
	// getting methods
	//

	getItemNumber: function() {
		return this.getChildView('current').getValue();
	},

	//
	// setting methods
	//

	setItemNumber: function(itemNumber) {
		this.itemNumber = itemNumber;
		this.getChildView('current').setValue(itemNumber);
		this.update();
	},

	setNumItems: function(numItems) {
		this.numItems = numItems;
		this.$el.find('.total').html(numItems);
		this.update();
	},

	//
	// playing methods
	//

	play: function() {

		// check if already playing
		//
		if (this.playing) {
			return;
		}

		// start slide show
		//
		this.playing = true;
		this.nextSlide();
	},

	nextSlide: function() {
		let next = (this.itemNumber % this.numItems) + 1;
		let app = this.getParentView('app');
		let duration = app.preferences.get('slide_duration');

		if (this.playing) {
			this.parent.setItemNumber(next, {

				// callbacks
				//
				success: () => {
					if (this.playing) {

						// go to next slide after delay
						//
						this.setTimeout(() => {

							// check for wraparound
							//
							let wraparound = (next == this.numItems);
							if (wraparound && !app.preferences.get('slide_looping')) {
								this.getChildView('play').deselect();
							} else if (this.playing) {
								this.nextSlide();
							}
						}, duration * 1000);
					}
				}
			});
		}
	},

	stop: function() {

		// set attributes
		//
		this.playing = false;

		// stop slide show
		//
		this.clearTimeout();
	},

	toggleSlideShow: function() {
		this.getChildView('play').toggle();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			total: this.numItems,
			show_play: this.options.playable
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
			value: this.itemNumber, 
			max: this.numItems,

			// callbacks
			//
			onchange: () => this.parent.setItemNumber(this.getItemNumber())
		}));
		this.showChildView('next', new NextButtonView({
			model: this.model
		}));
		this.showChildView('last', new LastButtonView({
			model: this.model
		}));
		if (this.options.playable) {
			this.showChildView('play', new PlayButtonView({
				model: this.model
			}));
		}
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
		let itemNumber = this.parent.collection? this.parent.collection.indexOf(this.parent.model) + 1 : undefined;
		let numItems = this.parent.collection? this.parent.collection.length : undefined;
		this.setNumItems(numItems);
		this.setItemNumber(itemNumber);
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		this.stop();
	}
}));
