/******************************************************************************\
|                                                                              |
|                                 spaces-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a base view of a set of desktop pages.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CarouselView from '../../../../views/layout/carousel-view.js';
import DesktopAppView from '../../../../views/apps/desktop/spaces/desktop-app-view.js';
import '../../../../../vendor/flickity/js/flickity.pkgd.js';

export default CarouselView.extend({

	//
	// attributes
	//

	childView: DesktopAppView,
	className: 'spaces',
	events: {},

	//
	// querying methods
	//

	hasApp: function(name) {
		for (let i = 0; i < this.collection.length; i++) {
			let app = this.collection.at(i);
			if (app.get('id') == name) {
				return true;
			}
		}
		return false;
	},

	//
	// setting methods
	//

	setItemNumber: function(itemNumber) {
		if (this.carousel && this.carousel.selectedIndex + 1 != itemNumber) {
			this.carousel.selectCell(itemNumber - 1);
		}
	},

	showLaunchers: function(launcherStyle) {
		for (let i = 0; i < this.children.length; i++) {
			this.getChildViewAt(i).showLauncher(launcherStyle);
		}
	},

	//
	// navigation methods
	//

	prev: function(wraparound) {
		if (this.carousel) {
			this.carousel.previous(wraparound);
			this.parent.onChange();
		}
	},

	next: function(wraparound) {
		if (this.carousel) {
			this.carousel.next(wraparound);
			this.parent.onChange();
		}
	},

	//
	// rendering methods
	//

	childViewOptions: function(model) {
		return {
			app: model,
			model: this.model,
			is_current: this.collection.indexOf(model) == this.options.index,
			show_app_name: true,
			parent: this
		};
	},

	update: function() {
		for (let i = 0; i < this.children.length; i++) {
			this.getChildViewAt(i).update();
		}
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {

		// propagate event to selected view
		//
		let selectedView = this.getSelectedView();
		if (selectedView && selectedView.onKeyDown) {
			selectedView.onKeyDown(event);
		}
	},

	//
	// window event handling methods
	//

	onResize: function(event) {
		for (let i = 0; i < this.children.length; i++) {
			this.getChildViewAt(i).onResize(event);
		}
	},

	//
	// full screen event handling methods
	//

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
	}
});