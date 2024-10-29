/******************************************************************************\
|                                                                              |
|                               help-page-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing help pages.                           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../views/base-view.js';
import Keyboard from '../../views/keyboard/keyboard.js';

export default BaseView.extend({

	//
	// attributes
	//

	events: {
		'click a:not(.lightbox)': 'onClickLink',
		'click .first': 'onClickFirst',
		'click .prev': 'onClickPrev',
		'click .next': 'onClickNext',
		'click .last': 'onClickLast',
	},

	//
	// constructor
	//

	initialize: function() {

		// set link attributes
		//
		this.links = {
			first: this.options.links[0].hash,
			last: this.options.links[this.options.links.length - 1].hash
		};
		if (this.options.pageNumber > 1) {
			this.links.prev = this.options.links[this.options.pageNumber - 2].hash;
		}
		if (this.options.pageNumber < this.options.links.length) {
			this.links.next = this.options.links[this.options.pageNumber].hash;
		}

		// set tooltip attributes
		//
		/*
		this.tooltips = {
			first: this.options.links[0].innerText,
			last: this.options.links[this.options.links.length - 1].innerText		
		};
		if (this.options.pageNumber > 1) {
			this.tooltips.prev = this.options.links[this.options.pageNumber - 2].innerText;
		}
		if (this.options.pageNumber < this.options.links.length) {
			this.tooltips.next = this.options.links[this.options.pageNumber].innerText;
		}
		*/
		this.tooltips = {
			first: 'First',
			prev: 'Prev',
			next: 'Next',
			last: 'Last'		
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			pageNumber: this.options.pageNumber,
			numPages: this.options.links.length,
			tooltips: this.tooltips
		};
	},

	addTooltips: function(options) {

		// show tooltips on hover
		//
		BaseView.prototype.addTooltips.call(this, _.extend({
			placement: 'top',
			trigger: 'hover',
			container: this.$el
		}, options));
	},

	//
	// mouse event handling methods
	//

	onClickLink: function(event) {
		if (event.target.origin == window.location.origin) {

			// go to first page view
			//
			application.navigate(event.target.hash, {
				trigger: true
			});

			event.preventDefault();
		}
	},

	onClickFirst: function() {

		// go to first page view
		//
		if (this.links.first) {
			application.navigate(this.links.first, {
				trigger: true
			});
		}
	},

	onClickPrev: function() {

		// go to prev page view
		//
		if (this.links.prev) {
			application.navigate(this.links.prev, {
				trigger: true
			});
		}
	},

	onClickNext: function() {

		// go to next page view
		//
		if (this.links.next) {
			application.navigate(this.links.next, {
				trigger: true
			});
		}
	},

	onClickLast: function() {

		// go to last page view
		//
		if (this.links.last) {
			application.navigate(this.links.last, {
				trigger: true
			});
		}
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {

		// disregard handled or repeated key events
		//
		if (event.isDefaultPrevented() || event.isPropagationStopped() || Keyboard.isAutorepeat(event)) {
			return;
		}

		switch (event.keyCode) {

			case Keyboard.keyCodes['up arrow']:
				this.onClickFirst();
				break;

			case Keyboard.keyCodes['left arrow']:
				this.onClickPrev();
				break;

			case Keyboard.keyCodes['right arrow']:
				this.onClickNext();
				break;

			case Keyboard.keyCodes['down arrow']:
				this.onClickLast();
				break;

			default:
				return;
		}

		// block event from parent
		//
		this.block(event);
	}
});
