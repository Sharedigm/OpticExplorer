/******************************************************************************\
|                                                                              |
|                             app-launcher-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for launching applications.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import AppView from '../../../views/apps/common/app-view.js';
import AppLaunchable from '../../../views/apps/common/behaviors/opening/app-launchable.js';
import HeaderBarView from '../../../views/apps/app-launcher/header-bar/header-bar-view.js';
import AppsCarouselView from '../../../views/apps/app-launcher/mainbar/apps-carousel/apps-carousel-view.js';
import FooterBarView from '../../../views/apps/app-launcher/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/app-launcher/forms/preferences/preferences-form-view.js'

export default AppView.extend(_.extend({}, AppLaunchable, {

	//
	// attributes
	//

	name: 'app_launcher',

	//
	// launcher attributes
	//

	pageIndex: 1,
	redrawInterval: 100,
	duration: 300,
	
	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppView.prototype.initialize.call(this);

		// set attributes
		//
		if (!this.collection) {
			this.collection = this.getLaunchableApps();
		}

		// set static attributes
		//
		this.constructor.current = this;
	},

	//
	// getting methods
	//

	getLaunchableApps: function() {
		let apps = application.getVisibleApps((app) => {
			return app.get('id') != 'app_launcher' && !app.get('hidden');
		});

		// sort by app name
		//
		apps.comparator = function(item) {
			return item.get('name');
		};
		apps.sort();

		return apps;
	},

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		AppView.prototype.onRender.call(this);

		// update
		//
		this.onLoad();
	},

	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView();
	},

	//
	// content rendering methods
	//

	getContentsView: function() {
		return new AppsCarouselView({
			collection: this.collection,

			// callbacks
			//
			onclick: () => {

				// close dialog if not a selection dialog
				//
				if (this.dialog && this.parent && !this.parent.opener) {
					this.dialog.hide();
				}
			},

			onopen: (item) => {

				// perform callback
				//
				if (this.options.onopen) {
					this.options.onopen(item);
					return;
				}

				// play launch sound
				//
				application.play('launch');

				// launch selected app
				//
				if (item) {						
					window.setTimeout(() => {
						this.openItem(item);

						// close dialog
						//
						if (this.dialog) {
							this.dialog.hide();
						}
					}, this.duration);
				}
			}
		});
	},

	//
	// footer bar rendering methods
	//

	getFooterBarView: function() {
		return new FooterBarView({
			collection: this.collection
		});
	},

	//
	// window event handling methods
	//

	onMaximize: function() {
		if (this.getChildView('contents')) {
			this.getChildView('contents').update();
		}

		// make parent dialog transparent
		//
		if (this.dialog.isFullScreen()) {
			this.dialog.$el.addClass('transparent');
		}
	},

	onUnmaximize: function() {
		if (this.getChildView('contents')) {
			this.getChildView('contents').update();
		}

		// make parent dialog transparent
		//
		if (this.dialog.isFullScreen()) {
			this.dialog.$el.removeClass('transparent');
		}
	},

	onResize: function() {
		if (this.getChildView('contents')) {
			this.getChildView('contents').onResize();
		}
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// clear static attributes
		//
		this.constructor.current = null;
	}
}), {

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	}
});