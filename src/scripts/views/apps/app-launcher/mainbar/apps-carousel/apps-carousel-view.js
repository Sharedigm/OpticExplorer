/******************************************************************************\
|                                                                              |
|                            apps-carousel-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a carousel view used for launching applications.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';
import AppLaunchable from '../../../../../views/apps/common/behaviors/opening/app-launchable.js';
import Timeable from '../../../../../views/behaviors/effects/timeable.js';
import AppsView from '../../../../../views/apps/common/items/apps-view.js';
import Browser from '../../../../../utilities/web/browser.js';
import '../../../../../../vendor/flickity/js/flickity.pkgd.js';

export default BaseView.extend(_.extend({}, AppLaunchable, Timeable, {

	//
	// attributes
	//

	className: 'main-carousel',

	template: template(''),

	events: {
		'click': 'onClick'
	},

	//
	// launcher attributes
	//

	pageIndex: 1,
	redrawInterval: 100,

	//
	// icon attributes
	//

	icons: {
		width: {
			phone: {
				small: 75,
				medium: 90,
				large: 100
			},
			tablet: {
				small: 100,
				medium: 125
			},
			desktop: 100
		},
		height: {
			phone: 90,
			tablet: 150,
			desktop: 100
		}
	},

	//
	// counting methods
	//

	numPages: function() {
		let numGridIcons = this.numGridIcons();
		let numIcons = this.collection.length;
		return Math.ceil(numIcons / numGridIcons);
	},

	numGridIcons: function() {
		let dimensions = this.getGridDimensions();
		return dimensions[0] * dimensions[1];
	},
	
	//
	// getting methods
	//

	getIconWidth: function() {
		if (Browser.is_mobile) {
			let width = this.$el.width();
			switch (Browser.device) {
				case 'phone':
					if (width < 360) {

						// small phone
						//
						return this.icons.width.phone.small;

					} else if (width < 480) {

						// medium phone
						//
						return this.icons.width.phone.medium;
					} else {

						// large phone
						//
						return this.icons.width.phone.large;
					}
				case 'tablet':
					if (width < 768) {
						return this.icons.width.tablet.small;
					} else {
						return this.icons.width.phone.medium;
					}
			}
		} else {

			// desktop
			//
			return this.icons.width.desktop;
		}
	},

	getIconHeight: function() {
		if (Browser.is_mobile) {
			switch (Browser.device) {
				case 'phone':
					return this.icons.height.phone;
				case 'tablet':
					return this.icons.height.tablet;
			}
		} else {

			// desktop
			//
			return this.icons.height.desktop;
		}
	},

	getGridDimensions: function() {

		// find icon size
		//
		let iconWidth = this.getIconWidth();
		let iconHeight = this.getIconHeight();
		let pageDotsHeight = 100;

		// find icon grid size
		//
		let container = this.$el;
		let width = container.width();
		let height = container.height() - pageDotsHeight;

		// find grid dimensions
		//
		let columns = Math.floor(width / iconWidth);
		let rows = Math.floor(height / iconHeight);
		return [columns, rows];
	},

	getPageItems: function(pageIndex) {
		let start = (pageIndex - 1) * this.itemsPerPage;
		let finish = Math.min(start + this.itemsPerPage - 1, this.collection.length - 1);
		return this.collection.getByRange(start, finish);
	},

	//
	// rendering methods
	//

	onAttach: function() {
		this.itemsPerPage = this.numGridIcons();
		this.showPages();

		// perform callback
		//
		if (this.options.onload) {
			this.options.onload();
		}
	},

	update: function() {
		this.itemsPerPage = this.numGridIcons();

		// update icon carousel
		//
		if (this.slider) {
			this.slider.destroy();
		}
		this.$el.empty();
		this.showPages();
	},

	//
	// content rendering methods
	//

	showPage: function(page) {

		// create new page and add to carousel
		//
		let element = $('<div class="carousel-cell"></div>');
		this.$el.append(element);

		// create new page region
		//
		let regionName = 'page' + page;
		this.addRegion(regionName, {
			el: element,
			replaceElement: false
		});

		// render app icon grid into page
		//
		this.showChildView(regionName, new AppsView({
			collection: this.getPageItems(page),

			// options
			//
			view_kind: 'icons',

			// capabilities
			//
			selectable: true,

			// callbacks
			//
			onclick: (item) => this.onClickItem(item)
		}));
	},

	showPages: function() {
		let numPages = this.numPages();
		
		// show page icons for each page
		//
		for (let i = 1; i <= numPages; i++) {
			this.showPage(i);
		}

		// activate slider
		//
		if (numPages > 1) {
			this.slider = new Flickity(this.$el[0], {
				cellAlign: 'left',
				prevNextButtons: false,
				contain: true,
				lazyLoad: false,
				pageDots: true,
				setGallerySize: false
			});
			this.$el.addClass('unflickable');
		} else {
			this.$el.removeClass('unflickable');
		}
	},

	//
	// mouse event handling methods
	//

	onClick: function() {

		// allow carousel drags
		//
		if (this.slider) {
			if (this.slider.isAnimating) {
				return;
			}
		}

		// perform callback
		//
		if (this.options.onclick) {
			this.options.onclick();
		}
	},

	onClickItem: function(item) {

		// perform callback
		//
		if (this.options.onopen) {
			this.options.onopen(item);
		}
	},

	//
	// window event handling methods
	//

	onResize: function() {

		// set delay for resize action
		//
		this.setTimeout(() => {
			this.update();
		}, this.redrawInterval);
	}
}));