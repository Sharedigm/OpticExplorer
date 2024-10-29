/******************************************************************************\
|                                                                              |
|                                 pager-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a base view of a set of generic pages.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../views/base-view.js';
import SelectableContainable from '../../../views/behaviors/containers/selectable-containable.js';
import PagesView from '../../../views/items/pages/pages-view.js';
import NavBarView from '../../../views/items/pages/nav-bar/nav-bar-view.js';
import Keyboard from '../../../views/keyboard/keyboard.js';

export default BaseView.extend(_.extend({}, SelectableContainable, {

	//
	// attributes
	//

	className: 'flickable pager',

	template: template(`
		<div class="pages"></div>
		<div class="nav-bar"></div>
	`),

	childView: PagesView,

	regions: {
		pages: '.pages',
		nav: '.nav-bar'
	},

	events: {
		'mousedown': 'onMouseDown',
		'click .fullscreen': 'onClickFullScreen'
	},

	multi_selectable: true,

	//
	// constructor
	//

	initialize: function() {

		// redraw upon 
		//
		this.listenTo(this.collection, 'add', () => {
			this.setNumItems(this.numItems());
			this.setItemNumber(this.getItemNumber());
		});
		this.listenTo(this.collection, 'remove', () => {
			this.setNumItems(this.numItems());
			this.setItemNumber(this.getItemNumber() - 1);
		});
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		this.getChildView('pages').each(callback, filter, options);
	},

	//
	// querying methods
	//

	indexOf: function(item) {
		let index = this.collection.indexOf(item.model);

		// item not found
		//
		if (index == -1) {
			index = undefined;
		}

		return index;
	},

	//
	// counting methods
	//

	numItems: function() {
		return this.collection.length;
	},

	//
	// getting methods
	//

	getItemNumber: function() {
		return this.getChildView('nav').getItemNumber();
	},

	getCurrentItem: function() {
		let itemNumber = this.getChildView('nav').itemNumber;
		return this.getChildView('pages').getItem(itemNumber);
	},

	//
	// setting methods
	//

	setItemNumber: function(itemNumber, options) {
		let numItems = this.numItems();

		// check if item number is out of bounds
		//
		if (itemNumber < 1) {
			itemNumber = 1;
		}
		if (itemNumber > numItems) {
			itemNumber = numItems;
		}

		// update views
		//
		this.getChildView('pages').setItemNumber(itemNumber);
		this.getChildView('nav').setItemNumber(itemNumber);

		// perform callback
		//
		if (options && options.success) {
			options.success();
		}
	},

	setNumItems: function(numItems) {
		this.getChildView('nav').setNumItems(numItems);
		this.updateNavBar();
	},
	
	//
	// navigating methods
	//

	first: function() {
		this.setItemNumber(1);
	},

	prev: function() {
		let itemNumber = this.getItemNumber();
		if (itemNumber > 1) {

			// go to prev
			//
			this.setItemNumber(itemNumber - 1);
		} else {

			// wraparound
			//
			this.setItemNumber(this.numItems());
		}
	},

	next: function() {
		let itemNumber = this.getItemNumber();
		if (itemNumber <  this.numItems()) {

			// go to next
			//
			this.setItemNumber(itemNumber + 1);
		} else {

			// wraparound
			//
			this.setItemNumber(1);
		}
	},

	last: function() {
		this.setItemNumber(this.numItems());
	},

	//
	// selecting methods
	//

	selectCurrentItem: function() {
		let item = this.getCurrentItem();
		if (item) {
			item.select();
		}
	},

	deselectCurrentItem: function() {
		let item = this.getCurrentItem();
		if (item) {
			item.deselect();
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		let selected = this.options.selected? this.options.selected[this.options.selected.length - 1] : undefined;
		let index = selected? this.indexOf(selected) : 0;

		// if none selected then start at first item
		//
		if (index == undefined) {
			index = 0;
		}

		// show child views
		//
		this.showPages(index);
		this.showNavBar(index);
		this.updateNavBar();

		// add expand button
		//	
		this.addTooltips({
			container: this.$el
		});
	},

	showPages: function(index) {
		this.showChildView('pages', new this.childView(_.extend({}, this.options, {
			model: this.model,
			collection: this.collection,

			// options
			//
			index: index
		})));
	},

	showNavBar: function(index) {
		this.showChildView('nav', new NavBarView({
			itemNumber: index + 1,
			numItems: this.numItems(),
			playable: this.options.playable
		}));
	},

	update: function() {
		this.showPages();
		this.updateNavBar();
	},

	updateNavBar: function() {
		if (this.collection.length > 1) {
			this.$el.find('.nav-bar').css('visibility', 'visible');
		} else if (this.hasChildView('nav')) {
			this.$el.find('.nav-bar').css('visibility', 'hidden');
		}
	},

	//
	// mouse handling events
	//

	onMouseDown: function(event) {
		if (event.target != this.el) {
			return;
		}

		let item = this.getChildView('pages').getItem(this.getItemNumber());
		if (item) {
			item.deselect();
		}
	},

	onClickFullScreen: function(event) {

		// perform callback
		//
		if (this.options.onFullScreen) {
			this.options.onFullScreen(event);
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

		// check non-control key events
		//
		if (!event.metaKey && !event.ctrlKey) {

			// check non control key events
			//
			switch (event.keyCode) {

				// go to first item
				//
				case Keyboard.keyCodes['up arrow']:
					this.first();
					return true;

				// go to prev item
				//
				case Keyboard.keyCodes['left arrow']:
					this.prev();
					return true;

				// go to next item
				//
				case Keyboard.keyCodes['right arrow']:
					this.next();
					return true;

				// go to last item
				//
				case Keyboard.keyCodes['down arrow']:
					this.last();
					return true;

				default:
					return;
			}
		} else {
			return;
		}
	}
}));