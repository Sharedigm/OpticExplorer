/******************************************************************************\
|                                                                              |
|                               carousel-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract flickable carousel view.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SelectableCollectionView from '../../views/collections/selectable-collection-view.js';
import '../../../vendor/flickity/js/flickity.pkgd.js';

export default SelectableCollectionView.extend({

	//
	// attributes
	//

	className: 'main-carousel',

	events: _.extend({}, SelectableCollectionView.prototype.events, {
		'mousedown .flickity-button': 'onMouseDownButton'
	}),

	//
	// querying methods
	//

	hasSelectedView() {
		return this.carousel != null;
	},

	//
	// getting methods
	//

	getSelectedIndex: function() {
		return this.carousel? this.carousel.selectedIndex : 0;
	},

	getSelectedView: function() {
		return this.children.findByIndex(this.getSelectedIndex());
	},

	getSlideOffset: function() {
		if (!this.carousel) {
			return 0;
		}

		// return offset relative to current slide
		//
		return this.carousel.x + this.getSelectedIndex() * this.carousel.size.width;
	},

	//
	// navigation methods
	//

	prev: function(wraparound) {
		this.carousel.previous(wraparound);
	},

	next: function(wraparound) {
		this.carousel.next(wraparound);
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.each((child) => {

			// add carousel capability to each child
			//
			child.$el.addClass('carousel-cell');
		});
	},

	onAttach: function() {

		// activate slider
		//
		if (this.collection.length > 1) {

			// create new carousel
			//
			this.carousel = new Flickity(this.el, {

				// options
				//
				initialIndex: this.options.index,
				cellAlign: 'left',
				prevNextButtons: false,
				freeScroll: false,
				contain: true,
				lazyLoad: false,
				pageDots: this.options.pageDots,
				setGallerySize: false,
				wrapAround: true,
				percentPosition: true,

				// disable keyboard controls
				//
				accessibility: false
			});

			// add event handlers
			//
			this.carousel.on('change', () => {
				this.onChange();
			});
			this.carousel.on('scroll', (amount) => {
				this.onScroll(amount);
			});
			this.carousel.on('fullscreenChange', (isFullScreen) => {
				this.onFullScreenChange(isFullScreen);
			});

			// add drag event handlers
			//
			this.carousel.on('dragStart', () => {
				this.onDragStart();
			});
			this.carousel.on('dragMove', () => {
				this.onDrag();
			});
			this.carousel.on('dragEnd', () => {
				this.onDragEnd();
			});
			this.carousel.on('settle', () => {
				this.onSettle();
			});
		}
	},

	//
	// event handling methods
	//

	onChange: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	onScroll: function(amount) {

		// perform callback
		//
		if (this.options.onscroll) {
			this.options.onscroll(amount);
		}
	},

	//
	// drag event handling methods
	//

	onDragStart: function() {
		this.dragged = true;

		// perform callback
		//
		if (this.options.ondragstart) {
			this.options.ondragstart();
		}
	},

	onDrag: function() {

		// perform callback
		//
		if (this.options.ondrag) {
			this.options.ondrag();
		}
	},

	onDragEnd: function() {

		// perform callback
		//
		if (this.options.ondragend) {
			this.options.ondragend();
		}
	},

	onSettle: function() {
		this.dragged = false;

		// perform callback
		//
		if (this.options.onsettle) {
			this.options.onsettle();
		}
	},

	//
	// mouse event handling methods
	//

	onMouseDownButton: function(event) {

		// block event from parent
		//
		this.block(event);
	}
});