/******************************************************************************\
|                                                                              |
|                               footer-bar-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used to display an app's footer bar.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ToolbarContainerView from '../../../../views/apps/common/toolbars/toolbar-container-view.js';
import WindowBarView from '../../../../views/apps/common/footer-bar/window-bar/window-bar-view.js';

export default ToolbarContainerView.extend({

	//
	// attributes
	//

	className: 'footer-bar',
	toolbars: ['window', 'status'],
	mandatory_toolbars: ['window', 'status'],

	//
	// querying methods
	//

	regions: function() {
		let regions = {};
		for (let i = 0; i < this.toolbars.length; i++) {
			let toolbar = this.toolbars[i];
			regions[toolbar] = {
				el: '.' + toolbar.replace(/_/g, '-') + '-bar',
				replaceElement: true
			};
		}
		return regions;
	},

	getWindowBarView: function() {
		return new WindowBarView();
	},

	isOptionalToolbarKind: function(toolbar) {
		return !this.mandatory_toolbars.includes(toolbar);
	},

	//
	// setting methods
	//

	setToolbarVisible: function(kind, value) {
		if (value) {
			if (this.hasChildView(kind)) {
				this.setToolbarRegionVisible(kind, true);
			} else {
				this.showToolbar(kind);
			}
		} else if (this.hasChildView(kind)) {
			this.setToolbarRegionVisible(kind, false);
		}
	},

	setToolbarRegionVisible: function(kind, visible) {
		if (visible) {
			this.getRegion(kind).$el.removeClass('hidden');
		} else {
			this.getRegion(kind).$el.addClass('hidden');
		}
	},

	setToolbarsVisible: function(visible) {
		if (Array.isArray(visible)) {
			for (let i = 0; i < this.toolbars.length; i++) {
				let toolbar = this.toolbars[i];

				// set visibility of optional toolbars
				//
				if (this.isOptionalToolbarKind(toolbar)) {
					let isVisible = visible.includes(toolbar);
					this.setToolbarVisible(toolbar, isVisible);
				}
			}
		} else {
			this.setAllToolbarsVisible(visible);
		}
	},

	setAllToolbarsVisible: function(isVisible) {
		for (let i = 0; i < this.toolbars.length; i++) {
			let toolbar = this.toolbars[i];

			// set visibility of optional toolbars
			//
			if (this.isOptionalToolbarKind(toolbar)) {
				this.setToolbarVisible(toolbar, isVisible);
			}
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.app = this.getParentView('app');

		// show child views
		//
		this.showToolbars();

		// disable toolbars
		//
		if (this.enabled) {
			let enabled = _.result(this, 'enabled');
			this.setToolbarsEnabled(this.getTrueKeys(enabled));
		}

		// set initial toolbar visibility
		//
		if (this.app.preferences.has('toolbars')) {
			this.setToolbarsVisible(this.app.preferences.get('toolbars'));
		}
	},

	showToolbars: function() {
		let regionNames = Object.keys(this.regions);
		let toolbars = this.app.preferences.get('toolbars');

		for (let i = 0; i < regionNames.length; i++) {
			let kind = regionNames[i]
			this.showToolbar(kind);

			// set toolbar visibility
			//
			if (this.isOptionalToolbarKind(kind)) {
				if (typeof toolbars == 'boolean') {
					this.setToolbarVisible(kind, toolbars);
				} else if (toolbars && toolbars.length > 0) {
					this.setToolbarVisible(kind, toolbars && toolbars.includes(kind));
				}
			}
		}
	},

	showToolbar: function(kind) {
		switch (kind) {
			case 'window':
				this.showWindowBar();
				break;
			case 'status':
				this.showStatusBar();
				break;
		}
	},

	showWindowBar: function() {
		this.showChildView('window', this.getWindowBarView());
	},

	showStatusBar: function() {
		this.showChildView('status', this.getStatusBarView());
	}
});