/******************************************************************************\
|                                                                              |
|                                 pages-view.js                                |
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

import CarouselView from '../../../views/layout/carousel-view.js';
import PageView from '../../../views/items/pages/page-view.js';

export default CarouselView.extend({

	//
	// attributes
	//

	template: template(`
		<svg class="defs">
			<defs></defs>
		</svg>
	`),

	childView: PageView,

	//
	// querying methods
	//

	isFullScreen: function() {
		return this.$el.hasClass('is-fullscreen');
	},
	
	hasItem: function(itemNumber) {
		return this.children.findByIndex(itemNumber - 1) != undefined;
	},

	//
	// getting methods
	//

	getItem: function(itemNumber) {
		return this.children.findByIndex(itemNumber - 1);
	},

	//
	// setting methods
	//

	setItemNumber: function(itemNumber) {
		/*
		this.$el.find('.current').removeClass('current');
		let item = this.getItem(itemNumber);
		if (item) {
			item.$el.addClass('current');
		}
		*/
		if (this.carousel && this.carousel.selectedIndex + 1 != itemNumber) {
			this.carousel.selectCell(itemNumber - 1);
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			// filters: ShadowFilters,
			// gradients: LinearGradients
		};
	},

	childViewOptions: function(model) {
		return _.extend({}, this.options, {
			model: model,
			current: this.collection.indexOf(model) == this.options.index,

			// options
			//
			selected: this.options.selected && this.options.selected.length > 0 && this.options.selected.contains(model)
		});
	},

	//
	// event handling methods
	//

	onChange: function() {
		if (this.parent) {
			this.parent.setItemNumber(this.carousel.selectedIndex + 1);
		}
	},

	onFullScreenChange: function(isFullScreen) {

		// desktop apps
		//
		if (this.getParentView('app').isDesktop()) {
			if (isFullScreen) {
				$('#header').hide();
			} else {
				$('#header').show();
			}

		// non desktop apps
		//
		} else {
			if (isFullScreen) {
				this.getParentView('app').dialog.maximize();
			} else {
				this.getParentView('app').dialog.unmaximize();
			}
		}
	},

	//
	// mouse event handling methods
	//

	onMouseDownButton: function(event) {
		/*
		if (!this.isFullScreen()) {
			$('.navbar-fixed-top').hide();
		} else {
			$('.navbar-fixed-top').show();
		}
		*/

		// block event from parent
		//
		this.block(event);
	}
});